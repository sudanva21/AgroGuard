import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { CartProvider } from './contexts/CartContext'
import { DialogProvider } from './contexts/DialogContext'
import Header from './components/Header'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import DiseaseDetection from './pages/DiseaseDetection'
import Treatment from './pages/Treatment'
import NutrientAdvisory from './pages/NutrientAdvisory'
import Chatbot from './pages/Chatbot'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PestAlert from './pages/PestAlert'
import MyReports from './pages/MyReports'
import ReportDetails from './pages/ReportDetails'
import AdminDashboard from './pages/AdminDashboard'

function AppContent() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <PageTransition location={location.pathname}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Public Routes */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/nutrient-advisory" element={<NutrientAdvisory />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/disease-detection" element={
                <ProtectedRoute><DiseaseDetection /></ProtectedRoute>
              } />
              <Route path="/treatment" element={
                <ProtectedRoute><Treatment /></ProtectedRoute>
              } />
              <Route path="/chatbot" element={
                <ProtectedRoute><Chatbot /></ProtectedRoute>
              } />
              <Route path="/pest-alert" element={
                <ProtectedRoute><PestAlert /></ProtectedRoute>
              } />
              <Route path="/my-reports" element={
                <ProtectedRoute><MyReports /></ProtectedRoute>
              } />
              <Route path="/reports/:id" element={
                <ProtectedRoute><ReportDetails /></ProtectedRoute>
              } />
              
              {/* Hidden Admin Route - Only accessible via direct URL */}
              <Route path="/admin-dashboard-2025" element={<AdminDashboard />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <DialogProvider>
              <AppContent />
            </DialogProvider>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
