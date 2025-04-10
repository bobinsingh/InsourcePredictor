import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DecisionForm from './components/DecisionForm';
import ResultsDisplay from './components/ResultsDisplay';
import './styles/styles.css';

// Updated utility function that accepts additional axios options
const makeApiCall = async (url, data, options = {}, retries = 3) => {
  try {
    return await axios.post(url, data, { timeout: 10000, ...options });
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status >= 500)) {
      console.log(`Retrying request, ${retries} attempts left`);
      await new Promise(r => setTimeout(r, 1000));
      return makeApiCall(url, data, options, retries - 1);
    }
    throw error;
  }
};

const API_BASE_URL = process.env.REACT_APP_API_URL

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
  
  // Add state for current activity index to pass to the form
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  
  // Store all results
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Added state for notification
  const [notification, setNotification] = useState(null);
  // Track which specific activity is being updated
  const [updatingActivityId, setUpdatingActivityId] = useState(null);
  // Store results for each activity separately to show individual results
  const [activityResults, setActivityResults] = useState({});
  // Track activity form data to persist when switching between tabs
  const [activityFormData, setActivityFormData] = useState({});
  // Track results source
  const [resultsSource, setResultsSource] = useState('submit'); // 'submit' or 'viewButton'
  // Store last submission data for comparison
  const [lastSubmissions, setLastSubmissions] = useState({});
  
  // Save form data when switching between activity tabs
  useEffect(() => {
    // When activities change or when component mounts, initialize form data
    const initialFormData = {};
    activities.forEach(activity => {
      initialFormData[activity.id] = { ...activity };
    });
    setActivityFormData(prevData => ({ ...prevData, ...initialFormData }));
  }, [activities]);
  
  const handleAddActivity = () => {
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
    
    setActivities([...activities, newActivity]);
    
    // Initialize form data for the new activity
    setActivityFormData(prevData => ({
      ...prevData,
      [newId]: { ...newActivity }
    }));
  };
  
  const handleRemoveActivity = (id) => {
    // Always ensure we have at least one activity
    if (activities.length <= 1) {
      return; // Don't remove if this is the last activity
    }
    
    // Find the index of the activity to be removed
    const indexToRemove = activities.findIndex(activity => activity.id === id);
    if (indexToRemove === -1) return; // Activity not found
    
    // Create a new array without the removed activity
    const updatedActivities = activities.filter(activity => activity.id !== id);
    
    // Update the activities state
    setActivities(updatedActivities);
    
    // Remove form data for this activity
    const updatedFormData = { ...activityFormData };
    delete updatedFormData[id];
    setActivityFormData(updatedFormData);
    
    // Remove results for this activity
    const updatedResults = { ...activityResults };
    delete updatedResults[id];
    setActivityResults(updatedResults);
    
    // If the removed activity was the current one, adjust the current index
    if (indexToRemove === currentActivityIndex) {
      // If removing the last activity, move to the previous one
      if (indexToRemove >= updatedActivities.length) {
        setCurrentActivityIndex(updatedActivities.length - 1);
      }
      // Otherwise stay at the same index (which will now point to the next activity)
    } else if (indexToRemove < currentActivityIndex) {
      // If removing an activity before the current one, adjust the index down
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };
  
  const handleInputChange = (id, field, value) => {
    // Update both the activities array and the form data store
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
    
    // Update form data for this particular activity
    setActivityFormData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value
      }
    }));
  };
  
  const checkForMissingFields = (activityToCheck) => {
    return !activityToCheck.business_case ||
           !activityToCheck.core || 
           !activityToCheck.frequency || 
           !activityToCheck.specialised_skill || 
           !activityToCheck.similarity_with_current_scopes || 
           !activityToCheck.skill_capacity || 
           !activityToCheck.duration || 
           !activityToCheck.affordability;
  };
  
  const prepareRequestData = (activity) => {
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
  };
  
  const handleSubmit = async () => {
    try {
      // Get the current activity
      const currentActivity = activities[currentActivityIndex];
      if (!currentActivity) return;
      
      // Check for missing required fields
      const hasMissingFields = checkForMissingFields(currentActivity);
      
      if (hasMissingFields) {
        alert('Please fill in all required fields for this activity before submitting.');
        return;
      }
      
      // Simple approach to detect duplicates - compare with last submission
      const lastSubmission = lastSubmissions[currentActivity.id];
      const fieldsToCompare = [
        'business_case', 'core', 'legal_requirement', 'risks', 'risk_tolerance',
        'frequency', 'specialised_skill', 'similarity_with_current_scopes',
        'skill_capacity', 'duration', 'affordability', 'strategic_fit'
      ];
      
      let isDuplicate = false;
      
      if (lastSubmission) {
        // Check if all fields match the last submission
        isDuplicate = fieldsToCompare.every(field => 
          lastSubmission[field] === (currentActivity[field] || '')
        );
      }
      
      // If it's a duplicate, just show existing results without creating a new entry
      if (isDuplicate) {
        // Just display all existing results
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
      
      // Store current form data as last submission
      setLastSubmissions(prev => ({
        ...prev,
        [currentActivity.id]: { ...currentActivity }
      }));
      
      // Prepare request data for this activity
      const requestData = prepareRequestData(currentActivity);
      
      setIsLoading(true);
      
      // Call API with retry logic
      const response = await makeApiCall(`${API_BASE_URL}/determine`, requestData);
      
      // Store the result for this specific activity with a unique key and timestamp
      const result = response.data.results[0];
      
      // Add timestamp if not already present
      if (!result.timestamp) {
        result.timestamp = new Date().toISOString();
      }
      
      // Generate a unique key for this result
      // Instead of using activity.id as the key, use a unique key for each submission
      // This ensures updates are treated as new entries rather than replacing existing ones
      const uniqueKey = `${currentActivity.id}_${Date.now()}`;
      
      // Create a new activity results object with the new result
      const updatedResults = {
        ...activityResults,
        [uniqueKey]: {
          ...result,
          originalActivityId: currentActivity.id // Store original activity ID for reference
        }
      };
      
      // Update the activity results store
      setActivityResults(updatedResults);
      
      // Collect all results to display them together
      const allResults = Object.values(updatedResults).map((resultItem, index) => ({
        ...resultItem,
        sequentialNumber: index + 1,
        timestamp: resultItem.timestamp || new Date().toISOString()
      }));
      
      // Set all results and show results page
      setResultsSource('submit'); // Set source as submission
      setResults(allResults);
      setShowResults(true);
      
      // Clear any notification
      if (notification) {
        setNotification(null);
      }
      
      // Clear updating activity ID
      if (updatingActivityId) {
        setUpdatingActivityId(null);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewResults = () => {
    // Collect all available results for all activities
    const allResults = [];
    
    // Add a sequential number and ensure timestamp exists for each result
    Object.values(activityResults).forEach((result, index) => {
      allResults.push({
        ...result,
        sequentialNumber: index + 1,
        timestamp: result.timestamp || new Date().toISOString()
      });
    });
    
    if (allResults.length > 0) {
      setResultsSource('viewButton'); // Set source as view button
      setResults(allResults);
      setShowResults(true);
    } else {
      alert('No results available. Please submit at least one activity first.');
    }
  };
  
  const handleUpdateOutcomes = (activityId) => {
    // Find the activity to update based on the ID passed from ResultsDisplay
    const activityToUpdate = activities.find(activity => activity.id === activityId);
    
    if (activityToUpdate) {
      // Set the updating ID and find the index to navigate to
      setUpdatingActivityId(activityToUpdate.id);
      
      // Find and set the activity index
      const activityIndex = activities.findIndex(activity => activity.id === activityToUpdate.id);
      if (activityIndex >= 0) {
        setCurrentActivityIndex(activityIndex);
      }
    } else {
      // Fallback to first activity
      setUpdatingActivityId(activities[0].id);
      setCurrentActivityIndex(0);
    }
    
    setShowResults(false);
    setNotification({
      type: 'info',
      message: 'Make your changes to the form and click Submit to update the results.'
    });
    
    // Set a timeout to clear the notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  
  const handleBackToForm = () => {
    setShowResults(false);
    // Reset results source when going back to form
    setResultsSource('submit');
  };
  
  const handleExportExcel = async () => {
    try {
      setIsLoading(true);
      
      let blob;
      
      // Prepare data for export based on whether we have results
      if (Object.keys(activityResults).length === 0) {
        // If no results, export form data for all activities
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
        
        // Use makeApiCall with retry logic and responseType option
        const response = await makeApiCall(
          `${API_BASE_URL}/export-excel`, 
          requestData, 
          { responseType: 'blob' }
        );
        
        blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
      } else {
        // If we have results, export those instead
        const resultsArray = Object.values(activityResults);
        
        // Add sequential numbers to each result
        const numberedResults = resultsArray.map((result, index) => ({
          ...result,
          sequentialNumber: index + 1
        }));
        
        // Convert to the format expected by the backend
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
        
        // Use makeApiCall with retry logic and responseType option
        const response = await makeApiCall(
          `${API_BASE_URL}/export-excel`, 
          requestData, 
          { responseType: 'blob' }
        );
        
        blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
      }
      
      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sourcing_decisions.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('An error occurred while exporting to Excel.');
    } finally {
      setIsLoading(false);
    }
  };
  
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
            {Object.keys(activityResults).length > 0 && (
              <div className="button-container">
                <button 
                  className="action-button view-results" 
                  onClick={handleViewResults}
                >
                  View Results
                </button>
              </div>
            )}
            
            <DecisionForm 
              activities={activities}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              updatingActivityId={updatingActivityId}
              currentActivityIndex={currentActivityIndex}
              setCurrentActivityIndex={setCurrentActivityIndex}
            />
          </div>
        ) : (
          <ResultsDisplay 
            results={results}
            onBackToForm={handleBackToForm}
            onExportExcel={handleExportExcel}
            showUpdateButton={resultsSource === 'submit'} // Only show update button if from submit
            onUpdateOutcomes={() => {
              // Get the ID of the current activity shown in results
              if (results && results.length > 0) {
                const activityName = results[0].activity_name;
                const activityToUpdate = activities.find(activity => 
                  activity.activity_name === activityName);
                
                if (activityToUpdate) {
                  handleUpdateOutcomes(activityToUpdate.id);
                } else {
                  handleUpdateOutcomes(activities[currentActivityIndex].id);
                }
              }
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;