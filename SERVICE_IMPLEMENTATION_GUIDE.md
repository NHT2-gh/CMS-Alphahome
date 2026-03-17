# Service Implementation Guide

This document provides instructions for implementing services in the CMS application, following the established patterns and architecture.

## Architecture Overview

The service layer is organized into three main components:

1. **Base API Service** (`api.ts`) - Handles HTTP requests and common functionality
2. **Domain Services** (`*.service.ts`) - Business logic for specific entities
3. **Service Index** (`index.ts`) - Centralized exports

## File Structure

```
src/services/
├── api.ts              # Base API service class
├── index.ts            # Export all services
├── user.service.ts     # User domain service
└── [entity].service.ts # Other domain services
```

## 1. Base API Service (`api.ts`)

The base API service provides a foundation for all HTTP operations with consistent error handling and configuration.

### Key Features:
- **Environment-aware base URL**: Handles both server-side and client-side requests
- **Standardized request handling**: Consistent headers, error handling, and response parsing
- **Full HTTP method support**: GET, POST, PUT, PATCH, DELETE
- **TypeScript generics**: Type-safe responses with `APIResponse<T>`

### Usage Pattern:
```typescript
// Internal use only - domain services should extend this
const response = await apiService.get<EntityType>('/api/endpoint');
const data = await apiService.post<EntityType>('/api/endpoint', payload);
```

## 2. Domain Services Implementation

### Step 1: Define Types

Create or update types in `/src/types/[entity].ts`:

```typescript
// Example: /src/types/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  // ... other properties
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  // ... required fields for creation
}

export interface CourseFilter {
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
  order?: "ASC" | "DESC" | null;
  from_date?: Date | null;
  to_date?: Date | null;
  page?: number;
  limit?: number;
}
```

### Step 2: Create Domain Service

Create `/src/services/[entity].service.ts`:

```typescript
import { Course, CreateCourseDTO, CourseFilter } from "@/types/course";
import { apiService } from "./api";
import { APIResponse } from "@/types/other";

/**
 * Course service for handling course-related API operations
 */
class CourseService {
  private readonly baseEndpoint = "/api/courses";

  /**
   * Get all courses with optional filters
   */
  async getCourses(filters?: CourseFilter): Promise<APIResponse<Course[]>> {
    let endpoint = this.baseEndpoint;

    if (filters) {
      const searchParams = new URLSearchParams();

      // Add filter parameters
      if (filters.search?.trim()) searchParams.set("search", filters.search);
      if (filters.category?.trim()) searchParams.set("category", filters.category);
      if (filters.status?.trim()) searchParams.set("status", filters.status);
      if (filters.sort?.trim()) searchParams.set("sort", filters.sort);
      if (filters.order?.trim()) searchParams.set("order", filters.order);
      
      // Handle date filters
      if (filters.from_date) {
        searchParams.set("from_date", filters.from_date.toISOString().split("T")[0]);
      }
      if (filters.to_date) {
        searchParams.set("to_date", filters.to_date.toISOString().split("T")[0]);
      }
      
      // Handle pagination
      if (filters.page) searchParams.set("page", filters.page.toString());
      if (filters.limit) searchParams.set("limit", filters.limit.toString());

      const queryString = searchParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return await apiService.get<Course[]>(endpoint);
  }

  /**
   * Get a single course by ID
   */
  async getCourseById(id: string): Promise<Course> {
    const response = await apiService.get<Course>(`${this.baseEndpoint}/${id}`);
    return response.data;
  }

  /**
   * Create a new course
   */
  async createCourse(courseData: CreateCourseDTO): Promise<Course> {
    const response = await apiService.post<Course>(this.baseEndpoint, courseData);
    return response.data;
  }

  /**
   * Update an existing course
   */
  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    const response = await apiService.patch<Course>(
      `${this.baseEndpoint}/${id}`,
      courseData
    );
    return response.data;
  }

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<Course> {
    const response = await apiService.delete<Course>(`${this.baseEndpoint}/${id}`);
    return response.data;
  }
}

export const courseService = new CourseService();
```

### Step 3: Update Service Index

Add the new service to `/src/services/index.ts`:

```typescript
export { apiService } from "./api";
export { userService } from "./user.service";
export { courseService } from "./course.service"; // Add new service
```

## 3. Service Implementation Patterns

### Standard CRUD Operations

Every domain service should implement these core methods:

