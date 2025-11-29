import { useState, useEffect } from 'react'

interface QuestionStepProps {
  stepNumber: number
  totalSteps: number
  question: string
  helperText?: string
  inputType: 'text' | 'number' | 'textarea'
  value: string
  onNext: (value: string | null) => void
  onSkip: () => void
  onBack?: () => void
  isLastStep?: boolean
}

function QuestionStep({
  stepNumber,
  totalSteps,
  question,
  helperText,
  inputType,
  value,
  onNext,
  onSkip,
  onBack,
  isLastStep = false,
}: QuestionStepProps) {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleNext = () => {
    const trimmedValue = inputValue.trim()
    onNext(trimmedValue === '' ? null : trimmedValue)
  }

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-4 p-md-5">
        <div className="mb-3">
          <small className="text-muted">Step {stepNumber} of {totalSteps}</small>
          <div className="progress mt-2" style={{ height: '4px' }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              aria-valuenow={stepNumber}
              aria-valuemin={0}
              aria-valuemax={totalSteps}
            ></div>
          </div>
        </div>

        <h3 className="card-title mb-3">{question}</h3>
        {helperText && (
          <p className="text-muted small mb-3">{helperText}</p>
        )}

        <div className="mb-4">
          {inputType === 'textarea' ? (
            <textarea
              className="form-control"
              rows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your answer..."
            />
          ) : (
            <input
              type={inputType}
              className="form-control form-control-lg"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your answer..."
            />
          )}
        </div>

        <div className="d-flex justify-content-between gap-3">
          {onBack && (
            <button
              className="btn btn-outline-secondary flex-fill"
              onClick={onBack}
            >
              Back
            </button>
          )}
          <button
            className="btn btn-secondary flex-fill"
            onClick={onSkip}
          >
            Skip
          </button>
          <button
            className="btn btn-primary flex-fill"
            onClick={handleNext}
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionStep

