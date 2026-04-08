import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { Category } from "@/types/transcription";

class CategoryService {
  private tableName: string;
  constructor() {
    this.tableName = "categories";
  }

  async getCategories(): Promise<Category[]> {
    const query = supabase.from(this.tableName).select("*").order("name", {
      ascending: true,
    });

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }
}

export const categoryService = new CategoryService();