1. **`getEntities(filters?)`** - List with optional filtering/pagination
2. **`getEntityById(id)`** - Single entity retrieval
3. **`createEntity(data)`** - Entity creation
4. **`updateEntity(id, data)`** - Entity update (use PATCH)
5. **`deleteEntity(id)`** - Entity deletion

### Filter Implementation Pattern

```typescript
// Build query parameters from filter object
if (filters) {
  const searchParams = new URLSearchParams();
  
  // String filters
  if (filters.search?.trim()) searchParams.set("search", filters.search);
  
  // Enum/select filters
  if (filters.status?.trim()) searchParams.set("status", filters.status);
  
  // Boolean filters
  if (filters.published !== undefined) {
    searchParams.set("published", filters.published.toString());
  }
  
  // Date filters (convert to ISO date string)
  if (filters.from_date) {
    searchParams.set("from_date", filters.from_date.toISOString().split("T")[0]);
  }
  
  // Numeric filters
  if (filters.page) searchParams.set("page", filters.page.toString());
  
  // Apply to endpoint
  const queryString = searchParams.toString();
  if (queryString) endpoint += `?${queryString}`;
}
```

### Error Handling

The base API service handles errors automatically. Domain services should:

- Let errors bubble up for components to handle
- Add specific business logic validation if needed
- Use try/catch only for service-specific error handling

### Response Handling

```typescript
// For list operations - return full APIResponse (includes pagination)
async getEntities(): Promise<APIResponse<Entity[]>> {
  return await apiService.get<Entity[]>(endpoint);
}

// For single operations - return data directly
async getEntityById(id: string): Promise<Entity> {
  const response = await apiService.get<Entity>(`${endpoint}/${id}`);
  return response.data;
}
```

## 4. Usage in Components

### Import Services

```typescript
import { courseService } from "@/services";
```

### Component Integration

```typescript
// In React components
const [courses, setCourses] = useState<Course[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses({ status: 'active' });
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);
```

## 5. Best Practices

### Naming Conventions

- **Service files**: `[entity].service.ts` (e.g., `course.service.ts`)
- **Service classes**: `[Entity]Service` (e.g., `CourseService`)
- **Service instances**: `[entity]Service` (e.g., `courseService`)
- **Methods**: Use descriptive names (`getCourses`, `createCourse`, etc.)

### Type Safety

- Always use TypeScript interfaces for entities and DTOs
- Leverage generic types for API responses
- Define filter interfaces for complex queries

### Documentation

- Add JSDoc comments for all public methods
- Document expected parameters and return types
- Include usage examples for complex operations

### Testing Considerations

- Services should be easily mockable
- Separate business logic from HTTP concerns
- Use dependency injection patterns where needed

## 6. Advanced Patterns

### Custom Endpoints

```typescript
// For non-standard operations
async publishCourse(id: string): Promise<Course> {
  const response = await apiService.patch<Course>(
    `${this.baseEndpoint}/${id}/publish`,
    {}
  );
  return response.data;
}

async getCourseStats(id: string): Promise<CourseStats> {
  const response = await apiService.get<CourseStats>(
    `${this.baseEndpoint}/${id}/stats`
  );
  return response.data;
}
```

### Batch Operations

```typescript
async bulkUpdateCourses(updates: BulkUpdateRequest[]): Promise<Course[]> {
  const response = await apiService.patch<Course[]>(
    `${this.baseEndpoint}/bulk`,
    { updates }
  );
  return response.data;
}
```

### File Uploads

```typescript
async uploadCourseImage(id: string, file: File): Promise<Course> {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await apiService.post<Course>(
    `${this.baseEndpoint}/${id}/image`,
    formData,
    { 'Content-Type': 'multipart/form-data' }
  );
  return response.data;
}
```

## 7. Migration Guide

When adding services to existing code:

1. **Create types first** - Define interfaces in `/src/types/`
2. **Implement service** - Follow the established patterns
3. **Update index** - Export from `/src/services/index.ts`
4. **Refactor components** - Replace direct API calls with service methods
5. **Test thoroughly** - Ensure all CRUD operations work correctly

## 8. Common Pitfalls

- **Don't bypass the service layer** - Always use services for API calls
- **Handle loading states** - Services are async, components need loading indicators
- **Validate inputs** - Check required fields before making API calls
- **Use proper HTTP methods** - GET for reading, POST for creation, PATCH for updates
- **Return appropriate data** - Lists return full APIResponse, singles return data only

This guide ensures consistent, maintainable, and type-safe service implementations across the CMS application.
