import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Calendar, Camera, Edit2, Save, X,
  Leaf, TrendingUp, Award, Activity, Upload, CheckCircle, AlertCircle,
  FileText, Eye, Clock
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import TranslatedText from '../components/TranslatedText'
import { getRealUserStats, getRecentReports } from '../services/profileService'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Profile data - ensure all fields default to empty string (not null)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    location: '',
    farm_size: '',
    primary_crops: '',
    experience_years: '',
    avatar_url: ''
  })

  // Stats data
  const [stats, setStats] = useState({
    diseases_detected: 0,
    treatments_received: 0,
    queries_asked: 0,
    days_active: 0
  })
  
  // Recent reports data
  const [recentReports, setRecentReports] = useState([])

  useEffect(() => {
    if (user) {
      loadProfile()
      loadStats()
      loadRecentReports()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        // Convert null values to empty strings to avoid React warnings
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          location: data.location || '',
          farm_size: data.farm_size || '',
          primary_crops: data.primary_crops || '',
          experience_years: data.experience_years || '',
          avatar_url: data.avatar_url || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Load REAL user activity stats
      const { data, error } = await getRealUserStats()

      if (data && !error) {
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }
  
  const loadRecentReports = async () => {
    try {
      const { data, error } = await getRecentReports(5)
      
      if (data && !error) {
        setRecentReports(data)
      }
    } catch (error) {
      console.error('Error loading recent reports:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setEditing(false)
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      
      // Save to database
      await supabase
        .from('profiles')
        .upsert({ id: user.id, avatar_url: publicUrl })

      setMessage({ type: 'success', text: 'Avatar updated successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading avatar' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/70">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-agro-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold"><TranslatedText>Loading profile...</TranslatedText></p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/70 backdrop-blur-sm py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Message Banner */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 border-l-4 border-green-500' 
                : 'bg-red-50 border-l-4 border-red-500'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message.text}
            </p>
          </motion.div>
        )}

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-agro-green-400 to-agro-green-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-agro-green-600 hover:bg-agro-green-700 text-white p-2 rounded-full cursor-pointer transition shadow-lg">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.full_name || user.email?.split('@')[0]}
                </h1>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Edit2 className="w-5 h-5 text-agro-green-600" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="p-2 bg-agro-green-600 hover:bg-agro-green-700 text-white rounded-lg transition"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false)
                        loadProfile()
                      }}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {profile.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.experience_years && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span><TranslatedText>{profile.experience_years} years farming</TranslatedText></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-agro-green-600" />
                <TranslatedText>Your Activity</TranslatedText>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Leaf className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><TranslatedText>Diseases Detected</TranslatedText></p>
                      <p className="text-2xl font-bold text-gray-900">{stats.diseases_detected}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><TranslatedText>Treatments Received</TranslatedText></p>
                      <p className="text-2xl font-bold text-gray-900">{stats.treatments_received}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><TranslatedText>AI Queries Asked</TranslatedText></p>
                      <p className="text-2xl font-bold text-gray-900">{stats.queries_asked}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600"><TranslatedText>Days Active</TranslatedText></p>
                      <p className="text-2xl font-bold text-gray-900">{stats.days_active}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Details Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-agro-green-600" />
                <TranslatedText>Profile Information</TranslatedText>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TranslatedText>Full Name</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="Rajesh Kumar"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TranslatedText>Phone Number</TranslatedText>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TranslatedText>Location</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="Mumbai, Maharashtra"
                  />
                </div>

                {/* Farm Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TranslatedText>Farm Size (acres)</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="farm_size"
                    value={profile.farm_size}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="5 acres"
                  />
                </div>

                {/* Primary Crops */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TranslatedText>Primary Crops</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="primary_crops"
                    value={profile.primary_crops}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="Rice, Wheat, Cotton"
                  />
                </div>

                {/* Experience Years */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TranslatedText>Farming Experience (years)</TranslatedText>
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={profile.experience_years}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition disabled:bg-gray-100"
                    placeholder="10"
                  />
                </div>
              </div>

              {editing && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span><TranslatedText>Saving...</TranslatedText></span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span><TranslatedText>Save Changes</TranslatedText></span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      loadProfile()
                    }}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                  >
                    <TranslatedText>Cancel</TranslatedText>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Saved Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-agro-green-600" />
                <TranslatedText>Saved Reports</TranslatedText>
              </h2>
              <button
                onClick={() => navigate('/my-reports')}
                className="text-agro-green-600 hover:text-agro-green-700 font-semibold transition"
              >
                <TranslatedText>View All</TranslatedText> →
              </button>
            </div>

            {recentReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  <TranslatedText>No saved reports yet</TranslatedText>
                </p>
                <button
                  onClick={() => navigate('/disease-detection')}
                  className="btn-primary"
                >
                  <TranslatedText>Detect Disease</TranslatedText>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-agro-green-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/reports/${report.id}`, { state: { report } })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Leaf className="w-5 h-5 text-agro-green-600" />
                          <h3 className="font-bold text-gray-900">
                            <TranslatedText>{report.disease_name}</TranslatedText>
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {report.crop_name}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            report.severity === 'High' ? 'bg-red-100 text-red-800' :
                            report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            <TranslatedText>{report.severity}</TranslatedText>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/reports/${report.id}`, { state: { report } })
                        }}
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
