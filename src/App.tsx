import { useState } from 'react'
import LandingScreen from './components/LandingScreen'
import QuestionStep from './components/QuestionStep'
import ResultsScreen from './components/ResultsScreen'
import PersonaCard from './components/PersonaCard'
import MissionsModal from './components/MissionsModal'

export type EnergyProfile = {
  heatingHours: string | null
  hotWaterUsage: string | null
  cookingHabits: string | null
  lightingType: string | null
  applianceUsageAge: string | null
  extraQuestion: string
}

export interface PillOption {
  value: string
  label: string
}

function App() {
  const [step, setStep] = useState<number>(0)
  const [profile, setProfile] = useState<EnergyProfile>({
    heatingHours: null,
    hotWaterUsage: null,
    cookingHabits: null,
    lightingType: null,
    applianceUsageAge: null,
    extraQuestion: '',
  })
  const [showPersonaCard, setShowPersonaCard] = useState(false)
  const [showMissionsModal, setShowMissionsModal] = useState(false)

  const handleStart = () => setStep(1)

  const handleSelect = (field: keyof EnergyProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => setStep(prev => prev + 1)

  const handleSkip = (field: keyof EnergyProfile) => {
    if (field === 'extraQuestion') {
      setProfile(prev => ({ ...prev, [field]: '' }))
    } else {
      setProfile(prev => ({ ...prev, [field]: null }))
    }
    setStep(prev => prev + 1)
  }

  const handleBack = () => setStep(prev => prev - 1)

  const handleRestart = () => {
    setStep(0)
    setProfile({
      heatingHours: null,
      hotWaterUsage: null,
      cookingHabits: null,
      lightingType: null,
      applianceUsageAge: null,
      extraQuestion: '',
    })
    setShowPersonaCard(false)
    setShowMissionsModal(false)
  }

  const handleTextChange = (value: string) => {
    setProfile(prev => ({ ...prev, extraQuestion: value }))
  }

  // Question configurations
  const questions = {
    1: {
      field: 'heatingHours' as keyof EnergyProfile,
      question: 'How many hours per day do you typically heat your home?',
      options: [
        { value: '0_2', label: '0–2 hours per day' },
        { value: '3_5', label: '3–5 hours per day' },
        { value: '6_8', label: '6–8 hours per day' },
        { value: '9_plus', label: '9+ hours per day' },
      ]
    },
    2: {
      field: 'hotWaterUsage' as keyof EnergyProfile,
      question: 'How often do you use hot water for showers, baths, or washing dishes?',
      options: [
        { value: 'low', label: 'Low (1–2 uses per day)' },
        { value: 'medium', label: 'Medium (3–5 uses per day)' },
        { value: 'high', label: 'High (6+ uses per day or large family)' },
      ]
    },
    3: {
      field: 'cookingHabits' as keyof EnergyProfile,
      question: 'How many meals do you cook at home per day, and what main appliances do you use?',
      options: [
        { value: 'light_microwave', label: '0–1 light meals (mostly microwave/toaster)' },
        { value: 'normal_mixed', label: '1–2 full meals (mix of hob and oven)' },
        { value: 'heavy_electric', label: '2–3+ cooked meals (electric hob/oven used a lot)' },
        { value: 'gas_cooking', label: 'Mostly gas hob/oven' },
      ]
    },
    4: {
      field: 'lightingType' as keyof EnergyProfile,
      question: 'What types of lighting do you mainly use at home?',
      options: [
        { value: 'mostly_led', label: 'Mostly LED bulbs' },
        { value: 'mixed', label: 'Mix of LED and older bulbs' },
        { value: 'mostly_old', label: 'Mostly older bulbs (halogen/incandescent)' },
        { value: 'unsure', label: 'Not sure' },
      ]
    },
    5: {
      field: 'applianceUsageAge' as keyof EnergyProfile,
      question: 'Which household appliances do you use daily, and how old are they?',
      options: [
        { value: 'new_efficient', label: 'Mostly new efficient appliances (under 5 years)' },
        { value: 'mixed_age', label: 'Mix of old and new appliances' },
        { value: 'old_heavy_use', label: 'Mostly older appliances (10+ years)' },
        { value: 'few_appliances', label: 'Limited appliance use (few devices used daily)' },
      ]
    }
  }

  return (
    <>
      {/* Header with Logo */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.25rem 2rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div 
          onClick={handleRestart}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#3d4f3f" 
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
            <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
            <path d="m14 16-3 3 3 3"/>
            <path d="M8.293 13.596 4.875 7.5l3.418-6.096a1.83 1.83 0 0 1 1.563-.89h2.429"/>
            <path d="m9.5 5 3-3 3 3"/>
            <path d="M12 19v-8.5"/>
            <path d="m16.329 7.5 3.418 6.096"/>
            <path d="m19.748 17-1.5-2.598 1.5-2.598"/>
          </svg>
          <span style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '1.8rem',
            fontWeight: 500,
            color: '#3d4f3f',
            letterSpacing: '0.08em'
          }}>
            ECOHOME
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {step === 7 && (
            <>
              <button
                onClick={() => setShowPersonaCard(!showPersonaCard)}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: showPersonaCard ? '#3d4f3f' : 'transparent',
                  border: '1px solid #3d4f3f',
                  color: showPersonaCard ? '#faf9f6' : '#3d4f3f',
                  fontSize: '0.7rem',
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!showPersonaCard) {
                    e.currentTarget.style.background = '#3d4f3f'
                    e.currentTarget.style.color = '#faf9f6'
                  }
                }}
                onMouseOut={(e) => {
                  if (!showPersonaCard) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#3d4f3f'
                  }
                }}
              >
                View Energy Persona & Score
              </button>
              <button
                onClick={() => setShowMissionsModal(!showMissionsModal)}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: showMissionsModal ? '#3d4f3f' : 'transparent',
                  border: '1px solid #3d4f3f',
                  color: showMissionsModal ? '#faf9f6' : '#3d4f3f',
                  fontSize: '0.7rem',
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!showMissionsModal) {
                    e.currentTarget.style.background = '#3d4f3f'
                    e.currentTarget.style.color = '#faf9f6'
                  }
                }}
                onMouseOut={(e) => {
                  if (!showMissionsModal) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#3d4f3f'
                  }
                }}
              >
                View Energy Missions
              </button>
            </>
          )}
          {step > 0 && (
            <button
              onClick={handleRestart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'transparent',
                border: '1px solid #b8c4b8',
                color: '#5a6b5c',
                fontSize: '0.75rem',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#3d4f3f'
                e.currentTarget.style.borderColor = '#3d4f3f'
                e.currentTarget.style.color = '#faf9f6'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#b8c4b8'
                e.currentTarget.style.color = '#5a6b5c'
              }}
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              New Assessment
            </button>
          )}
        </div>
      </header>

      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: step === 7 ? '5rem 4rem 2rem 5rem' : '5rem 2rem 2rem',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: step === 7 ? 'calc(100vw - 9rem)' : '800px',
          margin: '0 auto'
        }}>
          {step === 0 && <LandingScreen onStart={handleStart} />}
          
          {step >= 1 && step <= 5 && (
            <QuestionStep
              stepNumber={step}
              totalSteps={6}
              question={questions[step as 1|2|3|4|5].question}
              options={questions[step as 1|2|3|4|5].options}
              selectedValue={profile[questions[step as 1|2|3|4|5].field] as string | null}
              onSelect={(value) => handleSelect(questions[step as 1|2|3|4|5].field, value)}
              onNext={handleNext}
              onSkip={() => handleSkip(questions[step as 1|2|3|4|5].field)}
              onBack={step > 1 ? handleBack : undefined}
            />
          )}

          {step === 6 && (
            <QuestionStep
              stepNumber={6}
              totalSteps={6}
              question="Is there anything else you'd like us to consider about your home or habits?"
              helperText="For example: issues with insulation, drafty windows, very old boiler, unusual usage patterns, etc."
              isTextInput={true}
              textValue={profile.extraQuestion}
              onTextChange={handleTextChange}
              onNext={handleNext}
              onSkip={() => handleSkip('extraQuestion')}
              onBack={handleBack}
              isLastStep={true}
            />
          )}

          {step === 7 && (
            <>
              <ResultsScreen profile={profile} onRestart={handleRestart} />
              <PersonaCard 
                profile={profile} 
                show={showPersonaCard} 
                onClose={() => setShowPersonaCard(false)} 
              />
              <MissionsModal 
                profile={profile} 
                show={showMissionsModal} 
                onClose={() => setShowMissionsModal(false)} 
              />
            </>
          )}
        </div>
      </main>
    </>
  )
}

export default App
