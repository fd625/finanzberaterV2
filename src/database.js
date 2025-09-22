import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vwlhtbzamanksjzlcgdv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3bGh0YnphbWFua3NqemxjZ2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjIwNTcsImV4cCI6MjA3NDAzODA1N30.90wxe6VQRlcCvMwaLN4Z27Yg6v2jNTG-fTpJOKZktsI';

export const supabase = createClient(supabaseUrl, supabaseKey);