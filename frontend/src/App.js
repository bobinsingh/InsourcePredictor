import React, { useState } from 'react';
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
    core: '',
    legal_requirement: '',
    risks: '',
    risk_tolerance: '',
    frequency: '',
    specialised_skill: '',
    similarity_with_scopes: '',
    skill_capacity: '',
    duration: '',
    affordability: '',
    strategic_fit: ''
  }]);
  
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleAddActivity = () => {
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    setActivities([...activities, {
      id: newId,
      activity_name: '',
      activity_type: '',
      core: '',
      legal_requirement: '',
      risks: '',
      risk_tolerance: '',
      frequency: '',
      specialised_skill: '',
      similarity_with_scopes: '',
      skill_capacity: '',
      duration: '',
      affordability: '',
      strategic_fit: ''
    }]);
  };
  
  const handleRemoveActivity = (id) => {
    if (activities.length > 1) {
      setActivities(activities.filter(activity => activity.id !== id));
    }
  };
  
  const handleInputChange = (id, field, value) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
  };
  
  const handleSubmit = async () => {
    try {
      // Validate all required fields are filled
      const missingFields = activities.some(activity => 
        !activity.core || 
        !activity.frequency || 
        !activity.specialised_skill || 
        !activity.similarity_with_scopes || 
        !activity.skill_capacity || 
        !activity.duration || 
        !activity.affordability || 
        !activity.strategic_fit
      );
      
      if (missingFields) {
        alert('Please fill in all required fields for each activity before submitting.');
        return;
      }
      
      const requestData = {
        inputs: activities.map(activity => ({
          activity_name: activity.activity_name || 'Unnamed Activity',
          activity_type: activity.activity_type || '',
          core: activity.core,
          legal_requirement: activity.legal_requirement || '',
          risks: activity.risks || '',
          risk_tolerance: activity.risk_tolerance || '',
          frequency: activity.frequency,
          specialised_skill: activity.specialised_skill,
          similarity_with_scopes: activity.similarity_with_scopes,
          skill_capacity: activity.skill_capacity,
          duration: activity.duration,
          affordability: activity.affordability,
          strategic_fit: activity.strategic_fit
        }))
      };
      
      const response = await axios.post(`${API_BASE_URL}/determine`, requestData);
      setResults(response.data.results);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An error occurred while processing your request.');
    }
  };
  
  const handleBackToForm = () => {
    setShowResults(false);
  };
  
  const handleExportExcel = async () => {
    try {
      const requestData = {
        inputs: activities.map(activity => ({
          activity_name: activity.activity_name || 'Unnamed Activity',
          activity_type: activity.activity_type || '',
          core: activity.core,
          legal_requirement: activity.legal_requirement || '',
          risks: activity.risks || '',
          risk_tolerance: activity.risk_tolerance || '',
          frequency: activity.frequency,
          specialised_skill: activity.specialised_skill,
          similarity_with_scopes: activity.similarity_with_scopes,
          skill_capacity: activity.skill_capacity,
          duration: activity.duration,
          affordability: activity.affordability,
          strategic_fit: activity.strategic_fit
        }))
      };
      
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
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sourcing Decision Tool</h1>
        <p>Determine optimal sourcing strategies based on multiple factors</p>
      </header>
      
      <main className="app-main">
        {!showResults ? (
          <DecisionForm 
            activities={activities}
            onAddActivity={handleAddActivity}
            onRemoveActivity={handleRemoveActivity}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <ResultsDisplay 
            results={results}
            onBackToForm={handleBackToForm}
            onExportExcel={handleExportExcel}
          />
        )}
      </main>
    </div>
  );
}

export default App;