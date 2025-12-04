// services/contractService.js
import { supabase } from '../database.js';

export const contractService = {

  async getContractsByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw new Error('Fehler beim Laden der Verträge');
    }
  },

  async createContract(contractData) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([contractData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw new Error('Fehler beim Erstellen des Vertrags');
    }
  },

  async deleteContract(contractId, userId) {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw new Error('Fehler beim Löschen des Vertrags');
    }
  },

  async updateContract(contractId, userId, updateData) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update(updateData)
        .eq('id', contractId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw new Error('Fehler beim Aktualisieren des Vertrags');
    }
  },

  calculateTotalAmount(contracts) {
    return contracts.reduce((sum, contract) => sum + (contract.amount || 0), 0);
  }
};