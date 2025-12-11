import { supabase } from "../database";

export const userManager = {
    async getProfile(userId) {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            throw error;
        }
        return data;
    },

    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .single();

        if (error) {
            throw error;
        }
        return data;
    },

    async registerUser({ email, password, username, salary }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    salary
                }
            }
        });

        if (error) {
            throw error;
        }

        return data;
    }
};

export default userManager;