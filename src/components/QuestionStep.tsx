import { PillOption } from '../App'

interface QuestionStepProps {
  stepNumber: number
  totalSteps: number
  question: string
  helperText?: string
  options?: PillOption[]
  selectedValue?: string | null
  onSelect?: (value: string) => void
  isTextInput?: boolean
  textValue?: string
  onTextChange?: (value: string) => void
  onNext: () => void
  onSkip: () => void
  onBack?: () => void
  isLastStep?: boolean
}

function QuestionStep({
  stepNumber,
  totalSteps,
  question,
  helperText,
  options,
  selectedValue,
  onSelect,
  isTextInput = false,
  textValue = '',
  onTextChange,
  onNext,
  onSkip,
  onBack,
  isLastStep = false,
}: QuestionStepProps) {
  return (
    <div className="card border-0">
      <div className="card-body" style={{ padding: '3.5rem' }}>
        {/* Progress indicator */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted" style={{ fontSize: '0.95rem' }}>Step {stepNumber} of {totalSteps}</small>
          </div>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              aria-valuenow={stepNumber}
              aria-valuemin={0}
              aria-valuemax={totalSteps}
            ></div>
          </div>
        </div>

        <h2 style={{ 
          fontSize: '2rem', 
          lineHeight: 1.4,
          fontWeight: 600,
          marginBottom: '1.5rem',
          color: '#3d4f3f',
          fontFamily: 'Outfit, sans-serif'
        }}>
          {question}
        </h2>
        
        {helperText && (
          <p style={{ 
            color: '#8a9a8c', 
            fontSize: '1.05rem',
            marginBottom: '2.5rem',
            lineHeight: 1.7
          }}>
            {helperText}
          </p>
        )}

        {/* Pill Options */}
        {!isTextInput && options && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect?.(option.value)}
                style={{
                  padding: '1rem 1.75rem',
                  borderRadius: '50px',
                  border: selectedValue === option.value ? '1px solid #3d4f3f' : '1px solid #d4d4d4',
                  background: selectedValue === option.value ? '#3d4f3f' : '#f5f5f5',
                  color: selectedValue === option.value ? '#faf9f6' : '#4a4a4a',
                  fontSize: '1rem',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  if (selectedValue !== option.value) {
                    e.currentTarget.style.borderColor = '#8a9a8c'
                    e.currentTarget.style.background = '#e8e8e8'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedValue !== option.value) {
                    e.currentTarget.style.borderColor = '#d4d4d4'
                    e.currentTarget.style.background = '#f5f5f5'
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Text Input for last question */}
        {isTextInput && (
          <div style={{ marginBottom: '3rem' }}>
            <textarea
              className="form-control"
              rows={6}
              value={textValue}
              onChange={(e) => onTextChange?.(e.target.value)}
              placeholder="Type your answer here (optional)..."
              style={{
                border: '1px solid #b8c4b8',
                padding: '1.5rem',
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.6)'
              }}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="d-flex gap-3">
          {onBack && (
            <button
              className="btn btn-outline-secondary"
              onClick={onBack}
              style={{ minWidth: '120px', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
            >
              Back
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={onSkip}
            style={{ minWidth: '120px', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
          >
            Skip
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            style={{ flex: 1, padding: '0.85rem 1.5rem', fontSize: '1rem' }}
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionStep
