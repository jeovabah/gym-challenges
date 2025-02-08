import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const SUPABASE_URL = "https://eciwmuwdqlzrryamjzjl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaXdtdXdkcWx6cnJ5YW1qempsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTgwNzAsImV4cCI6MjA1MzA3NDA3MH0.YjfsJpPxv9ylyS_uFwrCybTY_a5bmcQ6DBzVqbyhS4Y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
