import { EnergyProfile } from '../App'

interface SummaryScreenProps {
  profile: EnergyProfile
  onRestart: () => void
}

// Label mappings for display
const labelMaps = {
  heatingHours: {
    '0_2': '0–2 hours per day',
    '3_5': '3–5 hours per day',
    '6_8': '6–8 hours per day',
    '9_plus': '9+ hours per day'
  },
  hotWaterUsage: {
    'low': 'Low (1–2 uses per day)',
    'medium': 'Medium (3–5 uses per day)',
    'high': 'High (6+ uses per day)'
  },
  cookingHabits: {
    'light_microwave': '0–1 light meals (mostly microwave/toaster)',
    'normal_mixed': '1–2 full meals (mix of hob and oven)',
    'heavy_electric': '2–3+ cooked meals (electric hob/oven)',
    'gas_cooking': 'Mostly gas hob/oven'
  },
  lightingType: {
    'mostly_led': 'Mostly LED bulbs',
    'mixed': 'Mix of LED and older bulbs',
    'mostly_old': 'Mostly older bulbs (halogen/incandescent)',
    'unsure': 'Not sure'
  },
  applianceUsageAge: {
    'new_efficient': 'New efficient appliances (under 5 years)',
    'mixed_age': 'Mix of old and new appliances',
    'old_heavy_use': 'Mostly older appliances (10+ years)',
    'few_appliances': 'Limited appliance use'
  }
}

