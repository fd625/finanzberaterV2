import { supabase } from "../database";

// Ein einfacher Event-Callback
let onContractsChange = null;

export const contractManager = {

    setOnContractsChange(callback) {
        onContractsChange = callback;
    },

    async getAllContracts() {
        const { data, error } = await supabase.from("contracts").select("*");
        if (error) throw error;
        return data || [];
    },

    async createContract(contractData) {
        const { data, error } = await supabase.from("contracts").insert(contractData).select().single();
        if (error) throw error;
        if (onContractsChange) onContractsChange();
        return data;
    },

    async updateContract(id, updates) {
        const { data, error } = await supabase.from("contracts").update(updates).eq("id", id).select().single();
        if (error) throw error;
        if (onContractsChange) onContractsChange();
        return data;
    },

    async deleteContract(id) {
        const { error } = await supabase.from("contracts").delete().eq("id", id);
        if (error) throw error;
        if (onContractsChange) onContractsChange();
        return true;
    },

    async getContractById(id) {
        const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
    }
};

export default contractManager;
