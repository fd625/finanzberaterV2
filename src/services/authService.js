// services/authService.js
import { supabase } from '../database.js';

export const authService = {

  async changePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Fehler beim Ändern des Passworts');
    }
  },

  validatePassword(password, confirmPassword) {
    if (!password) {
      return { valid: false, error: 'Neues Passwort ist erforderlich.' };
    }
    
    if (password.length < 6) {
      return { valid: false, error: 'Das Passwort muss mindestens 6 Zeichen lang sein.' };
    }
    
    if (password !== confirmPassword) {
      return { valid: false, error: 'Die Passwörter stimmen nicht überein.' };
    }
    
    return { valid: true };
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Fehler beim Abmelden');
    }
  }
};