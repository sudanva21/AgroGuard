import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Calendar, Leaf, AlertCircle, CheckCircle, Info, 
  FileText, Download, Share2, Trash2, Eye
} from 'lucide-react'
import { getReportById, deleteReport } from '../services/reportService'
import { getTreatmentRecommendations } from '../services/agricultureService'
import TranslatedText from '../components/TranslatedText'
import TreatmentModal from '../components/TreatmentModal'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

const ReportDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [report, setReport] = useState(location.state?.report || null)
  const [loading, setLoading] = useState(!report)
  const [showTreatmentModal, setShowTreatmentModal] = useState(false)
  
  // Toast and dialog
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: () => {} })
  
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type })
  }

  useEffect(() => {
    if (!report && id) {
      loadReport()
    }
  }, [id])

  const loadReport = async () => {
    setLoading(true)
    const { data, error } = await getReportById(id)
    
    if (error) {
      showToast('Error loading report: ' + error, 'error')
      navigate('/my-reports')
    } else {
      setReport(data)
    }
    setLoading(false)
  }

  const handleDelete = () => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this report? This action cannot be undone.',
      onConfirm: async () => {
        const { success, error } = await deleteReport(report.id)
        if (success) {
          showToast('Report deleted successfully', 'success')
          setTimeout(() => navigate('/my-reports'), 1500)
        } else {
          showToast('Error deleting report: ' + error, 'error')
        }
      }
    })
  }

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800 border-green-300',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'High': 'bg-red-100 text-red-800 border-red-300',
      'Unknown': 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[severity] || colors['Unknown']
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-agro-green-600"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText>Report Not Found</TranslatedText>
          </h2>
          <button onClick={() => navigate('/my-reports')} className="btn-primary mt-4">
            <TranslatedText>Back to Reports</TranslatedText>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-reports')}
          className="flex items-center gap-2 text-gray-600 hover:text-agro-green-600 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span><TranslatedText>Back to Reports</TranslatedText></span>
        </button>

        {/* Report Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="w-8 h-8 text-agro-green-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  <TranslatedText>{report.disease_name}</TranslatedText>
                </h1>
              </div>
              
              <p className="text-lg text-gray-600 italic mb-4">
                <TranslatedText>{report.scientific_name}</TranslatedText>
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                  <TranslatedText>Crop:</TranslatedText> {report.crop_name}
                </span>
                <span className={`px-4 py-2 rounded-full font-semibold border-2 ${getSeverityColor(report.severity)}`}>
                  <TranslatedText>Severity:</TranslatedText> <TranslatedText>{report.severity}</TranslatedText>
                </span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                  <TranslatedText>Confidence:</TranslatedText> {report.confidence}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {formatDate(report.created_at)}
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                <TranslatedText>Method:</TranslatedText> <TranslatedText>{report.detection_method}</TranslatedText>
              </span>
            </div>
          </div>

          {/* Urgency Banner */}
          {report.urgency && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 mb-1">
                    <TranslatedText>Urgency</TranslatedText>
                  </p>
                  <p className="text-orange-800">
                    <TranslatedText>{report.urgency}</TranslatedText>
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-agro-green-600" />
            <TranslatedText>Description</TranslatedText>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            <TranslatedText>{report.description}</TranslatedText>
          </p>
        </motion.div>

        {/* Symptoms and Causes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-6"
        >
          {/* Symptoms */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <TranslatedText>Common Symptoms</TranslatedText>
            </h2>
            <ul className="space-y-3">
              {report.symptoms?.map((symptom, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">
                    <TranslatedText>{symptom}</TranslatedText>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <TranslatedText>Favorable Conditions</TranslatedText>
            </h2>
            <ul className="space-y-3">
              {report.causes?.map((cause, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">
                    <TranslatedText>{cause}</TranslatedText>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowTreatmentModal(true)}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              <TranslatedText>View Treatment Options</TranslatedText>
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              <TranslatedText>Delete Report</TranslatedText>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Treatment Modal */}
      <TreatmentModal
        isOpen={showTreatmentModal}
        onClose={() => setShowTreatmentModal(false)}
        disease={report.disease_name}
        crop={report.crop_name}
      />

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

export default ReportDetails
