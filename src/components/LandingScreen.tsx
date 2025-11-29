interface LandingScreenProps {
  onStart: () => void
}

function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="card shadow-lg border-0">
      <div className="card-body text-center p-5">
        <h1 className="card-title display-4 mb-3">Energy Coach</h1>
        <p className="card-text lead mb-4">
          Let's understand your home energy use and give you personalised
          savings tips.
        </p>
        <button
          className="btn btn-success btn-lg px-5 py-3"
          onClick={onStart}
        >
          Start Assessment
        </button>
      </div>
    </div>
  )
}

export default LandingScreen

