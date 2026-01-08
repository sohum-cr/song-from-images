import './ProgressIndicator.css';

const STEPS = [
  { id: 'upload', label: 'Upload', icon: '📸' },
  { id: 'analyze', label: 'Analyze', icon: '🔍' },
  { id: 'generate', label: 'Generate', icon: '🎵' },
  { id: 'result', label: 'Result', icon: '✨' }
];

const ProgressIndicator = ({ currentStep }) => {
  const getCurrentStepIndex = () => {
    return STEPS.findIndex(step => step.id === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="progress-indicator">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={step.id} className="progress-step-wrapper">
            <div
              className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isUpcoming ? 'upcoming' : ''}`}
            >
              <div className="progress-step-circle">
                {isCompleted ? (
                  <span className="checkmark">✓</span>
                ) : (
                  <span className="step-icon">{step.icon}</span>
                )}
              </div>
              <span className="progress-step-label">{step.label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`progress-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
