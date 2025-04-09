import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DecisionForm from './components/DecisionForm';
import ResultsDisplay from './components/ResultsDisplay';
import './styles/styles.css';

const API_BASE_URL = 'http://localhost:8000/api/decision';

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
  // Added state to track if there are results available
  const [hasResults, setHasResults] = useState(false);
  // Track which specific activity is being updated
  const [updatingActivityId, setUpdatingActivityId] = useState(null);
  // Add state for last submitted data to avoid reprocessing identical submissions
  const [lastSubmittedData, setLastSubmittedData] = useState(null);
  
  // Load stored data when the app initializes
  useEffect(() => {
    const storedResults = localStorage.getItem('egcaResults');
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
        setHasResults(true);
      } catch (error) {
        console.error('Error parsing stored results:', error);
      }
    }
  }, []);
  
  const handleAddActivity = () => {
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    setActivities([...activities, {
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
    }]);
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
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
  };
  
  const checkForMissingFields = () => {
    return activities.some(activity => 
      !activity.business_case ||
      !activity.core || 
      !activity.frequency || 
      !activity.specialised_skill || 
      !activity.similarity_with_current_scopes || 
      !activity.skill_capacity || 
      !activity.duration || 
      !activity.affordability
    );
  };
  
  const prepareRequestData = () => {
    return {
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
  };
  
  // Function to check if the current data is identical to the last submitted data
  const isIdenticalToLastSubmission = (requestData) => {
    if (!lastSubmittedData) return false;
    
    // Deep comparison of the request data objects
    try {
      return JSON.stringify(requestData) === JSON.stringify(lastSubmittedData);
    } catch (error) {
      console.error('Error comparing submissions:', error);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Check for missing required fields
      const hasMissingFields = checkForMissingFields();
      
      if (hasMissingFields) {
        alert('Please fill in all required fields for each activity before submitting.');
        return;
      }
      
      // Prepare request data
      const requestData = prepareRequestData();
      
      // Skip API call if the data hasn't changed
      if (isIdenticalToLastSubmission(requestData)) {
        console.log('Data unchanged, using cached results');
        setShowResults(true);
        
        // Clear any notification
        if (notification) {
          setNotification(null);
        }
        
        // Clear updating activity ID
        if (updatingActivityId) {
          setUpdatingActivityId(null);
        }
        
        return;
      }
      
      setIsLoading(true);
      
      // Call API
      const response = await axios.post(`${API_BASE_URL}/determine`, requestData);
      
      // Set results and show results page
      setResults(response.data.results);
      setShowResults(true);
      setHasResults(true);
      
      // Store the results in localStorage
      localStorage.setItem('egcaResults', JSON.stringify(response.data.results));
      
      // Save the submitted data to avoid reprocessing
      setLastSubmittedData(requestData);
      
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
  
  const handleUpdateOutcomes = async () => {
    // Find the first activity in the results to update
    if (results && results.length > 0) {
      const activityToUpdate = results[0];
      const activityName = activityToUpdate.activity_name;
      
      // Find the matching activity in our current activities array
      const matchingActivityIndex = activities.findIndex(
        activity => activity.activity_name === activityName
      );
      
      // If found, set this activity as the one being updated
      if (matchingActivityIndex >= 0) {
        setUpdatingActivityId(activities[matchingActivityIndex].id);
      } else {
        // If not found, use the first activity's ID
        setUpdatingActivityId(activities[0].id);
      }
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
  };
  
  const handleViewResults = () => {
    setShowResults(true);
  };
  
  const handleExportExcel = async () => {
    try {
      setIsLoading(true);
      const requestData = prepareRequestData();
      
      const response = await axios.post(
        `${API_BASE_URL}/export-excel`, 
        requestData, 
        { responseType: 'blob' }
      );
      
      // Create a Blob from the response data
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
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
            {hasResults && (
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
            onUpdateOutcomes={handleUpdateOutcomes}
          />
        )}
      </main>
    </div>
  );
}

export default App;