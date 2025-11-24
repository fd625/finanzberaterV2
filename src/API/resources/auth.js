import { supabase } from '@/supabase.js'

class AuthApi {
  async signUp({ email, password, username, salary }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          salary: salary ? parseFloat(salary) : null
        }
      }
    })

    if (error) throw error
    return data
  }
  
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }

  async getUserProfile(userId) {
    if (!userId) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}

export default new AuthApi()