import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjhwpkttomnyvlswluvm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaHdwa3R0b21ueXZsc3dsdXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjMyOTAsImV4cCI6MjA3OTIzOTI5MH0.IMa_w7JbUviSUxgaZ9VHev9eAF6VRpI-sux0V4bnvSU';
export const supabase = createClient(supabaseUrl, supabaseKey);