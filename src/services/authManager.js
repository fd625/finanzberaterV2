import { supabase } from "../database";

export const authManager = {
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {throw error;}
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {throw error;}

        localStorage.setItem("access_token", data.session.access_token);
        return data;
    },

    async signOut() {
        await supabase.auth.signOut();
        localStorage.removeItem("access_token");
    },

    async getSession() {
        const { data } = await supabase.auth.getSession();
        return data.session;
    }
};
export default authManager;