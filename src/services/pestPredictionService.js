// Pest Prediction Service using free OpenWeatherMap API
// This service provides real-time pest outbreak predictions based on weather and crop data

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Pest outbreak patterns based on scientific agricultural research
// Data compiled from ICAR, FAO, and agricultural research papers
const PEST_DATABASE = {
  Rice: [
    {
      name: 'Brown Plant Hopper',
      conditions: {
        tempRange: [25, 32],
        humidityMin: 80,
        rainfall: 'moderate',
        season: ['monsoon', 'post-monsoon']
      },
      severity: 'high',
      description: 'Sucks sap from rice plants causing hopper burn',
      threshold: '5-10 hoppers per plant',
      preventive: [
        'Monitor fields regularly for nymph presence',
        'Maintain proper water level in fields',
        'Apply Imidacloprid 17.8% SL @ 100ml/ha if threshold reached',
        'Use light traps to monitor adult population',
        'Plant resistant varieties like Vikramarya, Vijetha'
      ]
    },
    {
      name: 'Rice Stem Borer',
      conditions: {
        tempRange: [20, 30],
        humidityMin: 60,
        rainfall: 'any',
        season: ['monsoon', 'winter']
      },
      severity: 'high',
      description: 'Larvae bore into rice stems causing dead hearts and white ears',
      threshold: '1-2 egg masses per square meter',
      preventive: [
        'Remove and destroy stubble after harvest',
        'Use pheromone traps @ 20 traps/ha',
        'Release egg parasitoid Trichogramma @ 50,000/ha',
        'Apply Cartap hydrochloride 4G @ 10 kg/ha at tillering',
        'Avoid excessive nitrogen fertilizer'
      ]
    },
    {
      name: 'Rice Leaf Folder',
      conditions: {
        tempRange: [25, 35],
        humidityMin: 70,
        rainfall: 'moderate',
        season: ['monsoon']
      },
      severity: 'medium',
      description: 'Larvae fold leaves and scrape green matter',
      threshold: '1-2 damaged leaves per plant',
      preventive: [
        'Clip and destroy folded leaves',
        'Apply neem oil 5ml/liter as deterrent',
        'Use light traps to monitor moths',
        'Spray Chlorantraniliprole 18.5% SC @ 150ml/ha'
      ]
    }
  ],
  
  Wheat: [
    {
      name: 'Aphids',
      conditions: {
        tempRange: [15, 25],
        humidityMin: 50,
        rainfall: 'low',
        season: ['winter', 'spring']
      },
      severity: 'medium',
      description: 'Sucks sap from wheat causing yellowing and stunting',
      threshold: '10-15 aphids per plant',
      preventive: [
        'Monitor crop regularly during flowering stage',
        'Encourage natural predators (ladybird beetles, lacewings)',
        'Use reflective mulch to repel aphids',
        'Spray water jets to dislodge colonies',
        'Apply Dimethoate 30% EC @ 400ml/ha if needed'
      ]
    },
    {
      name: 'Wheat Termites',
      conditions: {
        tempRange: [20, 35],
        humidityMin: 40,
        rainfall: 'low',
        season: ['winter']
      },
      severity: 'high',
      description: 'Attacks roots and stems causing plant death',
      threshold: 'Presence of termite galleries',
      preventive: [
        'Deep summer plowing to expose colonies',
        'Remove crop residues that harbor termites',
        'Treat seeds with Chlorpyriphos 20% EC @ 4ml/kg seed',
        'Apply Chlorpyriphos 20% EC @ 2.5 liter/ha as soil drench',
        'Maintain proper soil moisture'
      ]
    }
  ],
  
  Cotton: [
    {
      name: 'Whitefly',
      conditions: {
        tempRange: [27, 35],
        humidityMin: 55,
        rainfall: 'low',
        season: ['summer', 'monsoon']
      },
      severity: 'high',
      description: 'Transmits Cotton Leaf Curl Virus and causes honeydew secretion',
      threshold: '5-8 adults per leaf',
      preventive: [
        'Install yellow sticky traps @ 15-20 traps/acre',
        'Spray neem oil 5ml/liter as preventive measure',
        'Remove and destroy affected leaves',
        'Ensure proper spacing between plants (90cm x 60cm)',
        'Apply Thiamethoxam 25% WG @ 100g/ha',
        'Avoid excessive nitrogen fertilization'
      ]
    },
    {
      name: 'Pink Bollworm',
      conditions: {
        tempRange: [25, 35],
        humidityMin: 60,
        rainfall: 'moderate',
        season: ['monsoon', 'post-monsoon']
      },
      severity: 'high',
      description: 'Larvae bore into cotton bolls causing rosette flowers',
      threshold: '10% damaged bolls',
      preventive: [
        'Use pheromone traps @ 12 traps/ha for monitoring',
        'Deep summer plowing to kill pupae',
        'Collect and destroy infested bolls and rosette flowers',
        'Plant Bt cotton varieties',
        'Apply Thiodicarb 75% WP @ 1g/liter at flowering'
      ]
    },
    {
      name: 'Cotton Aphids',
      conditions: {
        tempRange: [20, 30],
        humidityMin: 50,
        rainfall: 'low',
        season: ['winter', 'spring']
      },
      severity: 'medium',
      description: 'Colonies on tender shoots and lower leaf surface',
      threshold: '5-10 aphids per leaf',
      preventive: [
        'Encourage natural enemies like ladybird beetles',
        'Spray neem extract 4% @ 5ml/liter',
        'Avoid water stress to plants',
        'Apply Acetamiprid 20% SP @ 50g/ha if needed'
      ]
    }
  ],
  
  Tomato: [
    {
      name: 'Tomato Fruit Borer',
      conditions: {
        tempRange: [25, 35],
        humidityMin: 60,
        rainfall: 'moderate',
        season: ['monsoon', 'summer']
      },
      severity: 'high',
      description: 'Larvae bore into fruits causing severe damage',
      threshold: '2-4% fruit damage',
      preventive: [
        'Use pheromone traps @ 20 traps/ha',
        'Install light traps to attract and kill adults',
        'Hand-pick and destroy damaged fruits',
        'Spray Bacillus thuringiensis @ 1-2g/liter',
        'Apply Spinosad 45% SC @ 200ml/ha',
        'Maintain field sanitation'
      ]
    },
    {
      name: 'Whitefly on Tomato',
      conditions: {
        tempRange: [25, 32],
        humidityMin: 60,
        rainfall: 'low',
        season: ['summer']
      },
      severity: 'high',
      description: 'Transmits Tomato Leaf Curl Virus',
      threshold: '5-10 adults per plant',
      preventive: [
        'Use yellow sticky traps',
        'Mulch with reflective material',
        'Spray neem oil 3ml/liter every 7-10 days',
        'Remove infected plants immediately',
        'Apply Diafenthiuron 50% WP @ 1g/liter'
      ]
    }
  ],
  
  Potato: [
    {
      name: 'Potato Tuber Moth',
      conditions: {
        tempRange: [20, 30],
        humidityMin: 50,
        rainfall: 'low',
        season: ['winter', 'spring']
      },
      severity: 'high',
      description: 'Larvae mine leaves and tubers',
      threshold: 'Presence of mines in leaves',
      preventive: [
        'Earthing up to prevent egg laying on tubers',
        'Use pheromone traps for monitoring',
        'Harvest tubers at maturity and avoid field storage',
        'Store tubers in dark, cool place',
        'Apply Cartap hydrochloride 50% SP @ 1g/liter'
      ]
    },
    {
      name: 'Potato Aphids',
      conditions: {
        tempRange: [15, 25],
        humidityMin: 55,
        rainfall: 'moderate',
        season: ['winter']
      },
      severity: 'medium',
      description: 'Transmits viruses and causes honeydew',
      threshold: '10-20 aphids per leaf',
      preventive: [
        'Use virus-free certified seeds',
        'Remove volunteer potato plants',
        'Spray neem oil or insecticidal soap',
        'Apply Imidacloprid 17.8% SL @ 0.5ml/liter'
      ]
    }
  ],
  
  Sugarcane: [
    {
      name: 'Early Shoot Borer',
      conditions: {
        tempRange: [25, 35],
        humidityMin: 60,
        rainfall: 'moderate',
        season: ['summer', 'monsoon']
      },
      severity: 'high',
      description: 'Larvae bore into young shoots causing dead hearts',
      threshold: '5% dead hearts',
      preventive: [
        'Remove and destroy dead hearts',
        'Use resistant varieties',
        'Apply Carbofuran 3% CG @ 33 kg/ha in furrows',
        'Set up light traps to kill moths',
        'Avoid ratooning in heavily infested fields'
      ]
    },
    {
      name: 'Sugarcane Whitefly',
      conditions: {
        tempRange: [28, 35],
        humidityMin: 70,
        rainfall: 'moderate',
        season: ['monsoon']
      },
      severity: 'medium',
      description: 'Causes honeydew and sooty mold',
      threshold: 'Black coating on leaves',
      preventive: [
        'Detrash the crop to improve air circulation',
        'Spray neem oil 2-3ml/liter',
        'Conserve natural enemies',
        'Apply Thiamethoxam 25% WG @ 100g/ha'
      ]
    }
  ],
  
  Chili: [
    {
      name: 'Chili Thrips',
      conditions: {
        tempRange: [25, 35],
        humidityMin: 55,
        rainfall: 'low',
        season: ['summer', 'monsoon']
      },
      severity: 'high',
      description: 'Feed on tender leaves causing curling and stunting',
      threshold: '5-10 thrips per leaf',
      preventive: [
        'Install blue sticky traps',
        'Spray neem oil 5ml/liter regularly',
        'Maintain proper irrigation',
        'Apply Fipronil 5% SC @ 2ml/liter',
        'Remove weed hosts around field'
      ]
    },
    {
      name: 'Chili Fruit Borer',
      conditions: {
        tempRange: [25, 32],
        humidityMin: 60,
        rainfall: 'moderate',
        season: ['monsoon']
      },
      severity: 'high',
      description: 'Larvae bore into fruits causing dropping',
      threshold: '10% fruit damage',
      preventive: [
        'Use pheromone traps @ 15 traps/ha',
        'Hand-pick and destroy damaged fruits',
        'Spray Bacillus thuringiensis',
        'Apply Quinalphos 25% EC @ 2ml/liter'
      ]
    }
  ],
  
  Onion: [
    {
      name: 'Onion Thrips',
      conditions: {
        tempRange: [20, 30],
        humidityMin: 50,
        rainfall: 'low',
        season: ['winter', 'summer']
      },
      severity: 'high',
      description: 'Scrape leaf surface causing silvery streaks',
      threshold: '5-10 thrips per plant',
      preventive: [
        'Use blue sticky traps',
        'Spray neem oil 3ml/liter',
        'Ensure adequate moisture',
        'Apply Dimethoate 30% EC @ 2ml/liter',
        'Avoid over-crowding of plants'
      ]
    }
  ],
  
  Maize: [
    {
      name: 'Fall Armyworm',
      conditions: {
        tempRange: [25, 30],
        humidityMin: 60,
        rainfall: 'moderate',
        season: ['monsoon', 'summer']
      },
      severity: 'high',
      description: 'Larvae feed on leaves and growing points',
      threshold: '5% plants with whorl damage',
      preventive: [
        'Install pheromone traps @ 20 traps/ha',
        'Hand-pick and destroy egg masses',
        'Apply sand or ash in whorl to kill larvae',
        'Spray Chlorantraniliprole 18.5% SC @ 150ml/ha',
        'Release egg parasitoid Telenomus remus'
      ]
    },
    {
      name: 'Maize Stem Borer',
      conditions: {
        tempRange: [22, 30],
        humidityMin: 65,
        rainfall: 'moderate',
        season: ['monsoon']
      },
      severity: 'medium',
      description: 'Larvae bore into stems causing dead hearts',
      threshold: '10% dead hearts',
      preventive: [
        'Remove and destroy infested plants',
        'Use resistant varieties',
        'Apply Carbofuran 3% CG @ 20 kg/ha',
        'Practice crop rotation'
      ]
    }
  ],
  
  Soybean: [
    {
      name: 'Soybean Girdle Beetle',
      conditions: {
        tempRange: [25, 32],
        humidityMin: 70,
        rainfall: 'high',
        season: ['monsoon']
      },
      severity: 'medium',
      description: 'Adults girdle stems causing plant lodging',
      threshold: '2-4 beetles per meter row',
      preventive: [
        'Collect and destroy girdled plants',
        'Spray Quinalphos 25% EC @ 2ml/liter',
        'Maintain field sanitation',
        'Use early-maturing varieties'
      ]
    },
    {
      name: 'Soybean Semilooper',
      conditions: {
        tempRange: [25, 30],
        humidityMin: 65,
        rainfall: 'moderate',
        season: ['monsoon']
      },
      severity: 'high',
      description: 'Larvae defoliate soybean plants',
      threshold: '2 larvae per meter row',
      preventive: [
        'Monitor with pheromone traps',
        'Spray Bacillus thuringiensis',
        'Apply Chlorantraniliprole 18.5% SC @ 150ml/ha',
        'Conserve natural enemies'
      ]
    }
  ]
}

