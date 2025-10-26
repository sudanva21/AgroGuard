import React, { useState, useEffect } from 'react'
import { FileText, Calendar, Leaf, AlertCircle, Trash2, Eye, Download, Filter } from 'lucide-react'
import { getUserReports, deleteReport } from '../services/reportService'
import { useNavigate } from 'react-router-dom'
import TranslatedText from '../components/TranslatedText'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

const MyReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCrop, setFilterCrop] = useState('')
  const navigate = useNavigate()
  
  // State for notifications
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: () => {}, reportId: null })
  
  // Helper function
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type })
  }

  useEffect(() => {
    loadReports()
  }, [filterCrop])

  const loadReports = async () => {
    setLoading(true)
    const options = filterCrop ? { crop: filterCrop } : {}
    const { data, error } = await getUserReports(options)
    
    if (error) {
      showToast('Error loading reports: ' + error, 'error')
    } else {
      setReports(data || [])
    }
    setLoading(false)
  }

  const handleDelete = (reportId) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this report? This action cannot be undone.',
      reportId,
      onConfirm: async () => {
        const { success, error } = await deleteReport(reportId)
        if (success) {
          setReports(reports.filter(r => r.id !== reportId))
          showToast('Report deleted successfully', 'success')
        } else {
          showToast('Error deleting report: ' + error, 'error')
        }
      }
    })
  }

  const handleViewReport = (report) => {
    // Navigate to detailed view with report data
    navigate(`/reports/${report.id}`, { state: { report } })
  }

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800',
      'Unknown': 'bg-gray-100 text-gray-800'
    }
    return colors[severity] || colors['Unknown']
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const uniqueCrops = [...new Set(reports.map(r => r.crop_name))].filter(Boolean)

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <TranslatedText>My Disease Reports</TranslatedText>
          </h1>
          <p className="text-lg text-gray-600">
            <TranslatedText>View and manage your saved disease detection reports</TranslatedText>
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterCrop}
              onChange={(e) => setFilterCrop(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500"
            >
              <option value="">
                <TranslatedText>All Crops</TranslatedText>
              </option>
              {uniqueCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            <span className="text-gray-600">
              <TranslatedText>Total Reports:</TranslatedText> <strong>{reports.length}</strong>
            </span>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              <TranslatedText>Loading reports...</TranslatedText>
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <TranslatedText>No Reports Yet</TranslatedText>
            </h3>
            <p className="text-gray-600 mb-6">
              <TranslatedText>Start by detecting diseases to create your first report</TranslatedText>
            </p>
            <button
              onClick={() => navigate('/disease-detection')}
              className="btn-primary"
            >
              <TranslatedText>Detect Disease</TranslatedText>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Leaf className="w-6 h-6 text-agro-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">
                          <TranslatedText>{report.disease_name}</TranslatedText>
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 italic mb-3">
                        <TranslatedText>{report.scientific_name}</TranslatedText>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          <TranslatedText>Crop:</TranslatedText> {report.crop_name}
                        </span>
                        <span className={`text-sm px-3 py-1 rounded-full ${getSeverityColor(report.severity)}`}>
                          <TranslatedText>Severity:</TranslatedText> <TranslatedText>{report.severity}</TranslatedText>
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                          <TranslatedText>Confidence:</TranslatedText> {report.confidence}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(report.created_at)}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    <TranslatedText>{report.description}</TranslatedText>
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <TranslatedText>View Details</TranslatedText>
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <TranslatedText>Delete</TranslatedText>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        message={confirmDialog.message}
        title="Delete Report"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default MyReports
