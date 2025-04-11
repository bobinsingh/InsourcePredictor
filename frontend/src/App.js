import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DecisionForm from './components/DecisionForm';
import ResultsDisplay from './components/ResultsDisplay';
import './styles/styles.css';

// Optimized API call function with reduced timeout and no delays
const makeApiCall = async (url, data, options = {}, retries = 2) => {
  try {
    // Reduced timeout from 10000ms to 5000ms for faster response
    return await axios.post(url, data, { timeout: 5000, ...options });
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status >= 500)) {
      console.log(`Retrying request, ${retries} attempts left`);
      // No delay between retries for faster response
      return makeApiCall(url, data, options, retries - 1);
    }
    throw error;
  }
};

// Use relative path for API - works with Vercel rewrites
const API_BASE_URL = "/api/decision";

function App() {
  const [activities, setActivities] = useState([{
    id: 1,
    activity_name: '',
    activity_type: '',
    business_case: '',
    core: '',
    legal_requirement: '',
    risks: '',
    risk_tolerance: '',
    frequency: '',
    specialised_skill: '',
    similarity_with_current_scopes: '',
    skill_capacity: '',
    duration: '',
    affordability: '',
    strategic_fit: ''
  }]);
  
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [updatingActivityId, setUpdatingActivityId] = useState(null);
  const [activityResults, setActivityResults] = useState({});
  const [activityFormData, setActivityFormData] = useState({});
  const [resultsSource, setResultsSource] = useState('submit');
  const [lastSubmissions, setLastSubmissions] = useState({});
  const [submittedActivityIds, setSubmittedActivityIds] = useState([]);
  
  // Initialize form data once on mount
  useEffect(() => {
    const initialFormData = {};
    activities.forEach(activity => {
      initialFormData[activity.id] = { ...activity };
    });
    setActivityFormData(initialFormData);
  }, []); // Only run once on mount
  
  // Separate effect to update form data when activities change
  useEffect(() => {
    const updatedFormData = {};
    activities.forEach(activity => {
      // Preserve existing form data if it exists
      updatedFormData[activity.id] = activityFormData[activity.id] || { ...activity };
    });
    setActivityFormData(updatedFormData);
  }, [activities]); // Only triggered when activities array changes
  
  const handleAddActivity = useCallback(() => {
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    const newActivity = {
      id: newId,
      activity_name: '',
      activity_type: '',
      business_case: '',
      core: '',
      legal_requirement: '',
      risks: '',
      risk_tolerance: '',
      frequency: '',
      specialised_skill: '',
      similarity_with_current_scopes: '',
      skill_capacity: '',
      duration: '',
      affordability: '',
      strategic_fit: ''
    };
    
    setActivities(prevActivities => [...prevActivities, newActivity]);
    setActivityFormData(prevData => ({
      ...prevData,
      [newId]: { ...newActivity }
    }));
  }, [activities]);
  
  const handleRemoveActivity = useCallback((id) => {
    if (activities.length <= 1) {
      return;
    }
    
    const indexToRemove = activities.findIndex(activity => activity.id === id);
    if (indexToRemove === -1) return;
    
    // Create a new activities array without the removed activity
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    
    // Update form data
    setActivityFormData(prevData => {
      const newData = { ...prevData };
      delete newData[id];
      return newData;
    });
    
    // Update results
    setActivityResults(prevResults => {
      const newResults = { ...prevResults };
      // Remove all results for this activity
      Object.keys(newResults).forEach(key => {
        if (newResults[key].originalActivityId === id) {
          delete newResults[key];
        }
      });
      return newResults;
    });
    
    // Update submitted IDs
    if (submittedActivityIds.includes(id)) {
      setSubmittedActivityIds(prev => prev.filter(actId => actId !== id));
    }
    
    // Adjust current activity index
    let newIndex = currentActivityIndex;
    
    if (indexToRemove === currentActivityIndex) {
      // If we're removing the current activity, go to the previous one
      newIndex = Math.max(0, indexToRemove - 1);
    } else if (indexToRemove < currentActivityIndex) {
      // If we're removing an activity before the current one, decrement
      newIndex = currentActivityIndex - 1;
    }
    
    // Make sure the index is within bounds
    newIndex = Math.min(newIndex, updatedActivities.length - 1);
    setCurrentActivityIndex(newIndex);
    
  }, [activities, currentActivityIndex, submittedActivityIds]);
  
  const handleInputChange = useCallback((id, field, value) => {
    // Update activities array for rendering
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
    
    // Update form data for submission
    setActivityFormData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value
      }
    }));
  }, []);
  
  const checkForMissingFields = useCallback((activityToCheck) => {
    return !activityToCheck.business_case ||
           !activityToCheck.core || 
           !activityToCheck.frequency || 
           !activityToCheck.specialised_skill || 
           !activityToCheck.similarity_with_current_scopes || 
           !activityToCheck.skill_capacity || 
           !activityToCheck.duration || 
           !activityToCheck.affordability;
  }, []);
  
  const prepareRequestData = useCallback((activity) => {
    return {
      inputs: [{
        activity_name: activity.activity_name || 'Unnamed Activity',
        activity_type: activity.activity_type || '',
        business_case: activity.business_case,
        core: activity.core,
        legal_requirement: activity.legal_requirement || '',
        risks: activity.risks || '',
        risk_tolerance: activity.risk_tolerance || '',
        frequency: activity.frequency,
        specialised_skill: activity.specialised_skill,
        similarity_with_current_scopes: activity.similarity_with_current_scopes,
        skill_capacity: activity.skill_capacity,
        duration: activity.duration,
        affordability: activity.affordability,
        strategic_fit: activity.strategic_fit || ''
      }]
    };
  }, []);
  
  const handleSubmit = useCallback(async () => {
    try {
      const currentActivity = activities[currentActivityIndex];
      if (!currentActivity) return;
      
      const hasMissingFields = checkForMissingFields(currentActivity);
      
      if (hasMissingFields) {
        alert('Please fill in all required fields for this activity before submitting.');
        return;
      }
      
      const lastSubmission = lastSubmissions[currentActivity.id];
      const fieldsToCompare = [
        'business_case', 'core', 'legal_requirement', 'risks', 'risk_tolerance',
        'frequency', 'specialised_skill', 'similarity_with_current_scopes',
        'skill_capacity', 'duration', 'affordability', 'strategic_fit'
      ];
      
      let isDuplicate = false;
      
      if (lastSubmission) {
        isDuplicate = fieldsToCompare.every(field => 
          lastSubmission[field] === (currentActivity[field] || '')
        );
      }
      
      if (isDuplicate) {
        const allResults = Object.values(activityResults).map((result, index) => ({
          ...result,
          sequentialNumber: index + 1,
          timestamp: result.timestamp || new Date().toISOString()
        }));
        
        setResultsSource('submit');
        setResults(allResults);
        setShowResults(true);
        return;
      }
      
      setLastSubmissions(prev => ({
        ...prev,
        [currentActivity.id]: { ...currentActivity }
      }));
      
      const requestData = prepareRequestData(currentActivity);
      
      setIsLoading(true);
      
      const response = await makeApiCall(`${API_BASE_URL}/determine`, requestData);
      
      const result = response.data.results[0];
      
      if (!result.timestamp) {
        result.timestamp = new Date().toISOString();
      }
      
      const uniqueKey = `${currentActivity.id}_${Date.now()}`;
      
      setActivityResults(prevResults => ({
        ...prevResults,
        [uniqueKey]: {
          ...result,
          originalActivityId: currentActivity.id
        }
      }));
      
      // Add to submitted activities list
      if (!submittedActivityIds.includes(currentActivity.id)) {
        setSubmittedActivityIds(prev => [...prev, currentActivity.id]);
      }
      
      setResultsSource('submit');
      
      // Calculate all results after state updates
      const updatedResults = {
        ...activityResults,
        [uniqueKey]: {
          ...result,
          originalActivityId: currentActivity.id
        }
      };
      
      const allResults = Object.values(updatedResults).map((resultItem, index) => ({
        ...resultItem,
        sequentialNumber: index + 1,
        timestamp: resultItem.timestamp || new Date().toISOString()
      }));
      
      setResults(allResults);
      setShowResults(true);
      
      if (notification) {
        setNotification(null);
      }
      
      if (updatingActivityId) {
        setUpdatingActivityId(null);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  }, [activities, currentActivityIndex, checkForMissingFields, lastSubmissions, prepareRequestData, activityResults, submittedActivityIds, notification, updatingActivityId]);
  
  const handleViewResults = useCallback(() => {
    const allResults = [];
    
    Object.values(activityResults).forEach((result, index) => {
      allResults.push({
        ...result,
        sequentialNumber: index + 1,
        timestamp: result.timestamp || new Date().toISOString()
      });
    });
    
    if (allResults.length > 0) {
      setResultsSource('viewButton');
      setResults(allResults);
      setShowResults(true);
    } else {
      alert('No results available. Please submit at least one activity first.');
    }
  }, [activityResults]);
  
  // handleEditForm
  const handleEditForm = useCallback((activityId) => {
    const activityToUpdate = activities.find(activity => activity.id === activityId);
    
    if (activityToUpdate) {
      setUpdatingActivityId(activityToUpdate.id);
      
      const activityIndex = activities.findIndex(activity => activity.id === activityToUpdate.id);
      if (activityIndex >= 0) {
        setCurrentActivityIndex(activityIndex);
      }
    } else {
      setUpdatingActivityId(activities[0].id);
      setCurrentActivityIndex(0);
    }
    
    // Updated notification message with clearer instructions
    setNotification({
      type: 'info',
      message: 'You are now in edit mode. Make your changes and click Submit button to save them, or click Cancel Edit to exit edit mode.'
    });
  }, [activities]);
  
  // Clear notification when component unmounts or when notification changes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // CancelEdit
  const handleCancelEdit = useCallback(() => {
    setUpdatingActivityId(null);
    
    setNotification({
      type: 'info',
      message: 'Edit mode canceled. The form has been restored to its previous state.'
    });
  }, []);
  
  const handleBackToForm = useCallback(() => {
    setShowResults(false);
    setResultsSource('submit');
    
    // Find a non-submitted activity if available
    const nonSubmittedActivityIndex = activities.findIndex(activity => 
      !submittedActivityIds.includes(activity.id)
    );
    
    if (nonSubmittedActivityIndex !== -1) {
      // If we have a non-submitted activity, switch to it
      setCurrentActivityIndex(nonSubmittedActivityIndex);
    } else if (activities.length === 1 && submittedActivityIds.includes(activities[0].id)) {
      // If we only have one activity and it's submitted, create a new one
      const newActivity = handleAddActivity();
      // The new activity will become the last one, so set index accordingly
      setCurrentActivityIndex(activities.length); // This will point to the new activity
    }
  }, [activities, submittedActivityIds, handleAddActivity]);
  
  const handleExportExcel = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let blob;
      
      if (Object.keys(activityResults).length === 0) {
        const requestData = {
          inputs: activities.map(activity => ({
            activity_name: activity.activity_name || 'Unnamed Activity',
            activity_type: activity.activity_type || '',
            business_case: activity.business_case,
            core: activity.core,
            legal_requirement: activity.legal_requirement || '',
            risks: activity.risks || '',
            risk_tolerance: activity.risk_tolerance || '',
            frequency: activity.frequency,
            specialised_skill: activity.specialised_skill,
            similarity_with_current_scopes: activity.similarity_with_current_scopes,
            skill_capacity: activity.skill_capacity,
            duration: activity.duration,
            affordability: activity.affordability,
            strategic_fit: activity.strategic_fit || ''
          }))
        };
        
        const response = await makeApiCall(
          `${API_BASE_URL}/export-excel`, 
          requestData, 
          { responseType: 'blob' }
        );
        
        blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
      } else {
        const resultsArray = Object.values(activityResults);
        
        const numberedResults = resultsArray.map((result, index) => ({
          ...result,
          sequentialNumber: index + 1
        }));
        
        const requestData = {
          inputs: numberedResults.map(result => ({
            activity_name: result.activity_name || 'Unnamed Activity',
            activity_type: result.activity_type || '',
            business_case: result.business_case,
            core: result.core,
            legal_requirement: result.legal_requirement || '',
            risks: result.risks || '',
            risk_tolerance: result.risk_tolerance || '',
            frequency: result.frequency,
            specialised_skill: result.specialised_skill,
            similarity_with_current_scopes: result.similarity_with_current_scopes,
            skill_capacity: result.skill_capacity,
            duration: result.duration,
            affordability: result.affordability,
            strategic_fit: result.strategic_fit || '',
            outcome: result.outcome || '',
            timestamp: result.timestamp || new Date().toISOString(),
            sequentialNumber: result.sequentialNumber
          }))
        };
        
        const response = await makeApiCall(
          `${API_BASE_URL}/export-excel`, 
          requestData, 
          { responseType: 'blob' }
        );
        
        blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sourcing_decisions.xlsx');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url); // Clean up
      link.remove();
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('An error occurred while exporting to Excel.');
    } finally {
      setIsLoading(false);
    }
  }, [activities, activityResults]);
  
  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="top-bar-content">
          <h1>EGCA Sourcing Decision Tool</h1>
          <div className="logo-container">
            <img src="/EGCA Light.png" alt="EGCA Logo" className="logo" />
          </div>
        </div>
      </div>
      
      <main className="app-main">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Processing...</p>
          </div>
        )}
        
        {notification && (
          <div className={`notification ${notification.type}`}>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close" 
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        )}
        
        {!showResults ? (
          <div className="form-container">
            <DecisionForm 
              activities={activities}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              updatingActivityId={updatingActivityId}
              currentActivityIndex={currentActivityIndex}
              setCurrentActivityIndex={setCurrentActivityIndex}
              activityResults={activityResults}
              onEditForm={handleEditForm}
              onCancelEdit={handleCancelEdit}
              submittedActivityIds={submittedActivityIds}
              onViewResults={handleViewResults}
              hasResults={Object.keys(activityResults).length > 0}
            />
          </div>
        ) : (
          <ResultsDisplay 
            results={results}
            onBackToForm={handleBackToForm}
            onExportExcel={handleExportExcel}
            showUpdateButton={false}
          />
        )}
      </main>
    </div>
  );
}

export default App;