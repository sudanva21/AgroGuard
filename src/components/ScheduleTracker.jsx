import React, { useState, useEffect } from 'react'
import { X, Calendar, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import TranslatedText from './TranslatedText'

const ScheduleTracker = ({ nutrientPlan, crop, isOpen, onClose }) => {
  const [schedule, setSchedule] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showMarkModal, setShowMarkModal] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [markApplicationData, setMarkApplicationData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [newApplication, setNewApplication] = useState({
    nutrient: '',
    date: '',
    notes: ''
  })

  // Load schedule from localStorage
  useEffect(() => {
    if (isOpen && crop) {
      const savedSchedule = localStorage.getItem(`schedule_${crop}`)
      if (savedSchedule) {
        try {
          const parsedSchedule = JSON.parse(savedSchedule)
          setSchedule(parsedSchedule)
        } catch (error) {
          console.error('Error parsing saved schedule:', error)
          initializeSchedule()
        }
      } else if (nutrientPlan) {
        // Initialize with recommended schedule only if no saved data
        initializeSchedule()
      }
    }
  }, [isOpen, crop])

  const initializeSchedule = () => {
    if (!nutrientPlan) return
    
    const initialSchedule = []
    
    // Add macronutrients to schedule
    nutrientPlan.macronutrients.forEach(nutrient => {
      // Parse timing to create schedule entries
      const timingParts = nutrient.timing.toLowerCase()
      
      if (timingParts.includes('split')) {
        // Create multiple entries for split applications
        if (timingParts.includes('sowing') || timingParts.includes('basal')) {
          initialSchedule.push({
            id: Date.now() + Math.random(),
            nutrient: nutrient.name,
            source: nutrient.source,
            dosage: nutrient.dosage,
            timing: 'At Sowing/Basal',
            status: 'pending',
            date: null,
            notes: ''
          })
        }
        if (timingParts.includes('vegetative')) {
          initialSchedule.push({
            id: Date.now() + Math.random(),
            nutrient: nutrient.name,
            source: nutrient.source,
            dosage: nutrient.dosage,
            timing: 'Vegetative Stage',
            status: 'pending',
            date: null,
            notes: ''
          })
        }
        if (timingParts.includes('flowering')) {
          initialSchedule.push({
            id: Date.now() + Math.random(),
            nutrient: nutrient.name,
            source: nutrient.source,
            dosage: nutrient.dosage,
            timing: 'Flowering Stage',
            status: 'pending',
            date: null,
            notes: ''
          })
        }
        if (timingParts.includes('fruiting')) {
          initialSchedule.push({
            id: Date.now() + Math.random(),
            nutrient: nutrient.name,
            source: nutrient.source,
            dosage: nutrient.dosage,
            timing: 'Fruiting Stage',
            status: 'pending',
            date: null,
            notes: ''
          })
        }
      } else {
        // Single application
        initialSchedule.push({
          id: Date.now() + Math.random(),
          nutrient: nutrient.name,
          source: nutrient.source,
          dosage: nutrient.dosage,
          timing: nutrient.timing,
          status: 'pending',
          date: null,
          notes: ''
        })
      }
    })
    
    setSchedule(initialSchedule)
    saveSchedule(initialSchedule)
  }

  const saveSchedule = (scheduleData) => {
    if (crop) {
      localStorage.setItem(`schedule_${crop}`, JSON.stringify(scheduleData))
    }
  }

  const openMarkModal = (id) => {
    setSelectedItemId(id)
    setMarkApplicationData({
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setShowMarkModal(true)
  }

  const markAsApplied = () => {
    if (!markApplicationData.date) {
      alert('Please enter application date')
      return
    }

    const updatedSchedule = schedule.map(item =>
      item.id === selectedItemId ? { 
        ...item, 
        status: 'completed', 
        date: markApplicationData.date, 
        notes: markApplicationData.notes 
      } : item
    )
    setSchedule(updatedSchedule)
    saveSchedule(updatedSchedule)
    setShowMarkModal(false)
    setSelectedItemId(null)
  }

  const markAsPending = (id) => {
    const updatedSchedule = schedule.map(item =>
      item.id === id ? { ...item, status: 'pending', date: null, notes: '' } : item
    )
    setSchedule(updatedSchedule)
    saveSchedule(updatedSchedule)
  }

  const addCustomApplication = () => {
    if (!newApplication.nutrient || !newApplication.date) {
      alert('Please fill in nutrient and date')
      return
    }

    const newEntry = {
      id: Date.now(),
      nutrient: newApplication.nutrient,
      source: 'Custom Application',
      dosage: 'As needed',
      timing: 'Custom',
      status: 'completed',
      date: newApplication.date,
      notes: newApplication.notes
    }

    const updatedSchedule = [...schedule, newEntry]
    setSchedule(updatedSchedule)
    saveSchedule(updatedSchedule)
    
    setNewApplication({ nutrient: '', date: '', notes: '' })
    setShowAddForm(false)
  }

  const deleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updatedSchedule = schedule.filter(item => item.id !== id)
      setSchedule(updatedSchedule)
      saveSchedule(updatedSchedule)
    }
  }

  const getStats = () => {
    const total = schedule.length
    const completed = schedule.filter(s => s.status === 'completed').length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, completed, pending, completionRate }
  }

  if (!isOpen) return null

  const stats = getStats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Calendar className="w-6 h-6 mr-3" />
              <TranslatedText>Fertilizer Application Schedule</TranslatedText>
            </h2>
            <p className="text-agro-green-100 mt-1">
              <TranslatedText>Track your fertilizer applications for</TranslatedText> {crop}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-agro-green-800 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-agro-green-600">{stats.total}</div>
              <div className="text-xs text-gray-600"><TranslatedText>Total Applications</TranslatedText></div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-600"><TranslatedText>Completed</TranslatedText></div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-gray-600"><TranslatedText>Pending</TranslatedText></div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
              <div className="text-xs text-gray-600"><TranslatedText>Progress</TranslatedText></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {schedule.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600"><TranslatedText>No schedule available. Get nutrient recommendations first.</TranslatedText></p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    item.status === 'completed'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-200 hover:border-agro-green-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {item.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-600" />
                        )}
                        <h3 className="text-lg font-bold text-gray-900">{item.nutrient}</h3>
                      </div>
                      
                      <div className="ml-8 space-y-1 text-sm text-gray-700">
                        <p><strong><TranslatedText>Source:</TranslatedText></strong> {item.source}</p>
                        <p><strong><TranslatedText>Dosage:</TranslatedText></strong> {item.dosage}</p>
                        <p><strong><TranslatedText>Timing:</TranslatedText></strong> {item.timing}</p>
                        
                        {item.date && (
                          <p className="text-green-700">
                            <strong><TranslatedText>Applied on:</TranslatedText></strong> {new Date(item.date).toLocaleDateString('en-IN')}
                          </p>
                        )}
                        
                        {item.notes && (
                          <p className="text-gray-600 italic">
                            <strong><TranslatedText>Notes:</TranslatedText></strong> {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {item.status === 'pending' ? (
                        <button
                          onClick={() => openMarkModal(item.id)}
                          className="bg-agro-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-agro-green-700 transition-colors whitespace-nowrap"
                        >
                          <TranslatedText>Mark Applied</TranslatedText>
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsPending(item.id)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors whitespace-nowrap"
                        >
                          <TranslatedText>Mark Pending</TranslatedText>
                        </button>
                      )}
                      
                      {item.timing === 'Custom' && (
                        <button
                          onClick={() => deleteEntry(item.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors whitespace-nowrap"
                        >
                          <TranslatedText>Delete</TranslatedText>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Custom Application */}
          {!showAddForm && schedule.length > 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-6 w-full border-2 border-dashed border-agro-green-400 rounded-lg p-4 text-agro-green-600 hover:bg-agro-green-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold"><TranslatedText>Add Custom Application</TranslatedText></span>
            </button>
          )}

          {showAddForm && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border-2 border-agro-green-400">
              <h4 className="font-bold text-gray-900 mb-3"><TranslatedText>Add Custom Application</TranslatedText></h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nutrient name"
                  value={newApplication.nutrient}
                  onChange={(e) => setNewApplication({ ...newApplication, nutrient: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500"
                />
                <input
                  type="date"
                  value={newApplication.date}
                  onChange={(e) => setNewApplication({ ...newApplication, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500"
                />
                <textarea
                  placeholder="Notes (optional)"
                  value={newApplication.notes}
                  onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addCustomApplication}
                    className="flex-1 bg-agro-green-600 text-white px-4 py-2 rounded-lg hover:bg-agro-green-700"
                  >
                    <TranslatedText>Add</TranslatedText>
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    <TranslatedText>Cancel</TranslatedText>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p>
              <TranslatedText>Track your fertilizer applications to ensure optimal crop nutrition. Mark applications as completed to monitor your progress.</TranslatedText>
            </p>
          </div>
        </div>
      </div>

      {/* Mark as Applied Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                <TranslatedText>Mark Fertilizer as Applied</TranslatedText>
              </h3>
              <p className="text-agro-green-100 text-sm mt-1">
                <TranslatedText>Record the application date and add notes</TranslatedText>
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Date Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  <TranslatedText>Application Date</TranslatedText> *
                </label>
                <input
                  type="date"
                  value={markApplicationData.date}
                  onChange={(e) => setMarkApplicationData({ ...markApplicationData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-agro-green-500 transition-all text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <TranslatedText>Enter the date when you applied the fertilizer</TranslatedText>
                </p>
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <TranslatedText>Notes</TranslatedText> <span className="text-gray-400 font-normal">(<TranslatedText>Optional</TranslatedText>)</span>
                </label>
                <textarea
                  value={markApplicationData.notes}
                  onChange={(e) => setMarkApplicationData({ ...markApplicationData, notes: e.target.value })}
                  placeholder="e.g., Applied in morning, weather was good, soil was moist..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-agro-green-500 transition-all text-base resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <TranslatedText>Add any observations or conditions during application</TranslatedText>
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-xs text-blue-800">
                  💡 <TranslatedText>Recording application details helps you track fertilizer usage and plan future applications better.</TranslatedText>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex gap-3">
              <button
                onClick={() => {
                  setShowMarkModal(false)
                  setSelectedItemId(null)
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <TranslatedText>Cancel</TranslatedText>
              </button>
              <button
                onClick={markAsApplied}
                className="flex-1 px-6 py-3 bg-agro-green-600 text-white font-semibold rounded-lg hover:bg-agro-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span><TranslatedText>Confirm Application</TranslatedText></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScheduleTracker
