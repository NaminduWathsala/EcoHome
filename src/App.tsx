import { useState } from 'react'
import LandingScreen from './components/LandingScreen'
import QuestionStep from './components/QuestionStep'
import SummaryScreen from './components/SummaryScreen'

export type EnergyProfile = {
  homeSize: string | null
  heatingUsage: string | null
  dailyAppliances: string | null
  monthlyBill: string | null
  extraInfo: string | null
}

function App() {
  const [step, setStep] = useState<number>(0)
  const [profile, setProfile] = useState<EnergyProfile>({
    homeSize: null,
    heatingUsage: null,
    dailyAppliances: null,
    monthlyBill: null,
    extraInfo: null,
  })

  const handleStart = () => {
    setStep(1)
  }

  const handleAnswer = (field: keyof EnergyProfile, value: string | null) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = (field: keyof EnergyProfile, value: string | null) => {
    handleAnswer(field, value)
    setStep((prev) => prev + 1)
  }

  const handleSkip = (field: keyof EnergyProfile) => {
    handleAnswer(field, null)
    setStep((prev) => prev + 1)
  }

  const handleFinish = (field: keyof EnergyProfile, value: string | null) => {
    handleAnswer(field, value)
    setStep(6) // Move to summary screen
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleRestart = () => {
    setStep(0)
    setProfile({
      homeSize: null,
      heatingUsage: null,
      dailyAppliances: null,
      monthlyBill: null,
      extraInfo: null,
    })
  }

  return (
    <div className="w-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            {step === 0 && <LandingScreen onStart={handleStart} />}
            {step === 1 && (
              <QuestionStep
                stepNumber={1}
                totalSteps={5}
                question="How big is your house? (m² or sq ft)"
                inputType="text"
                value={profile.homeSize || ''}
                onNext={(value) => handleNext('homeSize', value)}
                onSkip={() => handleSkip('homeSize')}
              />
            )}
            {step === 2 && (
              <QuestionStep
                stepNumber={2}
                totalSteps={5}
                question="How often do you use heating per day?"
                helperText="Enter hours per day"
                inputType="number"
                value={profile.heatingUsage || ''}
                onNext={(value) => handleNext('heatingUsage', value)}
                onSkip={() => handleSkip('heatingUsage')}
                onBack={handleBack}
              />
            )}
            {step === 3 && (
              <QuestionStep
                stepNumber={3}
                totalSteps={5}
                question="What appliances do you use daily?"
                helperText="Example: fridge, TV, washing machine…"
                inputType="textarea"
                value={profile.dailyAppliances || ''}
                onNext={(value) => handleNext('dailyAppliances', value)}
                onSkip={() => handleSkip('dailyAppliances')}
                onBack={handleBack}
              />
            )}
            {step === 4 && (
              <QuestionStep
                stepNumber={4}
                totalSteps={5}
                question="What is your monthly electricity bill?"
                helperText="Enter amount (e.g., £100 or 100)"
                inputType="text"
                value={profile.monthlyBill || ''}
                onNext={(value) => handleNext('monthlyBill', value)}
                onSkip={() => handleSkip('monthlyBill')}
                onBack={handleBack}
              />
            )}
            {step === 5 && (
              <QuestionStep
                stepNumber={5}
                totalSteps={5}
                question="Any other info you'd like us to consider?"
                helperText="For example: appliance age, insulation, issues you've noticed…"
                inputType="textarea"
                value={profile.extraInfo || ''}
                onNext={(value) => handleFinish('extraInfo', value)}
                onSkip={() => handleFinish('extraInfo', null)}
                onBack={handleBack}
                isLastStep={true}
              />
            )}
            {step === 6 && (
              <SummaryScreen profile={profile} onRestart={handleRestart} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

