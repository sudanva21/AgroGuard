import React, { createContext, useContext, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DialogContext = createContext()

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null)

  // Show alert dialog (info, success, warning, error)
  const showAlert = ({ title, message, type = 'info', onClose }) => {
    setDialog({
      type: 'alert',
      title,
      message,
      alertType: type,
      onClose: () => {
        setDialog(null)
        if (onClose) onClose()
      }
    })
  }

  // Show confirm dialog (yes/no) - Returns Promise<boolean>
  const showConfirm = ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
    return new Promise((resolve) => {
      setDialog({
        type: 'confirm',
        title,
        message,
        alertType: type,
        confirmText,
        cancelText,
        onConfirm: () => {
          setDialog(null)
          resolve(true)
        },
        onCancel: () => {
          setDialog(null)
          resolve(false)
        }
      })
    })
  }

  // Close dialog
  const closeDialog = () => {
    setDialog(null)
  }

  const value = {
    showAlert,
    showConfirm,
    closeDialog
  }

  return (
    <DialogContext.Provider value={value}>
      {children}
      <DialogModal dialog={dialog} />
    </DialogContext.Provider>
  )
}

// Dialog Modal Component
const DialogModal = ({ dialog }) => {
  if (!dialog) return null

  const getIcon = () => {
    switch (dialog.alertType) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />
      default:
        return <Info className="w-16 h-16 text-blue-500" />
    }
  }

  const getColorClasses = () => {
    switch (dialog.alertType) {
      case 'success':
        return {
          icon: 'text-green-500',
          button: 'bg-green-600 hover:bg-green-700',
          border: 'border-green-500'
        }
      case 'error':
        return {
          icon: 'text-red-500',
          button: 'bg-red-600 hover:bg-red-700',
          border: 'border-red-500'
        }
      case 'warning':
        return {
          icon: 'text-yellow-500',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          border: 'border-yellow-500'
        }
      default:
        return {
          icon: 'text-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700',
          border: 'border-blue-500'
        }
    }
  }

  const colors = getColorClasses()

  return (
    <AnimatePresence>
      {dialog && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={dialog.type === 'alert' ? dialog.onClose : dialog.onCancel}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header with close button */}
              <div className="relative px-6 pt-6">
                <button
                  onClick={dialog.type === 'alert' ? dialog.onClose : dialog.onCancel}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex justify-center mb-4"
                >
                  {getIcon()}
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {dialog.title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {dialog.message}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {dialog.type === 'confirm' && (
                    <>
                      <button
                        onClick={dialog.onCancel}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                      >
                        {dialog.cancelText}
                      </button>
                      <button
                        onClick={dialog.onConfirm}
                        className={`px-6 py-3 text-white font-semibold rounded-lg transition ${colors.button}`}
                      >
                        {dialog.confirmText}
                      </button>
                    </>
                  )}
                  
                  {dialog.type === 'alert' && (
                    <button
                      onClick={dialog.onClose}
                      className={`px-8 py-3 text-white font-semibold rounded-lg transition ${colors.button}`}
                    >
                      OK
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DialogProvider
