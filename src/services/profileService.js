// services/profileService.js
import { supabase } from '../database.js';

export const profileService = {

  async getProfileById(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Fehler beim Laden des Profils');
    }
  },

  async updateProfile(userId, profileData) {
    try {
      const updateData = {
        ...profileData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Fehler beim Aktualisieren des Profils');
    }
  },


  validateUsername(username) {
    if (!username || !username.trim()) {
      return { valid: false, error: 'Benutzername ist erforderlich.' };
    }
    if (username.trim().length < 3) {
      return { valid: false, error: 'Benutzername muss mindestens 3 Zeichen lang sein.' };
    }
    return { valid: true };
  },


  validateSalary(salary) {
    if (salary !== null && salary !== undefined && salary < 0) {
      return { valid: false, error: 'Das Gehalt muss positiv sein.' };
    }
    return { valid: true };
  },

  calculateRemainingSalary(salary, totalContracts) {
    return (salary || 0) - (totalContracts || 0);
  }
};