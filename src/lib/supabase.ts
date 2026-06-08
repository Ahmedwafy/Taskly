export const baseURL =
  process.env.NEXT_PUBLIC_SUPABASE_BASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!;
