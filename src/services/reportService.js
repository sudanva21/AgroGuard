import { supabase } from '../lib/supabase'

/**
 * Save disease detection report to Supabase
 * @param {Object} reportData - Report data
 * @returns {Promise<Object>} - Saved report
 */
export const saveReport = async (reportData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const report = {
      user_id: user.id,
      crop_name: reportData.crop,
      detection_method: reportData.method,
      disease_name: reportData.disease,
      scientific_name: reportData.scientificName,
      severity: reportData.severity,
      confidence: reportData.confidence,
      description: reportData.description,
      urgency: reportData.urgency,
      symptoms: reportData.symptoms || [],
      causes: reportData.causes || [],
      input_symptoms: reportData.inputSymptoms || {},
      image_url: reportData.imageUrl || null
    }

    const { data, error } = await supabase
      .from('disease_reports')
      .insert([report])
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error saving report:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Get all reports for current user
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - List of reports
 */
export const getUserReports = async (options = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('disease_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Add filters if provided
    if (options.crop) {
      query = query.eq('crop_name', options.crop)
    }
    if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching reports:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Get a single report by ID
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} - Report data
 */
export const getReportById = async (reportId) => {
  try {
    const { data, error } = await supabase
      .from('disease_reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching report:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Delete a report
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteReport = async (reportId) => {
  try {
    const { error } = await supabase
      .from('disease_reports')
      .delete()
      .eq('id', reportId)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting report:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get user report statistics
 * @returns {Promise<Object>} - Statistics
 */
export const getUserStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .rpc('get_user_report_stats', { user_uuid: user.id })

    if (error) throw error

    return { data: data?.[0] || {}, error: null }
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return default stats if function doesn't exist yet
    return { 
      data: {
        total_reports: 0,
        reports_this_month: 0,
        most_common_disease: 'N/A',
        most_affected_crop: 'N/A'
      }, 
      error: null 
    }
  }
}

/**
 * Save treatment record
 * @param {Object} treatmentData - Treatment data
 * @returns {Promise<Object>} - Saved treatment
 */
export const saveTreatment = async (treatmentData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const treatment = {
      user_id: user.id,
      report_id: treatmentData.reportId,
      treatment_type: treatmentData.type,
      treatment_name: treatmentData.name,
      dosage: treatmentData.dosage,
      application_date: treatmentData.date,
      effectiveness: treatmentData.effectiveness || null,
      notes: treatmentData.notes || null
    }

    const { data, error } = await supabase
      .from('treatment_records')
      .insert([treatment])
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error saving treatment:', error)
    return { data: null, error: error.message }
  }
}

export default {
  saveReport,
  getUserReports,
  getReportById,
  deleteReport,
  getUserStats,
  saveTreatment
}
