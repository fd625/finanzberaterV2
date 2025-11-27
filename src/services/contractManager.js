import { supabase } from "../database";

export const contractManager = {
    
    // Alle Verträge laden
    async getAllContracts() {
        const { data, error } = await supabase
            .from("contracts")
            .select("*")

        if (error) throw error;
        return data || [];
    },

    // Vertrag erstellen
    async createContract(contractData) {
        const { data, error } = await supabase
            .from("contracts")
            .insert(contractData)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Vertrag aktualisieren
    async updateContract(id, updates) {
        const { data, error } = await supabase
            .from("contracts")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Vertrag löschen
    async deleteContract(id) {
        const { error } = await supabase
            .from("contracts")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    }
};

export default contractManager;