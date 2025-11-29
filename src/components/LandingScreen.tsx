interface LandingScreenProps {
  onStart: () => void
}

function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="card border-0">
      <div className="card-body text-center" style={{ padding: '4rem 3.5rem' }}>
        {/* Decorative recycle icon */}
        <div style={{ marginBottom: '2rem' }}>
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#5a6b5c" 
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.8 }}
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
        </div>

        <h1 style={{ 
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '3.2rem', 
          fontWeight: 300,
          marginBottom: '0.75rem',
          lineHeight: 1.2,
          color: '#3d4f3f'
        }}>
          Energy Coach
        </h1>
        
        <div className="divider"></div>
        
        <p style={{ 
          color: '#6b6b6b', 
          fontSize: '1.2rem',
          lineHeight: 1.8,
          maxWidth: '450px',
          margin: '0 auto 3rem',
          fontWeight: 300
        }}>
          Let's understand your home energy use and give you personalised savings tips.
        </p>

        <button
          className="btn btn-success btn-lg"
          onClick={onStart}
          style={{ padding: '1.25rem 3rem', fontSize: '0.85rem' }}
        >
          Start Assessment
        </button>

        <p style={{ 
          marginTop: '2.5rem',
          fontSize: '0.8rem',
          color: '#8a9a8c',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          6 questions · 2 minutes
        </p>
      </div>
    </div>
  )
}

export default LandingScreen