/**
 * Get current weather data for a location
 */
export async function getWeatherData(location) {
  try {
    // If no API key, return mock weather data based on current season
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key') {
      return getMockWeatherData(location)
    }

    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(location)},IN&units=metric&appid=${OPENWEATHER_API_KEY}`
    )
    
    if (!response.ok) {
      console.warn('Weather API failed, using mock data')
      return getMockWeatherData(location)
    }
    
    const data = await response.json()
    
    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      rainfall: data.rain ? data.rain['1h'] || data.rain['3h'] || 0 : 0,
      location: data.name
    }
  } catch (error) {
    console.error('Weather fetch error:', error)
    return getMockWeatherData(location)
  }
}

/**
 * Get 5-day weather forecast
 */
export async function getWeatherForecast(location) {
  try {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key') {
      return getMockForecastData(location)
    }

    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(location)},IN&units=metric&appid=${OPENWEATHER_API_KEY}`
    )
    
    if (!response.ok) {
      return getMockForecastData(location)
    }
    
    const data = await response.json()
    
    // Process forecast data
    const forecasts = data.list.slice(0, 8).map(item => ({
      temp: item.main.temp,
      humidity: item.main.humidity,
      rainfall: item.rain ? item.rain['3h'] || 0 : 0,
      date: new Date(item.dt * 1000)
    }))
    
    return forecasts
  } catch (error) {
    console.error('Forecast fetch error:', error)
    return getMockForecastData(location)
  }
}

