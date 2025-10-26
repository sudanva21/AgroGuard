import React from 'react'

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Temporary test indicator */}
      <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-auto">
        🌿 Background Active - You should see leaf on right & hand/plant on left
      </div>
      {/* Large 3D Leaf on Right Side */}
      <div className="absolute right-0 top-1/4 w-1/2 h-3/4 opacity-70 animate-sway">
        <svg
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main leaf shape with 3D effect */}
          <defs>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#166534" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#16a34a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.7" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="4" dy="8" stdDeviation="8" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Leaf body */}
          <path
            d="M200 50 C250 100, 350 200, 360 350 C365 450, 320 550, 200 580 C80 550, 35 450, 40 350 C50 200, 150 100, 200 50 Z"
            fill="url(#leafGradient)"
            filter="url(#shadow)"
          />
          
          {/* Center vein */}
          <path
            d="M200 50 L200 580"
            stroke="#14532d"
            strokeWidth="4"
            opacity="0.6"
          />
          
          {/* Left veins */}
          <path
            d="M200 150 Q150 200 120 250"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M200 220 Q160 260 140 300"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M200 290 Q170 330 150 380"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M200 370 Q180 410 170 460"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          
          {/* Right veins */}
          <path
            d="M200 150 Q250 200 280 250"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M200 220 Q240 260 260 300"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M200 290 Q230 330 250 380"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          <path
            d="M200 370 Q220 410 230 460"
            stroke="#14532d"
            strokeWidth="2"
            opacity="0.4"
            fill="none"
          />
          
          {/* Highlights for 3D effect */}
          <ellipse
            cx="240"
            cy="250"
            rx="40"
            ry="80"
            fill="#86efac"
            opacity="0.3"
          />
          <ellipse
            cx="220"
            cy="380"
            rx="30"
            ry="60"
            fill="#86efac"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Hand Holding Plant on Left Side */}
      <div className="absolute left-0 bottom-0 w-1/2 h-2/3 opacity-60 animate-float-slow">
        <svg
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="handGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d2bab0" />
              <stop offset="100%" stopColor="#977669" />
            </linearGradient>
            <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#5b21b6" />
            </linearGradient>
            <linearGradient id="plantGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#14532d" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          
          {/* Palm */}
          <ellipse
            cx="200"
            cy="400"
            rx="80"
            ry="60"
            fill="url(#handGradient)"
            opacity="0.8"
          />
          
          {/* Thumb */}
          <path
            d="M130 390 Q110 380 100 360 Q95 340 105 330 Q115 325 125 335 Q135 360 140 385 Z"
            fill="url(#handGradient)"
            opacity="0.8"
          />
          
          {/* Fingers */}
          <ellipse cx="160" cy="330" rx="15" ry="50" fill="url(#handGradient)" opacity="0.8"/>
          <ellipse cx="190" cy="315" rx="15" ry="55" fill="url(#handGradient)" opacity="0.8"/>
          <ellipse cx="220" cy="320" rx="15" ry="52" fill="url(#handGradient)" opacity="0.8"/>
          <ellipse cx="250" cy="335" rx="15" ry="48" fill="url(#handGradient)" opacity="0.8"/>
          
          {/* Pot */}
          <path
            d="M150 380 L250 380 L260 450 L140 450 Z"
            fill="url(#potGradient)"
            opacity="0.7"
          />
          <rect x="145" y="370" width="110" height="15" rx="3" fill="#6b21a8" opacity="0.7"/>
          
          {/* Soil */}
          <ellipse cx="200" cy="385" rx="50" ry="10" fill="#422006" opacity="0.6"/>
          
          {/* Plant stem */}
          <path
            d="M200 380 Q195 320 190 280 Q188 260 192 240"
            stroke="url(#plantGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Plant leaves */}
          <ellipse cx="170" cy="300" rx="35" ry="20" fill="#22c55e" opacity="0.8" transform="rotate(-30 170 300)"/>
          <ellipse cx="220" cy="280" rx="38" ry="22" fill="#4ade80" opacity="0.8" transform="rotate(25 220 280)"/>
          <ellipse cx="175" cy="250" rx="32" ry="18" fill="#16a34a" opacity="0.8" transform="rotate(-40 175 250)"/>
          <ellipse cx="215" cy="240" rx="40" ry="23" fill="#22c55e" opacity="0.9" transform="rotate(35 215 240)"/>
          
          {/* Top leaves */}
          <ellipse cx="185" cy="210" rx="35" ry="20" fill="#4ade80" opacity="0.9" transform="rotate(-25 185 210)"/>
          <ellipse cx="205" cy="200" rx="38" ry="22" fill="#22c55e" opacity="0.9" transform="rotate(20 205 200)"/>
        </svg>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-1/4 w-24 h-24 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
          <circle cx="50" cy="50" r="40" stroke="#16a34a" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
        </svg>
      </div>
    </div>
  )
}

export default AnimatedBackground