function SummaryScreen({ profile, onRestart }: SummaryScreenProps) {
  const getLabel = (field: keyof typeof labelMaps, value: string | null): string => {
    if (!value) return 'Not provided'
    return labelMaps[field][value as keyof typeof labelMaps[typeof field]] || value
  }

  const generateAIPrompt = (profile: EnergyProfile): string => {
    return `User home energy profile (aligned with UK ECUK dataset categories):

- Space Heating (hours per day): ${profile.heatingHours ? getLabel('heatingHours', profile.heatingHours) : 'not provided'}
- Water Heating (showers, baths, dishwashing): ${profile.hotWaterUsage ? getLabel('hotWaterUsage', profile.hotWaterUsage) : 'not provided'}
- Cooking (meals per day & appliances): ${profile.cookingHabits ? getLabel('cookingHabits', profile.cookingHabits) : 'not provided'}
- Lighting (types used): ${profile.lightingType ? getLabel('lightingType', profile.lightingType) : 'not provided'}
- Appliances & Electronics (daily use & age): ${profile.applianceUsageAge ? getLabel('applianceUsageAge', profile.applianceUsageAge) : 'not provided'}
- Extra notes: ${profile.extraQuestion || 'none'}

Task: Based on this profile, generate 3–5 personalised, practical energy-saving recommendations.
Reference UK domestic energy consumption patterns where relevant.
Focus on space heating efficiency, water heating habits, cooking methods, lighting upgrades, and appliance efficiency.
Use a friendly and encouraging tone.`
  }

  const getRecommendations = (profile: EnergyProfile): string[] => {
    const recommendations: string[] = []

    // Check space heating usage
    if (profile.heatingHours === '6_8' || profile.heatingHours === '9_plus') {
      recommendations.push(
        'Your heating runs longer than average. Lowering thermostat by 1°C can save around 8% annually. Consider a smart thermostat for better control.'
      )
    }

    // Check water heating usage
    if (profile.hotWaterUsage === 'high') {
      recommendations.push(
        'With high hot water usage, consider a more efficient water heater or reducing shower times by 1–2 minutes to save significant energy.'
      )
    }

    // Check lighting types
    if (profile.lightingType === 'mostly_old' || profile.lightingType === 'mixed') {
      recommendations.push(
        'Switching to LED bulbs throughout your home can reduce lighting energy use by up to 80% compared to older bulb types.'
      )
    }

    // Check appliances
    if (profile.applianceUsageAge === 'old_heavy_use') {
      recommendations.push(
        'Older appliances (10+ years) are often less efficient. Upgrading to A-rated models could significantly reduce your electricity consumption.'
      )
    }

    // Check cooking habits
    if (profile.cookingHabits === 'heavy_electric') {
      recommendations.push(
        'Using the oven frequently is energy-intensive. Consider batch cooking or using a microwave/air fryer for smaller meals to save energy.'
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
    <div className="card border-0">
      <div className="card-body">
        {/* Minimal Header */}
        <div className="text-center mb-4">
          <span style={{ 
            fontSize: '0.65rem', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase',
            color: '#8a9a8c'
          }}>
            ECOHOME
          </span>
        </div>

        <div className="text-center mb-5">
          <div style={{ marginBottom: '1.5rem' }}>
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#5a6b5c" 
              strokeWidth="1"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 300,
            marginBottom: '0.5rem'
          }}>
            Your Energy Summary
          </h1>
          <p style={{ color: '#8a9a8c', fontSize: '0.85rem' }}>
            Based on your responses
          </p>
        </div>

        {/* Profile Summary Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h4 style={{ 
            fontSize: '0.7rem', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            color: '#8a9a8c',
            marginBottom: '1.5rem'
          }}>
            Profile Overview
          </h4>
          <div className="list-group">
            {profile.heatingHours && (
              <div className="list-group-item">
                <span style={{ color: '#8a9a8c', marginRight: '0.75rem' }}>01</span>
                <strong>Space Heating</strong>
                <p style={{ margin: '0.5rem 0 0 1.75rem', color: '#6b6b6b' }}>{getLabel('heatingHours', profile.heatingHours)}</p>
              </div>
            )}
            {profile.hotWaterUsage && (
              <div className="list-group-item">
                <span style={{ color: '#8a9a8c', marginRight: '0.75rem' }}>02</span>
                <strong>Water Heating</strong>
                <p style={{ margin: '0.5rem 0 0 1.75rem', color: '#6b6b6b' }}>{getLabel('hotWaterUsage', profile.hotWaterUsage)}</p>
              </div>
            )}
            {profile.cookingHabits && (
              <div className="list-group-item">
                <span style={{ color: '#8a9a8c', marginRight: '0.75rem' }}>03</span>
                <strong>Cooking</strong>
                <p style={{ margin: '0.5rem 0 0 1.75rem', color: '#6b6b6b' }}>{getLabel('cookingHabits', profile.cookingHabits)}</p>
              </div>
            )}
            {profile.lightingType && (
              <div className="list-group-item">
                <span style={{ color: '#8a9a8c', marginRight: '0.75rem' }}>04</span>
                <strong>Lighting</strong>
                <p style={{ margin: '0.5rem 0 0 1.75rem', color: '#6b6b6b' }}>{getLabel('lightingType', profile.lightingType)}</p>
              </div>
            )}
            {profile.applianceUsageAge && (
              <div className="list-group-item">
                <span style={{ color: '#8a9a8c', marginRight: '0.75rem' }}>05</span>
                <strong>Appliances</strong>
                <p style={{ margin: '0.5rem 0 0 1.75rem', color: '#6b6b6b' }}>{getLabel('applianceUsageAge', profile.applianceUsageAge)}</p>
              </div>
            )}
            {profile.extraQuestion && (
              <div className="list-group-item">
                <span style={{ color: '#8a9a8c', marginRight: '0.75rem' }}>06</span>
                <strong>Additional Notes</strong>
                <p style={{ margin: '0.5rem 0 0 1.75rem', color: '#6b6b6b' }}>{profile.extraQuestion}</p>
              </div>
            )}
            {!profile.heatingHours &&
              !profile.hotWaterUsage &&
              !profile.cookingHabits &&
              !profile.lightingType &&
              !profile.applianceUsageAge && (
                <div className="list-group-item text-muted">
                  No information provided
                </div>
              )}
          </div>
        </section>

        {/* Recommendations Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h4 style={{ 
            fontSize: '0.7rem', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            color: '#8a9a8c',
            marginBottom: '1.5rem'
          }}>
            Recommendations
          </h4>
          <div className="alert alert-info">
            {recommendations.map((rec, index) => (
              <p key={index} style={{ 
                marginBottom: index === recommendations.length - 1 ? 0 : '1rem',
                lineHeight: 1.7,
                fontSize: '0.95rem'
              }}>
                {rec}
              </p>
            ))}
          </div>
        </section>

        {/* AI Prompt Section */}
        <section style={{ marginBottom: '2.5rem' }}>
          <details style={{ cursor: 'pointer' }}>
            <summary style={{ 
              fontSize: '0.7rem', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              color: '#8a9a8c',
              marginBottom: '1rem',
              outline: 'none'
            }}>
              AI Prompt Preview
            </summary>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              For backend integration with OpenAI
            </p>
            <textarea
              className="form-control"
              rows={10}
              readOnly
              value={aiPrompt}
              style={{ 
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(255,255,255,0.5)',
                border: '1px solid #b8c4b8'
              }}
            />
          </details>
        </section>

        <div className="d-grid">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={onRestart}
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

export default SummaryScreen

