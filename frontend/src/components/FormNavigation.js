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
  
  return (
    <div className="form-navigation">
      <div className="nav-buttons">
        <button 
          type="button" 
          className="nav-button back" 
          onClick={onBack}
          disabled={currentStep === 1 && !isLastActivity}
        >
          Back
        </button>
        
        {isLastStep && isLastActivity ? (
          <button 
            type="button" 
            className="nav-button submit"
            onClick={onSubmit}
          >
            Submit
          </button>
        ) : (
          <button 
            type="button" 
            className="nav-button next"
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
      
      <div className="activity-buttons">
        <button 
          type="button" 
          className="activity-button add"
          onClick={onAddActivity}
        >
          Add Activity
        </button>
        
        {canRemove && (
          <button 
            type="button" 
            className="activity-button remove"
            onClick={onRemoveActivity}
          >
            Remove This Activity
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