import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PageTransition = ({ children, location }) => {
  const [showLeaves, setShowLeaves] = useState(false)

  useEffect(() => {
    setShowLeaves(true)
    const timer = setTimeout(() => setShowLeaves(false), 1500)
    return () => clearTimeout(timer)
  }, [location])

  // Generate realistic falling leaves
  const leaves = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1,
    rotation: Math.random() * 720 - 360,
    sway: (Math.random() - 0.5) * 200,
    size: 20 + Math.random() * 25
  }))

  return (
    <>
      {/* Falling Leaves Transition */}
      <AnimatePresence>
        {showLeaves && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {leaves.map((leaf) => (
              <motion.div
                key={leaf.id}
                initial={{
                  top: '-10%',
                  left: leaf.left,
                  rotate: 0,
                  opacity: 0
                }}
                animate={{
                  top: '110%',
                  left: `calc(${leaf.left} + ${leaf.sway}px)`,
                  rotate: leaf.rotation,
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: leaf.duration,
                  delay: leaf.delay,
                  ease: 'easeInOut'
                }}
                className="absolute"
              >
                <svg
                  width={leaf.size}
                  height={leaf.size}
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}
                >
                  {/* Realistic leaf shape */}
                  <defs>
                    <linearGradient id={`leafGrad${leaf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#166534" />
                      <stop offset="50%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2C12 2 7 4 7 12C7 16 9 20 12 22C15 20 17 16 17 12C17 4 12 2 12 2Z"
                    fill={`url(#leafGrad${leaf.id})`}
                    opacity="0.9"
                  />
                  <path
                    d="M12 2L12 22"
                    stroke="#14532d"
                    strokeWidth="0.5"
                    opacity="0.6"
                  />
                  <path
                    d="M12 8 Q9 10 7 12"
                    stroke="#14532d"
                    strokeWidth="0.3"
                    fill="none"
                    opacity="0.4"
                  />
                  <path
                    d="M12 8 Q15 10 17 12"
                    stroke="#14532d"
                    strokeWidth="0.3"
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Page Content with Fade */}
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  )
}

export default PageTransition
