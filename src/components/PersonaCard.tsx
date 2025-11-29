import { EnergyProfile } from '../App'

interface PersonaCardProps {
  profile: EnergyProfile
  show: boolean
  onClose: () => void
}

type Persona = {
  name: string
  description: string
}

function calculateRiskScore(profile: EnergyProfile): number {
  let risk = 0

  // Heating hours
  switch (profile.heatingHours) {
    case '0_2': risk += 0; break
    case '3_5': risk += 10; break
    case '6_8': risk += 15; break
    case '9_plus': risk += 20; break
  }

  // Hot water usage
  switch (profile.hotWaterUsage) {
    case 'low': risk += 0; break
    case 'medium': risk += 8; break
    case 'high': risk += 15; break
  }

  // Cooking habits
  switch (profile.cookingHabits) {
    case 'light_microwave': risk += 0; break
    case 'normal_mixed': risk += 5; break
    case 'heavy_electric': risk += 12; break
    case 'gas_cooking': risk += 8; break
  }

  // Lighting
  switch (profile.lightingType) {
    case 'mostly_led': risk += 0; break
    case 'mixed': risk += 10; break
    case 'mostly_old': risk += 18; break
    case 'unsure': risk += 8; break
  }

  // Appliances
  switch (profile.applianceUsageAge) {
    case 'new_efficient': risk += 0; break
    case 'mixed_age': risk += 10; break
    case 'old_heavy_use': risk += 18; break
    case 'few_appliances': risk += 4; break
  }

  return risk
}

function getPersona(profile: EnergyProfile): Persona {
  if (profile.heatingHours === '6_8' || profile.heatingHours === '9_plus') {
    return {
      name: 'Heavy Heater Household',
      description: 'Focus on heating optimisation & thermostat control. Your heating usage is above average, making it the primary area for energy savings.'
    }
  }

  if (profile.hotWaterUsage === 'high') {
    return {
      name: 'Hot Water Intensive Household',
      description: 'Showers, baths, and hot water are your main focus. Reducing hot water usage can lead to significant energy savings.'
    }
  }

  if (profile.applianceUsageAge === 'old_heavy_use') {
    return {
      name: 'Appliance Power User',
      description: 'Older, frequently used appliances drive your energy use. Upgrading to efficient models could make a big difference.'
    }
  }

  if (profile.lightingType === 'mostly_old' || profile.lightingType === 'mixed') {
    return {
      name: 'Lighting Inefficient Household',
      description: 'Big potential in lighting upgrades. Switching to LED bulbs throughout your home could reduce lighting energy use by up to 80%.'
    }
  }

  return {
    name: 'Balanced Usage Household',
    description: 'No single dominant waste area; small optimisations across all categories can add up to meaningful savings over time.'
  }
}

function PersonaCard({ profile, show, onClose }: PersonaCardProps) {
  if (!show) return null

  const riskScore = calculateRiskScore(profile)
  const energyScore = Math.max(0, 100 - riskScore)
  
  let efficiencyLabel: 'High' | 'Medium' | 'Low'
  if (energyScore >= 80) {
    efficiencyLabel = 'High'
  } else if (energyScore >= 50) {
    efficiencyLabel = 'Medium'
  } else {
    efficiencyLabel = 'Low'
  }

  const persona = getPersona(profile)

  const getScoreColor = () => {
    if (energyScore >= 80) return '#3d4f3f'
    if (energyScore >= 50) return '#8a9a8c'
    return '#b8c4b8'
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '2rem',
        width: '380px',
        maxWidth: 'calc(100vw - 4rem)',
        background: '#faf9f6',
        border: '1px solid rgba(90, 107, 92, 0.2)',
        borderRadius: '4px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        zIndex: 1001,
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '1.4rem',
          fontWeight: 500,
          color: '#3d4f3f',
          margin: 0
        }}>
          Energy Persona
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: '#8a9a8c',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '1.2rem',
          fontWeight: 500,
          color: '#3d4f3f',
          marginBottom: '0.5rem'
        }}>
          {persona.name}
        </h4>
        <p style={{
          fontSize: '0.9rem',
          color: '#6b6b6b',
          lineHeight: 1.6,
          margin: 0
        }}>
          {persona.description}
        </p>
      </div>

      <div style={{
        padding: '1.5rem',
        background: 'rgba(184, 196, 184, 0.1)',
        borderLeft: `3px solid ${getScoreColor()}`,
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#8a9a8c',
          marginBottom: '0.5rem'
        }}>
          Energy Efficiency Score
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <span style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '2.5rem',
            fontWeight: 500,
            color: getScoreColor()
          }}>
            {energyScore}
          </span>
          <span style={{
            fontSize: '1rem',
            color: '#5a6b5c',
            fontWeight: 500
          }}>
            / 100
          </span>
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: getScoreColor(),
          fontWeight: 500
        }}>
          {efficiencyLabel} Efficiency
        </div>
      </div>
    </div>
  )
}

export default PersonaCard

