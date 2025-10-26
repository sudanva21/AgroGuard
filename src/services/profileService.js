import { supabase } from '../lib/supabase'

/**
 * Get real user statistics
 */
export const getRealUserStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Call the PostgreSQL function to get real stats
    const { data, error } = await supabase
      .rpc('get_real_user_stats', { user_uuid: user.id })

    if (error) {
      console.error('Error from function:', error)
      // Fallback: calculate manually
      return await calculateStatsManually(user.id)
    }

    return { data: data?.[0] || {}, error: null }
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return default stats if function doesn't exist yet
    return { 
      data: {
        diseases_detected: 0,
        treatments_received: 0,
        queries_asked: 0,
        days_active: 0
      }, 
      error: error.message 
    }
  }
}

/**
 * Fallback function to calculate stats manually
 */
const calculateStatsManually = async (userId) => {
  try {
    // Count disease reports
    const { count: diseasesCount } = await supabase
      .from('disease_reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Count treatment records
    const { count: treatmentsCount } = await supabase
      .from('treatment_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get first activity date to calculate days active
    const { data: firstReport } = await supabase
      .from('disease_reports')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    let daysActive = 0
    if (firstReport) {
      const firstDate = new Date(firstReport.created_at)
      const today = new Date()
      daysActive = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24))
    }

    return {
      data: {
        diseases_detected: diseasesCount || 0,
        treatments_received: treatmentsCount || 0,
        queries_asked: diseasesCount || 0, // Using disease reports as queries
        days_active: daysActive
      },
      error: null
    }
  } catch (error) {
    return {
      data: {
        diseases_detected: 0,
        treatments_received: 0,
        queries_asked: 0,
        days_active: 0
      },
      error: error.message
    }
  }
}

/**
 * Get user's recent reports (for saved reports section)
 */
export const getRecentReports = async (limit = 5) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('disease_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching recent reports:', error)
    return { data: [], error: error.message }
  }
}

export default {
  getRealUserStats,
  getRecentReports
}