/**
 * Predict pest outbreaks based on weather and crop
 */
export async function predictPestOutbreaks(location, crop) {
  try {
    // Get current weather and forecast
    const currentWeather = await getWeatherData(location)
    const forecast = await getWeatherForecast(location)
    
    // Get pest database for the crop
    const cropPests = PEST_DATABASE[crop] || []
    
    // Calculate pest risk for each pest
    const predictions = cropPests.map(pest => {
      const risk = calculatePestRisk(pest, currentWeather, forecast)
      return {
        ...pest,
        riskScore: risk.score,
        riskLevel: risk.level,
        expectedDate: risk.expectedDate,
        currentWeather: {
          temp: `${Math.round(currentWeather.temp)}°C`,
          humidity: `${currentWeather.humidity}%`,
          rainfall: currentWeather.rainfall > 0 ? 'Rain expected' : 'No rain expected'
        }
      }
    })
    
    // Sort by risk score (highest first)
    predictions.sort((a, b) => b.riskScore - a.riskScore)
    
    // Add severity based on risk score
    return predictions.map(pred => ({
      ...pred,
      severity: pred.riskScore > 0.7 ? 'high' : pred.riskScore > 0.4 ? 'medium' : 'low'
    }))
    
  } catch (error) {
    console.error('Pest prediction error:', error)
    return []
  }
}

