import React, { useState } from 'react';
import Tooltip from './Tooltip';

const DecisionForm = ({ activities, onAddActivity, onRemoveActivity, onInputChange, onSubmit }) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [selectedField, setSelectedField] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Group fields into pages (6 per page)
  const fieldPages = [
    ['activity_name', 'activity_type', 'business_case', 'core', 'legal_requirement', 'risks'],
    ['risk_tolerance', 'frequency', 'specialised_skill', 'similarity_with_current_scopes', 'skill_capacity', 'duration'],
    ['affordability', 'strategic_fit']
  ];
  
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
  
  const handleSkipToActivity = (index) => {
    setCurrentActivityIndex(index);
    setCurrentStep(1);
    setSelectedField(null);
  };

  const handleFormSubmit = () => {
    // Verify all required fields are filled for the current activity
    const currentActivity = activities[currentActivityIndex];
    const requiredFields = [
      'business_case', 'core', 'frequency', 'specialised_skill',
      'similarity_with_current_scopes', 'skill_capacity', 'duration', 'affordability'
    ];
    
    const missingFields = requiredFields.some(field => !currentActivity[field]);
    
    if (missingFields) {
      alert('Please fill in all required fields before submitting.');
      return;
    }
    
    // Call the parent onSubmit function
    if (typeof onSubmit === 'function') {
      onSubmit();
    }
  };
  
  const handleNext = () => {
    if (currentStep < fieldPages.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      setCurrentStep(1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
      setCurrentStep(fieldPages.length);
    }
  };
  
  // Ensure we have a valid activity
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
  
  return (
    <div className="decision-form-container">
      <div className="form-header">
        <h2>Activity {currentActivityIndex + 1} of {activities.length}: Page {currentStep} of {totalSteps}</h2>
        
        {activities.length > 1 && (
          <div className="activity-tabs">
            {activities.map((activity, index) => (
              <button 
                key={index}
                className={`activity-tab ${index === currentActivityIndex ? 'active' : ''}`}
                onClick={() => handleSkipToActivity(index)}
              >
                {(activity && activity.activity_name) ? activity.activity_name : `Activity ${index + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>
      
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
      
      <div className="form-navigation">
        <div className="nav-buttons">
          <button 
            type="button" 
            className="nav-button back" 
            onClick={handleBack}
            disabled={currentStep === 1 && currentActivityIndex === 0}
          >
            <span className="button-icon">&#x2190;</span> Back
          </button>
          
          {currentStep === fieldPages.length && currentActivityIndex === activities.length - 1 ? (
            <button 
              type="button" 
              className="nav-button submit"
              onClick={handleFormSubmit}
            >
              Submit <span className="button-icon">&#x2714;</span>
            </button>
          ) : (
            <button 
              type="button" 
              className="nav-button next"
              onClick={handleNext}
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
            + Add Activity
          </button>
          
          {activities.length > 1 && (
            <button 
              type="button" 
              className="activity-button remove"
              onClick={() => onRemoveActivity(currentActivity.id)}
            >
              - Remove Activity
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