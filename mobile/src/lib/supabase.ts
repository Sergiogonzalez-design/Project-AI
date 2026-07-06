import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_PROJECT_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from "./supabase-config";

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
