# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**GEARVN CMS** - A modern admin dashboard built with Next.js 15, React 19, and Tailwind CSS v4.

- **Next.js**: 15.4.3 with App Router
- **React**: 19.0.0
- **Tailwind CSS**: 4.1.11
- **TypeScript**: 5.x
- **Package Manager**: pnpm

---

## Development Commands

```bash
pnpm install           # Install dependencies
pnpm run dev          # Start development server (http://localhost:3000)
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
```

---

## Directory Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Main CMS application
│   │   │   ├── layout.tsx     # Admin layout with sidebar
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── category-specs/
│   │   │   └── product-spec-details/
│   │   └── template/          # TailAdmin Pro reference (70+ pages)
│   │       └── (admin)/       # Template pages for reference
│   ├── components/            # Reusable components (30+ folders)
│   ├── layout/                # Layout components
│   │   ├── AppHeader.tsx      # Header with navigation
│   │   └── AppSidebar.tsx     # Sidebar with navigation
│   ├── context/               # React Context
│   │   ├── SidebarContext.tsx # Sidebar state
│   │   └── ThemeContext.tsx   # Theme state
│   ├── types/                 # TypeScript types
│   ├── lib/                   # Utilities
│   ├── hooks/                 # Custom hooks
│   └── _mocks/                # Mock data
│       ├── _nav.ts            # CMS navigation
│       └── _nav.template.ts   # Template navigation reference
├── public/                    # Static assets
└── providers/                 # Global providers
```

---

## Current Application Routes

**Main CMS** (Simplified navigation):
- `/` - Dashboard
- `/category-specs` - Category Specs
- `/product-spec-details` - Product Spec Details

**Template Reference** (Original TailAdmin Pro - 70+ pages):
- `/template/*` - All original template pages available for reference

---

## Key Architecture Patterns

### 1. App Router (Next.js 15)
- Server Components by default
- Use `"use client"` for interactive components
- Metadata export for page titles

### 2. Navigation
- Navigation config: `src/_mocks/_nav.ts`
- Template navigation: `src/_mocks/_nav.template.ts`
- Sidebar component: `src/layout/AppSidebar.tsx`

### 3. State Management
- **Sidebar**: React Context (`src/context/SidebarContext.tsx`)
- **Theme**: React Context (`src/context/ThemeContext.tsx`)
- No Redux or Zustand

### 4. Styling
- **Tailwind CSS v4** with custom theme in `src/app/globals.css`
- Use `@theme` for theme configuration
- Custom utilities: `menu-item`, `menu-item-active`, etc.

### 5. Forms
- **react-hook-form** + **Zod** for validation
- Form components in `src/components/form/`
- Field types: `src/types/form.ts`

### 6. API Integration
- Axios instance: `src/lib/axios.ts`
- API paths: `src/config/api-paths.ts`

---

## Component Development Guidelines

### Finding Components for Reference

When implementing new features, look up existing components in the template:

**Component Locations:**
- UI Components: `src/components/ui/` (buttons, cards, modals, etc.)
- Form Components: `src/components/form/`
- Chart Components: `src/components/charts/`
- Table Components: `src/components/table/`
- Feature Components: `src/components/[feature]/` (ecommerce, ai, crm, etc.)

**Template Pages for Reference:**
- View template pages at `/template/*` in browser
- Source code: `src/app/template/`
- Navigation reference: `src/_mocks/_nav.template.ts`

### Component Reuse Strategy

1. **Find existing components** in `src/components/`
2. **Check template pages** in `src/app/template/` for examples
3. **Mix and adapt** components to fit your needs
4. **Don't duplicate** - reuse existing components when possible

### Example Workflow

```typescript
// 1. Check existing components
// src/components/ui/button/Button.tsx
// src/components/table/DataTable.tsx

// 2. Look at template usage
// src/app/template/(admin)/(others-pages)/(ecommerce)/products/page.tsx

// 3. Adapt and combine for your needs
// Mix DataTable + Button + your custom logic
```

---

## Important Files

### Configuration
- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config
- `src/app/globals.css` - Tailwind theme and custom utilities

### Navigation
- `src/_mocks/_nav.ts` - Current CMS navigation
- `src/_mocks/_nav.template.ts` - Template navigation (reference only)

### Layout
- `src/app/layout.tsx` - Root layout with title template
- `src/app/(admin)/layout.tsx` - Admin layout with sidebar
- `src/layout/AppSidebar.tsx` - Sidebar component
- `src/layout/AppHeader.tsx` - Header component

### Types
- `src/types/nav.ts` - Navigation types
- `src/types/form.ts` - Form field types
- `src/types/other.ts` - Other common types

---

## Page Metadata Pattern

All pages automatically get "| GEARVN CMS" appended to titles:

```typescript
// src/app/(admin)/your-page/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Page Name", // → "Your Page Name | GEARVN CMS"
  description: "Page description",
};
```

---

## Branding

- **App Name**: GEARVN CMS
- **Logo**: Text logo "GEARVN CMS" with blue "G" icon
- **Colors**: Brand blue (`brand-500: #465fff`)
- **Logo Location**: `src/layout/AppSidebar.tsx` (lines 273-286)

---

## Template Reference

The `/template` route contains the complete original TailAdmin Pro with:
- 7 dashboard types
- AI Assistant suite
- E-commerce pages
- UI component examples
- Chart examples
- Form examples
- Table examples

**Use template for:**
- Finding existing components
- Understanding component patterns
- Copying and adapting code
- UI/UX reference

**Template location:**
- Browser: `http://localhost:3000/template/*`
- Source: `src/app/template/`
- Navigation: `src/_mocks/_nav.template.ts`

---

## Common Tasks

### Add New Page
1. Create `src/app/(admin)/page-name/page.tsx`
2. Add route to `src/_mocks/_nav.ts`
3. Add metadata with title

### Add New Component
1. Check if similar component exists in `src/components/`
2. Check template pages for examples
3. Create in appropriate folder
4. Reuse existing patterns

### Update Navigation
- Edit `src/_mocks/_nav.ts` for CMS navigation
- Template navigation is in `src/_mocks/_nav.template.ts` (reference only)

### Style Changes
- Theme config: `src/app/globals.css` (`@theme` section)
- Custom utilities: `src/app/globals.css` (`@utility` section)
- Component styles: Use Tailwind classes

---

## Notes for Claude Code

- **Don't create new files** when similar components exist
- **Look at template** (`/template/*`) for reference implementations
- **Reuse and adapt** existing components instead of writing from scratch
- **Keep it simple** - follow existing patterns
- **Navigation** changes go in `src/_mocks/_nav.ts`
- **Title template** is already configured - just set `title: "Page Name"`
