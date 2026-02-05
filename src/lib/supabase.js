import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Custom storage adapter to share session with .geeksproductionstudio.com
const cookieStorage = {
  getItem: (key) => {
    if (typeof document === 'undefined') return null;
    const name = `${key}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof document === 'undefined') return;
    const domain = '.geeksproductionstudio.com';
    // Save with required attributes: domain, path, SameSite=Lax, Secure
    // Setting a long max-age (1 year) to ensure persistence
    document.cookie = `${key}=${encodeURIComponent(value)}; domain=${domain}; path=/; SameSite=Lax; Secure; max-age=${60 * 60 * 24 * 365}`;
  },
  removeItem: (key) => {
    if (typeof document === 'undefined') return;
    const domain = '.geeksproductionstudio.com';
    // Remove by setting expiry to the past
    document.cookie = `${key}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
  }
};

// Initialize Supabase client with custom storage
// Note: Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your .env file
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
