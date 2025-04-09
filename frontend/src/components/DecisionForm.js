import React, { useState } from 'react';
import FormNavigation from './FormNavigation';
import Tooltip from './Tooltip';

const DecisionForm = ({ activities, onAddActivity, onRemoveActivity, onInputChange, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  
  const formSteps = [
    { fields: ['activity_name', 'activity_type'], title: 'Activity Details' },
    { fields: ['core', 'legal_requirement', 'risks'], title: 'Core Requirements' },
    { fields: ['risk_tolerance', 'frequency', 'specialised_skill'], title: 'Risk & Skills' },
    { fields: ['similarity_with_scopes', 'skill_capacity', 'duration'], title: 'Capacity & Duration' },
    { fields: ['affordability', 'strategic_fit'], title: 'Business Alignment' },
  ];
  
  const fieldLabels = {
    activity_name: 'Activity Name',
    activity_type: 'Activity Type',
    core: 'Is this a Core Activity?',
    legal_requirement: 'Is this a Legal Requirement?',
    risks: 'Are there Significant Risks?',
    risk_tolerance: 'Risk Tolerance',
    frequency: 'Frequency',
    specialised_skill: 'Specialized Skills Required',
    similarity_with_scopes: 'Similarity with Current Scopes',
    skill_capacity: 'Existing Skill Capacity',
    duration: 'Duration',
    affordability: 'Affordability',
    strategic_fit: 'Strategic Fit'
  };
  
  const fieldTooltips = {
    activity_name: 'Enter a descriptive name for this activity or service',
    activity_type: 'Specify the type or category of this activity',
    core: 'Core activities are essential to your organization\'s primary mission and competitive advantage',
    legal_requirement: 'Activities required by law, regulation, or contract that cannot be eliminated',
    risks: 'Consider reputational, operational, financial, or compliance risks associated with this activity',
    risk_tolerance: 'Your organization\'s willingness to accept the identified risks',
    frequency: 'How often the activity is performed (Inside = within your organization, Outside = external to your operations)',
    specialised_skill: 'Whether the activity requires specialized expertise or capabilities that are difficult to develop internally',
    similarity_with_scopes: 'How similar this activity is to your organization\'s existing operations and capabilities',
    skill_capacity: 'Whether your organization already has the necessary skills and resources to perform this activity',
    duration: 'The expected timeframe for this activity (Short = temporary or project-based, Long = ongoing or permanent)',
    affordability: 'Whether your organization can afford to develop or maintain this capability internally',
    strategic_fit: 'How well this activity aligns with your organization\'s long-term strategic objectives'
  };
  
  const options = {
    core: ['Yes', 'No'],
    legal_requirement: ['Yes', 'No', ''],
    risks: ['Yes', 'No', ''],
    risk_tolerance: ['Yes', 'No', ''],
    frequency: ['Inside', 'Outside'],
    specialised_skill: ['Yes', 'No', 'High', 'Low'],
    similarity_with_scopes: ['Yes', 'No'],
    skill_capacity: ['Yes', 'No'],
    duration: ['Short', 'Long'],
    affordability: ['Yes', 'No'],
    strategic_fit: ['Yes', 'No']
  };
  
  const handleNext = () => {
    if (currentStep < formSteps.length) {
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
      setCurrentStep(formSteps.length);
    }
  };
  
  const handleSkipToActivity = (index) => {
    setCurrentActivityIndex(index);
    setCurrentStep(1);
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
    <div className="decision-form">
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
      
      <div className="form-body">
        {currentFields.map(field => (
          <div key={field} className="form-group">
            <div className="field-header">
              <label>{fieldLabels[field]}</label>
              <Tooltip content={fieldTooltips[field]} />
            </div>
            
            {field === 'activity_name' || field === 'activity_type' ? (
              <input
                type="text"
                value={currentActivity[field] || ''}
                onChange={(e) => onInputChange(currentActivity.id, field, e.target.value)}
                placeholder={fieldLabels[field]}
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
      
      <FormNavigation 
        currentStep={currentStep}
        totalSteps={formSteps.length}
        onNext={handleNext}
        onBack={handleBack}
        isLastActivity={currentActivityIndex === activities.length - 1}
        onAddActivity={onAddActivity}
        onRemoveActivity={() => onRemoveActivity(currentActivity.id)}
        canRemove={activities.length > 1}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default DecisionForm;