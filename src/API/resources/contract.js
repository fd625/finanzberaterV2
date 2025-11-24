import { supabase } from '@/supabase.js'

class ContractApi {
  async getContractsByUser(userId) {
    if (!userId) return []
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async addContract(userId, contractData) {
    if (!userId) throw new Error('User ID missing')
    const { data, error } = await supabase
      .from('contracts')
      .insert([{ ...contractData, user_id: userId }])
      .select()
    if (error) throw error
    return data[0]
  }

  async deleteContract(userId, contractId) {
    if (!userId) throw new Error('User ID missing')
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', contractId)
      .eq('user_id', userId)
    if (error) throw error
    return true
  }
}

export default new ContractApi()