/**
 * Calculate pest risk based on conditions
 */
function calculatePestRisk(pest, currentWeather, forecast) {
  let riskScore = 0
  let matchCount = 0
  
  // Check temperature match
  if (currentWeather.temp >= pest.conditions.tempRange[0] && 
      currentWeather.temp <= pest.conditions.tempRange[1]) {
    riskScore += 0.4
    matchCount++
  }
  
  // Check humidity match
  if (currentWeather.humidity >= pest.conditions.humidityMin) {
    riskScore += 0.3
    matchCount++
  }
  
  // Check season match
  const currentSeason = getCurrentSeason()
  if (pest.conditions.season.includes(currentSeason)) {
    riskScore += 0.2
    matchCount++
  }
  
  // Check rainfall pattern
  const forecastRain = forecast.some(f => f.rainfall > 0)
  const rainfallMatch = 
    (pest.conditions.rainfall === 'low' && !forecastRain) ||
    (pest.conditions.rainfall === 'moderate' && forecastRain) ||
    (pest.conditions.rainfall === 'high' && forecastRain) ||
    (pest.conditions.rainfall === 'any')
  
  if (rainfallMatch) {
    riskScore += 0.1
    matchCount++
  }
  
  // Determine risk level
  let level = 'Low'
  let expectedDays = '10-15'
  
  if (riskScore > 0.7) {
    level = 'High'
    expectedDays = '3-5'
  } else if (riskScore > 0.4) {
    level = 'Medium'
    expectedDays = '7-10'
  }
  
  return {
    score: riskScore,
    level: level,
    expectedDate: `Next ${expectedDays} days`
  }
}

