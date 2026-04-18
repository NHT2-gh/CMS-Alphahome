import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { Profile } from "@/types/profile";

class ProfileService {
  private tableName: string;
  private supabase: any;
  constructor() {
    this.tableName = "profiles";
    this.supabase = supabase;
  }

  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) handlePostgresError(error);

    return data;
  }

  async createProfile(userId: string, fullName: string): Promise<Profile> {
    const { data, error } = await this.supabase.from(this.tableName).insert({
      id: userId,
      full_name: fullName,
    });

    if (error) handlePostgresError(error);

    return data;
  }
}

export const profileService = new ProfileService();
