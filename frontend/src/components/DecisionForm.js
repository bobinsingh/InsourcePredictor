import React, { useState } from 'react';
import FormNavigation from './FormNavigation';

const DecisionForm = ({ activities, onAddActivity, onRemoveActivity, onInputChange, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [selectedField, setSelectedField] = useState(null);
  
  const formSteps = [
    { fields: ['activity_name', 'activity_type', 'business_case'], title: 'Activity Details' },
    { fields: ['core', 'legal_requirement', 'risks'], title: 'Core Requirements' },
    { fields: ['risk_tolerance', 'frequency', 'specialised_skill'], title: 'Risk & Skills' },
    { fields: ['similarity_with_current_scopes', 'skill_capacity', 'duration'], title: 'Capacity & Duration' },
    { fields: ['affordability', 'strategic_fit'], title: 'Business Alignment' },
  ];
  
  const fieldLabels = {
    activity_name: 'Activity Name',
    activity_type: 'Activity Type',
    business_case: 'Business case',
    core: 'Core ',
    legal_requirement: 'Legal requirement',
    risks: 'Risks',
    risk_tolerance: 'Risk tolerance ',
    frequency: 'Frequency',
    specialised_skill: 'Specialised Skill',
    similarity_with_current_scopes: 'Similarity with current scopes',
    skill_capacity: 'Skill capacity',
    duration: 'Duration ',
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
  
  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
      setSelectedField(null);
    } else if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      setCurrentStep(1);
      setSelectedField(null);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSelectedField(null);
    } else if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
      setCurrentStep(formSteps.length);
      setSelectedField(null);
    }
  };
  
  const handleSkipToActivity = (index) => {
    setCurrentActivityIndex(index);
    setCurrentStep(1);
    setSelectedField(null);
  };

  const handleFormSubmit = () => {
    // Verify all required fields are filled for the current activity
    const currentActivity = activities[currentActivityIndex];
    const currentRequiredFields = formSteps.flatMap(step => 
      step.fields.filter(field => 
        field !== 'activity_name' && 
        field !== 'activity_type' && 
        field !== 'legal_requirement' && 
        field !== 'risks' && 
        field !== 'risk_tolerance' && 
        field !== 'strategic_fit'
      )
    );
    
    const missingFields = currentRequiredFields.some(field => !currentActivity[field]);
    
    if (missingFields) {
      alert('Please fill in all required fields before submitting.');
      return;
    }
    
    // Call the parent onSubmit function
    if (typeof onSubmit === 'function') {
      onSubmit();
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
  
  const currentFields = formSteps[currentStep - 1].fields;
  
  return (
    <div className="decision-form-container">
      <div className="form-header">
        <h2>Activity {currentActivityIndex + 1} of {activities.length}: {formSteps[currentStep - 1].title}</h2>
        
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
          {currentFields.map((field, index) => (
            <div 
              key={field} 
              className={`form-group ${selectedField === field ? 'selected' : ''}`}
              onClick={() => setSelectedField(field)}
            >
              <div className="field-header">
                <div className="field-number">{index + 1}</div>
                <label>{fieldLabels[field]}</label>
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
                <h4>{fieldLabels[currentFields[0]]}</h4>
                <p>{fieldTooltips[currentFields[0]]}</p>
                <div className="description-hint">
                  <p>Click on any question to view its description here.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <FormNavigation 
      currentStep={currentStep}
      totalSteps={formSteps.length}
      onNext={handleNext}
      onBack={handleBack}
      isLastActivity={currentActivityIndex === activities.length - 1}
      onAddActivity={onAddActivity}
      onRemoveActivity={() => onRemoveActivity(currentActivity.id)}
      canRemove={activities.length > 1}
      onSubmit={handleFormSubmit}
    />
    </div>
  );
};

export default DecisionForm;