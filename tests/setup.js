import { vi } from "vitest";

// Mock Supabase
vi.mock("@supabase/supabase-js", () => ({
    createClient: vi.fn(() => ({
        auth: {
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signOut: vi.fn(),
            getUser: vi.fn(),
            getSession: vi.fn()
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn()
        }))
    }))
}));

// Mock environment variables
vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-key");
