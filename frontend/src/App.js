import React, { useState, useEffect } from 'react';
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
  
  useEffect(() => {
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
    
    setActivityFormData(prevData => ({
      ...prevData,
      [newId]: { ...newActivity }
    }));
  };
  
  const handleRemoveActivity = (id) => {
    if (activities.length <= 1) {
      return;
    }
    
    const indexToRemove = activities.findIndex(activity => activity.id === id);
    if (indexToRemove === -1) return;
    
    const updatedActivities = activities.filter(activity => activity.id !== id);
    
    setActivities(updatedActivities);
    
    const updatedFormData = { ...activityFormData };
    delete updatedFormData[id];
    setActivityFormData(updatedFormData);
    
    const updatedResults = { ...activityResults };
    delete updatedResults[id];
    setActivityResults(updatedResults);
    
    if (indexToRemove === currentActivityIndex) {
      if (indexToRemove >= updatedActivities.length) {
        setCurrentActivityIndex(updatedActivities.length - 1);
      }
    } else if (indexToRemove < currentActivityIndex) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };
  
  const handleInputChange = (id, field, value) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
    
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
      
      const updatedResults = {
        ...activityResults,
        [uniqueKey]: {
          ...result,
          originalActivityId: currentActivity.id
        }
      };
      
      setActivityResults(updatedResults);
      
      const allResults = Object.values(updatedResults).map((resultItem, index) => ({
        ...resultItem,
        sequentialNumber: index + 1,
        timestamp: resultItem.timestamp || new Date().toISOString()
      }));
      
      setResultsSource('submit');
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
  };
  
  const handleViewResults = () => {
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
  };
  
  const handleUpdateOutcomes = (activityId) => {
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
    
    setShowResults(false);
    setNotification({
      type: 'info',
      message: 'Make your changes to the form and click Submit to update the results.'
    });
    
    // Reduced notification timeout from 5000ms to 3000ms
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleBackToForm = () => {
    setShowResults(false);
    setResultsSource('submit');
  };
  
  const handleExportExcel = async () => {
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
            showUpdateButton={resultsSource === 'submit'}
            onUpdateOutcomes={() => {
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