import { EnergyProfile } from '../App'

interface SummaryScreenProps {
  profile: EnergyProfile
  onRestart: () => void
}

function SummaryScreen({ profile, onRestart }: SummaryScreenProps) {
  const generateAIPrompt = (profile: EnergyProfile): string => {
    return `User home energy profile:

- Home size: ${profile.homeSize || 'not provided'}
- Heating usage per day: ${profile.heatingUsage || 'not provided'}
- Daily appliances: ${profile.dailyAppliances || 'not provided'}
- Monthly electricity bill: ${profile.monthlyBill || 'not provided'}
- Extra information: ${profile.extraInfo || 'not provided'}

Task: Based on this profile, generate 3–5 personalised, practical energy-saving recommendations.
Focus on heating behavior, appliance efficiency, and simple lifestyle changes.
Use a friendly and encouraging tone.`
  }

  const getRecommendations = (profile: EnergyProfile): string[] => {
    const recommendations: string[] = []

    const homeSize = profile.homeSize
    const billValue = profile.monthlyBill
      ? parseFloat(profile.monthlyBill.replace(/[£$,\s]/g, ''))
      : null
    const heatingHours = profile.heatingUsage
      ? parseFloat(profile.heatingUsage)
      : null

    // Check if bill is high relative to home size
    if (homeSize && billValue && billValue > 100) {
      recommendations.push(
        'Your bill is relatively high for your home size. Consider checking appliance efficiency and insulation.'
      )
    }

    // Check heating usage
    if (heatingHours && heatingHours > 6) {
      recommendations.push(
        'Your heating runs longer than average. Lowering thermostat by 1°C can save around 8% annually.'
      )
    }

    // Check if appliances are mentioned
    if (profile.dailyAppliances && profile.dailyAppliances.trim() !== '') {
      recommendations.push(
        'Upgrading older frequently used appliances to A-rated models could reduce electricity use significantly.'
      )
    }

    // Generic recommendation if no specific ones
    if (recommendations.length === 0) {
      recommendations.push(
        'Consider conducting an energy audit to identify specific areas for improvement in your home.'
      )
    }

    return recommendations
  }

  const recommendations = getRecommendations(profile)
  const aiPrompt = generateAIPrompt(profile)

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-4 p-md-5">
        <h2 className="card-title mb-4">Your Energy Summary</h2>

        {/* Profile Summary Section */}
        <section className="mb-5">
          <h4 className="mb-3">Profile Summary</h4>
          <div className="list-group">
            {profile.homeSize && (
              <div className="list-group-item">
                <strong>Home Size:</strong> {profile.homeSize}
              </div>
            )}
            {profile.heatingUsage && (
              <div className="list-group-item">
                <strong>Heating Usage:</strong> {profile.heatingUsage} hours per day
              </div>
            )}
            {profile.dailyAppliances && (
              <div className="list-group-item">
                <strong>Daily Appliances:</strong> {profile.dailyAppliances}
              </div>
            )}
            {profile.monthlyBill && (
              <div className="list-group-item">
                <strong>Monthly Bill:</strong> {profile.monthlyBill}
              </div>
            )}
            {profile.extraInfo && (
              <div className="list-group-item">
                <strong>Extra Info:</strong> {profile.extraInfo}
              </div>
            )}
            {!profile.homeSize &&
              !profile.heatingUsage &&
              !profile.dailyAppliances &&
              !profile.monthlyBill &&
              !profile.extraInfo && (
                <div className="list-group-item text-muted">
                  No information provided
                </div>
              )}
          </div>
        </section>

        {/* Initial Recommendations Section */}
        <section className="mb-5">
          <h4 className="mb-3">Initial Recommendations</h4>
          <div className="alert alert-info">
            <ul className="mb-0">
              {recommendations.map((rec, index) => (
                <li key={index} className="mb-2">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* AI Prompt Section */}
        <section className="mb-4">
          <h4 className="mb-3">AI Prompt Preview</h4>
          <p className="text-muted small mb-2">
            Prompt to send to OpenAI (for backend integration)
          </p>
          <textarea
            className="form-control font-monospace"
            rows={12}
            readOnly
            value={aiPrompt}
            style={{ fontSize: '0.875rem' }}
          />
        </section>

        <div className="d-grid">
          <button className="btn btn-primary btn-lg" onClick={onRestart}>
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

export default SummaryScreen

