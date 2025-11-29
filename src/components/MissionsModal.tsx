import { useState } from 'react'
import { EnergyProfile } from '../App'

interface MissionsModalProps {
  profile: EnergyProfile
  show: boolean
  onClose: () => void
}

type Mission = {
  id: string
  title: string
  subtitle?: string
  description: string
  estimatedSavings?: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  applicable: (profile: EnergyProfile) => boolean
}

const allMissions: Mission[] = [
  {
    id: 'led-lighting',
    title: 'LED Lighting Sprint',
    description: 'Swap 2–3 of your most-used bulbs to LED this week. Start with rooms you use most often like the kitchen, living room, or bedroom.',
    estimatedSavings: 'Could save up to £20–£40/year',
    difficulty: 'Easy',
    applicable: (profile) => profile.lightingType !== 'mostly_led'
  },
  {
    id: 'thermostat-tweak',
    title: 'Thermostat Tweak Week',
    description: 'Lower your thermostat by 1°C for 7 days. You might not even notice the difference, but your energy bill will!',
    estimatedSavings: 'Often saves around 8% on heating',
    difficulty: 'Medium',
    applicable: (profile) => profile.heatingHours === '6_8' || profile.heatingHours === '9_plus'
  },
  {
    id: 'quick-shower',
    title: 'Quick Shower Challenge',
    description: 'Reduce shower time by 2 minutes for each person for 5 days. Set a timer to keep track!',
    estimatedSavings: 'Could save £45–£90/year per person',
    difficulty: 'Medium',
    applicable: (profile) => profile.hotWaterUsage === 'high'
  },
  {
    id: 'appliance-audit',
    title: 'Appliance Audit Quest',
    description: 'Identify your 2 oldest high-use appliances and check their energy labels. Research replacement options if they\'re rated C or below.',
    estimatedSavings: 'Upgrading old appliances can save £100–£200/year',
    difficulty: 'Hard',
    applicable: (profile) => profile.applianceUsageAge === 'old_heavy_use' || profile.applianceUsageAge === 'mixed_age'
  },
  {
    id: 'standby-hunt',
    title: 'Standby Hunt',
    description: 'Walk around your home once this week and unplug unused chargers and devices in standby. Check TVs, computers, game consoles, and kitchen appliances.',
    estimatedSavings: 'Could save up to £65/year',
    difficulty: 'Easy',
    applicable: () => true // Always applicable
  },
  {
    id: 'cooking-optimization',
    title: 'Cooking Efficiency Mission',
    description: 'Use lids on pots when cooking and try batch cooking for 3 days. This reduces cooking time and energy use significantly.',
    estimatedSavings: 'Can reduce cooking energy by 25–35%',
    difficulty: 'Easy',
    applicable: (profile) => profile.cookingHabits === 'heavy_electric' || profile.cookingHabits === 'normal_mixed'
  },
  {
    id: 'heating-schedule',
    title: 'Smart Heating Schedule',
    description: 'Set your heating to turn off 30 minutes before you go to bed and turn on 30 minutes before you wake up. Your home will stay warm enough!',
    estimatedSavings: 'Could save £60–£80/year',
    difficulty: 'Easy',
    applicable: (profile) => profile.heatingHours === '6_8' || profile.heatingHours === '9_plus' || profile.heatingHours === '3_5'
  }
]

function MissionsModal({ profile, show, onClose }: MissionsModalProps) {
  const [missionIndex, setMissionIndex] = useState(0)

  if (!show) return null

  const activeMissions = allMissions.filter(mission => mission.applicable(profile))
  
  // If no missions match, show at least the standby hunt
  const missionsToShow = activeMissions.length > 0 
    ? activeMissions 
    : allMissions.filter(m => m.id === 'standby-hunt')

  const currentMission = missionsToShow[missionIndex]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#3d4f3f'
      case 'Medium': return '#8a9a8c'
      case 'Hard': return '#b8c4b8'
      default: return '#5a6b5c'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#faf9f6',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.8rem',
              fontWeight: 500,
              color: '#3d4f3f',
              margin: 0
            }}>
              Energy Missions
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.8rem',
                color: '#8a9a8c',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1,
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {missionsToShow.length > 0 ? (
            <>
              {/* Mission Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(184, 196, 184, 0.3)',
                borderRadius: '4px',
                padding: '2rem',
                marginBottom: '2rem',
                minHeight: '300px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Cormorant Garamond, Georgia, serif',
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      color: '#3d4f3f',
                      marginBottom: '0.5rem'
                    }}>
                      {currentMission.title}
                    </h3>
                    {currentMission.subtitle && (
                      <p style={{ fontSize: '0.85rem', color: '#8a9a8c', margin: 0 }}>
                        {currentMission.subtitle}
                      </p>
                    )}
                  </div>
                  <span style={{
                    padding: '0.4rem 0.8rem',
                    background: getDifficultyColor(currentMission.difficulty),
                    color: '#faf9f6',
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: '2px'
                  }}>
                    {currentMission.difficulty}
                  </span>
                </div>

                <p style={{
                  fontSize: '1rem',
                  color: '#4a4a4a',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem'
                }}>
                  {currentMission.description}
                </p>

                {currentMission.estimatedSavings && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(184, 196, 184, 0.15)',
                    borderLeft: '3px solid #3d4f3f',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#8a9a8c',
                      marginBottom: '0.25rem'
                    }}>
                      Estimated Savings
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      color: '#3d4f3f',
                      fontWeight: 500
                    }}>
                      {currentMission.estimatedSavings}
                    </div>
                  </div>
                )}

                <div style={{
                  fontSize: '0.8rem',
                  color: '#8a9a8c',
                  textAlign: 'center',
                  marginTop: '1.5rem'
                }}>
                  Mission {missionIndex + 1} of {missionsToShow.length}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setMissionIndex(i => Math.max(0, i - 1))}
                  disabled={missionIndex === 0}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: missionIndex === 0 ? 'transparent' : '#3d4f3f',
                    border: '1px solid #3d4f3f',
                    color: missionIndex === 0 ? '#8a9a8c' : '#faf9f6',
                    fontSize: '0.8rem',
                    cursor: missionIndex === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: missionIndex === 0 ? 0.5 : 1
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setMissionIndex(i => Math.min(missionsToShow.length - 1, i + 1))}
                  disabled={missionIndex === missionsToShow.length - 1}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: missionIndex === missionsToShow.length - 1 ? 'transparent' : '#3d4f3f',
                    border: '1px solid #3d4f3f',
                    color: missionIndex === missionsToShow.length - 1 ? '#8a9a8c' : '#faf9f6',
                    fontSize: '0.8rem',
                    cursor: missionIndex === missionsToShow.length - 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: missionIndex === missionsToShow.length - 1 ? 0.5 : 1
                  }}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#8a9a8c' }}>No missions available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MissionsModal

