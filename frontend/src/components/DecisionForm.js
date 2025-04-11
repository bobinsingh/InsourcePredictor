import React, { useState, useEffect, useCallback } from 'react';
import Tooltip from './Tooltip';

const DecisionForm = ({ 
  activities, 
  onAddActivity, 
  onRemoveActivity, 
  onInputChange, 
  onSubmit, 
  updatingActivityId,
  currentActivityIndex: externalCurrentActivityIndex,
  setCurrentActivityIndex: externalSetCurrentActivityIndex,
  activityResults,
  onEditForm,
  onCancelEdit,
  submittedActivityIds,
  onViewResults,
  hasResults
}) => {
  // Define fieldPages at the top so it can be referenced in hooks
  const fieldPages = [
    ['activity_name', 'activity_type', 'business_case', 'core', 'legal_requirement', 'risks'],
    ['risk_tolerance', 'frequency', 'specialised_skill', 'similarity_with_current_scopes', 'skill_capacity', 'duration'],
    ['affordability', 'strategic_fit']
  ];
  
  // All hooks MUST be called at the top level, before any conditional returns
  const [selectedField, setSelectedField] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [initialActivityStates, setInitialActivityStates] = useState({});
  
  // Use the external activity index directly instead of duplicating state
  const currentActivityIndex = externalCurrentActivityIndex || 0;

  // Store initial activity states when component is mounted or updatingActivityId changes
  useEffect(() => {
    // If we're updating an activity, store the initial states
    if (updatingActivityId && activities && activities.length > 0) {
      // Deep clone the activities to store their initial state
      const activityStates = {};
      activities.forEach(activity => {
        activityStates[activity.id] = JSON.stringify(activity);
      });
      setInitialActivityStates(activityStates);
      
      // Only set the current activity index to the updating activity if we haven't
      // explicitly navigated away from it (only do this once when updatingActivityId is first set)
      if (!initialActivityStates[updatingActivityId]) {
        const updatingIndex = activities.findIndex(activity => activity.id === updatingActivityId);
        if (updatingIndex >= 0) {
          externalSetCurrentActivityIndex(updatingIndex);
          setCurrentStep(1); // Reset to first step when updating
        }
      }
    }
  }, [updatingActivityId, activities, externalSetCurrentActivityIndex, initialActivityStates]);
  
  // All useCallback hooks must be at the top level too
  const handleSkipToActivity = useCallback((index) => {
    externalSetCurrentActivityIndex(index);
    setCurrentStep(1);
    setSelectedField(null);
  }, [externalSetCurrentActivityIndex]);

  const isActivityModified = useCallback((activity) => {
    if (!updatingActivityId || !initialActivityStates[activity.id]) {
      return false;
    }
    
    const initialState = JSON.parse(initialActivityStates[activity.id]);
    
    // Compare relevant fields
    const fieldsToCheck = [
      'business_case', 'core', 'legal_requirement', 'risks', 'risk_tolerance',
      'frequency', 'specialised_skill', 'similarity_with_current_scopes',
      'skill_capacity', 'duration', 'affordability', 'strategic_fit'
    ];
    
    return fieldsToCheck.some(field => activity[field] !== initialState[field]);
  }, [updatingActivityId, initialActivityStates]);
  
  const handleFormSubmit = useCallback(() => {
    // Safety check if we don't have activities yet
    if (!activities || activities.length === 0 || currentActivityIndex >= activities.length) {
      return;
    }
    
    const currentActivity = activities[currentActivityIndex];
    if (!currentActivity) {
      return;
    }
    
    // Verify all required fields are filled for the current activity
    const requiredFields = [
      'business_case', 'core', 'frequency', 'specialised_skill',
      'similarity_with_current_scopes', 'skill_capacity', 'duration', 'affordability'
    ];
    
    let missingFields = requiredFields.some(field => !currentActivity[field]);
    
    if (missingFields) {
      alert('Please fill in all required fields before submitting.');
      return;
    }
    
    // Call the parent onSubmit function directly
    onSubmit();
  }, [activities, currentActivityIndex, onSubmit]);
  
  const handleNext = useCallback(() => {
    if (!activities || activities.length === 0) return;
    
    if (currentStep < fieldPages.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentActivityIndex < activities.length - 1) {
      externalSetCurrentActivityIndex(currentActivityIndex + 1);
      setCurrentStep(1);
    }
  }, [currentStep, currentActivityIndex, activities, externalSetCurrentActivityIndex, fieldPages.length]); // Added fieldPages.length

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentActivityIndex > 0) {
      externalSetCurrentActivityIndex(currentActivityIndex - 1);
      setCurrentStep(fieldPages.length); // Now we can use fieldPages.length directly
    }
  }, [currentStep, currentActivityIndex, externalSetCurrentActivityIndex, fieldPages.length]); // Added fieldPages.length
  
  // Handle Edit Form button click
  const handleEditForm = useCallback(() => {
    if (!activities || activities.length === 0 || currentActivityIndex >= activities.length) {
      return;
    }
    
    const currentActivity = activities[currentActivityIndex];
    if (!currentActivity) return;
    
    if (onEditForm) {
      onEditForm(currentActivity.id);
    }
  }, [activities, currentActivityIndex, onEditForm]);
  
  // Handle Cancel Edit button click
  const handleCancelEdit = useCallback(() => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  }, [onCancelEdit]);

  const isNextButtonDisabled = useCallback(() => {
    if (!activities || activities.length === 0 || currentActivityIndex >= activities.length) {
      return true;
    }
    
    const currentActivity = activities[currentActivityIndex];
    if (!currentActivity) return true;
    
    // Enable Next button if we're in edit mode for this activity
    if (updatingActivityId === currentActivity.id) return false;
    
    // Disable Next button if this activity has been submitted
    return submittedActivityIds.includes(currentActivity.id);
  }, [activities, currentActivityIndex, updatingActivityId, submittedActivityIds]);
  
  // Add logic to disable the submit button after canceling edit
  const isSubmitButtonDisabled = useCallback(() => {
    if (!activities || activities.length === 0 || currentActivityIndex >= activities.length) {
      return true;
    }
    
    const currentActivity = activities[currentActivityIndex];
    if (!currentActivity) return true;
    
    // Enable Submit button if we're in edit mode for this activity
    if (updatingActivityId === currentActivity.id) return false;
    
    // Disable Submit button if this activity has been submitted
    return submittedActivityIds.includes(currentActivity.id);
  }, [activities, currentActivityIndex, updatingActivityId, submittedActivityIds]);
  
  const fieldLabels = {
    activity_name: 'Activity Name',
    activity_type: 'Activity Type',
    business_case: 'Business case',
    core: 'Core',
    legal_requirement: 'Legal requirement',
    risks: 'Risks',
    risk_tolerance: 'Risk tolerance',
    frequency: 'Frequency',
    specialised_skill: 'Specialised Skill',
    similarity_with_current_scopes: 'Similarity with current scopes',
    skill_capacity: 'Skill capacity',
    duration: 'Duration',
    affordability: 'Affordability & Transferable Skill',
    strategic_fit: 'Strategic fit and Business case'
  };
  
  const fieldTooltips = {
    activity_name: 'Enter a descriptive name for this activity or service',
    activity_type: 'Specify the type or category of this activity',
    business_case: 'Does this activity have a business case?',
    core: 'Core activities are essential to your organization\'s primary mission and competitive advantage',
    legal_requirement: 'Activities required by law, regulation, or contract that cannot be eliminated',
    risks: 'Consider reputational, operational, financial, or compliance risks associated with this activity',
    risk_tolerance: 'Inside or outside your organization\'s risk tolerance boundaries',
    frequency: 'How often the activity is performed (High/Low)',
    specialised_skill: 'Whether the activity requires specialized expertise or capabilities',
    similarity_with_current_scopes: 'How similar this activity is to your organization\'s existing operations and capabilities',
    skill_capacity: 'Whether your organization already has the necessary skills and resources to perform this activity',
    duration: 'The expected timeframe for this activity (Short = temporary or project-based, Long = ongoing or permanent)',
    affordability: 'Whether your organization can afford to develop or maintain this capability internally',
    strategic_fit: 'How well this activity aligns with your organization\'s long-term strategic objectives'
  };
  
  const options = {
    business_case: ['Yes', 'No'],
    core: ['Yes', 'No'],
    legal_requirement: ['Yes', 'No', ''],
    risks: ['Yes', 'No', ''],
    risk_tolerance: ['Outside', 'Inside', ''],
    frequency: ['High', 'Low'],
    specialised_skill: ['Yes', 'No'],
    similarity_with_current_scopes: ['Yes', 'No'],
    skill_capacity: ['Yes', 'No'],
    duration: ['Long', 'Short'],
    affordability: ['Yes', 'No'],
    strategic_fit: ['Yes', 'No', '']
  };
  
  // Now check for valid activities after all hooks are called
  if (!activities || activities.length === 0 || currentActivityIndex >= activities.length) {
    return <div>Loading activities...</div>;
  }
  
  const currentActivity = activities[currentActivityIndex];
  
  if (!currentActivity) {
    return <div>Error: No activity found at index {currentActivityIndex}</div>;
  }
  
  const currentFields = fieldPages[currentStep - 1];
  const totalSteps = fieldPages.length;
  
  // Calculate the question number for each field based on its position in all pages
  const getQuestionNumber = (fieldName) => {
    const allFields = fieldPages.flat();
    return allFields.indexOf(fieldName) + 1;
  };
  
  // Check if this is the last step
  const isLastStep = currentStep === fieldPages.length;
  
  // Check if we're in edit mode for the current activity
  const isEditingActivity = updatingActivityId === currentActivity.id;
  
  return (
    <div className="decision-form-container">
      <div className="form-header">
        <h2>Activity {currentActivityIndex + 1} of {activities.length}: Page {currentStep} of {totalSteps}</h2>
      </div>
      
      {/* Removed the duplicate notification here */}
      
      <div className="form-content-container">
        <div className="questions-panel">
          {currentFields.map((field) => (
            <div 
              key={field} 
              className={`form-group ${selectedField === field ? 'selected' : ''}`}
              onClick={() => setSelectedField(field)}
            >
              <div className="field-header">
                <div className="field-number">{getQuestionNumber(field)}</div>
                <label>{fieldLabels[field]}</label>
                <Tooltip content={fieldTooltips[field]} />
              </div>
              
              {field === 'activity_name' || field === 'activity_type' ? (
                <input
                  type="text"
                  value={currentActivity[field] || ''}
                  onChange={(e) => onInputChange(currentActivity.id, field, e.target.value)}
                  placeholder={fieldLabels[field]}
                  className="form-input"
                />
              ) : (
                <div className="radio-options">
                  {options[field].map(option => (
                    <label key={option || 'empty'} className="radio-label">
                      <input
                        type="radio"
                        name={`${currentActivity.id}-${field}`}
                        checked={currentActivity[field] === option}
                        onChange={() => onInputChange(currentActivity.id, field, option)}
                      />
                      {option || 'Not Applicable'}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="description-panel">
          <div className="description-header">
            <h3>Field Description</h3>
          </div>
          <div className="description-content">
            {selectedField ? (
              <>
                <h4>{fieldLabels[selectedField]}</h4>
                <p>{fieldTooltips[selectedField]}</p>
              </>
            ) : (
              <>
                <h4>Click on any field for more information</h4>
                <p>Select any field to view its detailed description here.</p>
                <div className="description-hint">
                  <p>All required fields must be completed before submission.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Activity Tabs and View Results button above the navigation section */}
      <div className="activity-navigation">
        {hasResults && (
          <button 
            className="action-button view-results" 
            onClick={onViewResults}
          >
            View Results
          </button>
        )}
        
        {activities.length > 1 && (
          <div className="activity-tabs">
            {activities.map((activity, index) => (
              <button 
                key={activity.id} // Use activity.id for a stable key instead of index
                className={`activity-tab ${index === currentActivityIndex ? 'active' : ''}`}
                onClick={() => handleSkipToActivity(index)}
              >
                {(activity && activity.activity_name) ? activity.activity_name : `Activity ${index + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-navigation">
        <div className="nav-buttons">
          <button 
            type="button" 
            className="nav-button back" 
            onClick={handleBack}
            disabled={currentStep === 1 && currentActivityIndex === 0}
          >
            <span className="button-icon">←</span> Back
          </button>
          
          {isLastStep ? (
            <button 
              type="button" 
              className="nav-button submit"
              onClick={handleFormSubmit}
              disabled={isSubmitButtonDisabled()} // Added disabled property based on new function
            >
              {updatingActivityId === currentActivity.id && isActivityModified(currentActivity) 
                ? 'Update' 
                : 'Submit'} <span className="button-icon">✓</span>
            </button>
          ) : (
            <button 
              type="button" 
              className="nav-button next"
              onClick={handleNext}
              disabled={isNextButtonDisabled()}
            >
              Next <span className="button-icon">→</span>
            </button>
          )}
          
          {/* Add Edit Form / Cancel Edit button */}
          {submittedActivityIds.includes(currentActivity.id) && (
            <button 
              type="button" 
              className={`nav-button ${isEditingActivity ? 'back' : 'next'}`}
              onClick={isEditingActivity ? handleCancelEdit : handleEditForm}
            >
              {isEditingActivity ? 'Cancel Edit' : 'Edit Form'} 
              <span className="button-icon">{isEditingActivity ? '✕' : '✎'}</span>
            </button>
          )}
        </div>
        
        <div className="activity-buttons">
          <button 
            type="button" 
            className="activity-button add"
            onClick={onAddActivity}
          >
            <span className="button-icon">+</span> Add Activity
          </button>
          
          {activities.length > 1 && (
            <button 
              type="button" 
              className="activity-button remove"
              onClick={() => onRemoveActivity(currentActivity.id)}
            >
              <span className="button-icon">-</span> Remove Activity
            </button>
          )}
        </div>
        
        <div className="step-indicator">
          {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  );
};

export default DecisionForm;