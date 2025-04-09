import React from 'react';

const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack, 
  isLastActivity,
  onAddActivity,
  onRemoveActivity,
  canRemove,
  onSubmit
}) => {
  const isLastStep = currentStep === totalSteps;
  
  // Safe function call with debugging
  const handleSubmitClick = () => {
    console.log("Submit button clicked");
    if (typeof onSubmit === 'function') {
      console.log("Calling onSubmit function");
      onSubmit();
    } else {
      console.error("onSubmit is not a function");
    }
  };
  
  return (
    <div className="form-navigation">
      <div className="nav-buttons">
        <button 
          type="button" 
          className="nav-button back" 
          onClick={onBack}
          disabled={currentStep === 1 && !isLastActivity}
        >
          <span className="button-icon">&#x2190;</span> Back
        </button>
        
        {isLastStep && isLastActivity ? (
          <button 
            type="button" 
            className="nav-button submit"
            onClick={handleSubmitClick}
          >
            Submit <span className="button-icon">&#x2714;</span>
          </button>
        ) : (
          <button 
            type="button" 
            className="nav-button next"
            onClick={onNext}
          >
            Next <span className="button-icon">&#x2192;</span>
          </button>
        )}
      </div>
      
      <div className="activity-buttons">
        <button 
          type="button" 
          className="activity-button add"
          onClick={onAddActivity}
        >
          <span className="button-icon">&#x2b;</span> Add Activity
        </button>
        
        {canRemove && (
          <button 
            type="button" 
            className="activity-button remove"
            onClick={onRemoveActivity}
          >
            <span className="button-icon">&#x2212;</span> Remove Activity
          </button>
        )}
      </div>
      
      <div className="step-indicator">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default FormNavigation;