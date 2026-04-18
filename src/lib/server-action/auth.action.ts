"use server";
import { SignUpDataType } from "@/schemas/validation/auth.validation";
import { createSupabaseServerAction } from "@/supabase/supabaseServer";
import { handlePostgresError } from "../error/postgres-error";
import { MutationResult } from "@/types/common";
import { User } from "@supabase/supabase-js";
import { console } from "inspector";

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createSupabaseServerAction();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUpWithEmail(signUpData: {
  email: string;
  password: string;
}): Promise<User | null> {
  const supabase = await createSupabaseServerAction();

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: signUpData.email,
    password: signUpData.password,
  });

  if (error) {
    handlePostgresError(error);
  }
  return user;
}

export async function signOut() {
  const supabase = await createSupabaseServerAction();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