/**
 * Get current season based on month
 */
function getCurrentSeason() {
  const month = new Date().getMonth()
  
  // India seasons
  if (month >= 2 && month <= 5) return 'summer'      // March-June
  if (month >= 6 && month <= 9) return 'monsoon'     // July-October
  if (month >= 10 || month <= 1) return 'winter'     // November-February
  
  return 'spring'
}

/**
 * Get mock weather data when API is not available
 */
function getMockWeatherData(location) {
  const season = getCurrentSeason()
  const month = new Date().getMonth()
  
  // Realistic seasonal weather for Indian states
  let temp, humidity, rainfall
  
  if (season === 'summer') {
    temp = 32 + Math.random() * 8  // 32-40°C
    humidity = 40 + Math.random() * 30  // 40-70%
    rainfall = Math.random() > 0.8 ? 5 : 0
  } else if (season === 'monsoon') {
    temp = 25 + Math.random() * 7  // 25-32°C
    humidity = 75 + Math.random() * 20  // 75-95%
    rainfall = Math.random() > 0.3 ? 10 : 0
  } else {  // winter
    temp = 18 + Math.random() * 10  // 18-28°C
    humidity = 50 + Math.random() * 25  // 50-75%
    rainfall = Math.random() > 0.9 ? 3 : 0
  }
  
  return {
    temp: Math.round(temp * 10) / 10,
    humidity: Math.round(humidity),
    description: rainfall > 0 ? 'Light rain' : 'Partly cloudy',
    rainfall,
    location: location
  }
}

/**
 * Get mock forecast data
 */
function getMockForecastData(location) {
  const forecasts = []
  const baseWeather = getMockWeatherData(location)
  
  for (let i = 0; i < 8; i++) {
    const date = new Date()
    date.setHours(date.getHours() + (i * 3))
    
    forecasts.push({
      temp: baseWeather.temp + (Math.random() * 4 - 2),
      humidity: baseWeather.humidity + (Math.random() * 10 - 5),
      rainfall: Math.random() > 0.7 ? Math.random() * 5 : 0,
      date
    })
  }
  
  return forecasts
}

/**
 * Get all supported crops
 */
export function getSupportedCrops() {
  return Object.keys(PEST_DATABASE)
}

/**
 * Get pest information for a specific pest and crop
 */
export function getPestInfo(crop, pestName) {
  const cropPests = PEST_DATABASE[crop] || []
  return cropPests.find(pest => pest.name === pestName)
}
