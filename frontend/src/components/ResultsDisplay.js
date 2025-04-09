import React, { useState, useRef } from 'react';
import DataTable from './DataTable';

const ResultsDisplay = ({ results, onBackToForm, onExportExcel, onUpdateOutcomes }) => {
  const fileInputRef = useRef(null);
  
  // Group results by outcome
  const groupResultsByOutcome = (resultsData) => {
    if (!Array.isArray(resultsData)) return {};
    
    return resultsData.reduce((acc, result) => {
      const outcome = result.outcome;
      if (!acc[outcome]) {
        acc[outcome] = [];
      }
      acc[outcome].push(result);
      return acc;
    }, {});
  };
  
  // Create columns for the data table
  const columns = [
    { name: 'Activity Name', selector: row => row.activity_name, sortable: true },
    { name: 'Activity Type', selector: row => row.activity_type, sortable: true },
    { name: 'Business case', selector: row => row.business_case, sortable: true },
    { name: 'Core', selector: row => row.core, sortable: true },
    { name: 'Legal requirement', selector: row => row.legal_requirement, sortable: true },
    { name: 'Risks', selector: row => row.risks, sortable: true },
    { name: 'Risk tolerance', selector: row => row.risk_tolerance, sortable: true },
    { name: 'Frequency', selector: row => row.frequency, sortable: true },
    { name: 'Specialised Skill', selector: row => row.specialised_skill, sortable: true },
    { name: 'Similarity with current scopes', selector: row => row.similarity_with_current_scopes, sortable: true },
    { name: 'Skill capacity', selector: row => row.skill_capacity, sortable: true },
    { name: 'Duration', selector: row => row.duration, sortable: true },
    { name: 'Affordability & Transferable Skill', selector: row => row.affordability, sortable: true },
    { name: 'Strategic fit and Business case', selector: row => row.strategic_fit, sortable: true },
    { name: 'Outcome', selector: row => row.outcome, sortable: true }
  ];

  // Helper function to get the CSS class for each outcome type
  const getOutcomeClass = (outcome) => {
    if (!outcome) return '';
    const normalized = outcome.toLowerCase().replace(/\s+/g, '-');
    return normalized;
  };
  
  // Helper function to get description for each outcome
  const getOutcomeDescription = (outcome) => {
    switch(outcome) {
      case 'Eliminate':
        return 'This activity should be discontinued';
      case 'Current Outsource':
        return 'Continue with existing outsourcing arrangement';
      case 'New Outsource':
        return 'Find a new outsourcing partner for this activity';
      case 'Insource or create in-house capacity':
        return 'Bring this activity in-house or develop internal capacity';
      case 'Requires Further Analysis':
        return 'Additional information or analysis is needed to make a decision';
      default:
        return 'Further analysis required';
    }
  };
  
  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      onExportExcel(event.target.files[0]);
    }
  };
  
  const handleUpdateExistingFile = () => {
    fileInputRef.current.click();
  };
  
  // Ensure results is an array, even if empty
  const safeResults = Array.isArray(results) ? results : [];
  const resultsByOutcome = groupResultsByOutcome(safeResults);
  
  return (
    <div className="results-display">
      <div className="results-header">
        <h2>Decision Results</h2>
      </div>
      
      <div className="results-summary">
        {Object.entries(resultsByOutcome).map(([outcome, items]) => (
          <div key={outcome} className={`outcome-card ${getOutcomeClass(outcome)}`}>
            <h3>{outcome}</h3>
            <p>{getOutcomeDescription(outcome)}</p>
            <p>{items.length} {items.length === 1 ? 'Activity' : 'Activities'}</p>
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item.activity_name || `Unnamed Activity ${index + 1}`}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="results-table">
        <h3>Detailed Results</h3>
        <DataTable 
          columns={columns}
          data={safeResults}
        />
      </div>
      
      <div className="results-actions">
        <div className="action-group-left">
          <button 
            type="button" 
            className="action-button back"
            onClick={onBackToForm}
          >
            Back to Form
          </button>
          
          <button 
            type="button" 
            className="action-button update"
            onClick={onUpdateOutcomes}
          >
            Update Outcomes
          </button>
        </div>
        
        <div className="action-group-right">
          <button 
            type="button" 
            className="action-button export"
            onClick={() => onExportExcel()}
          >
            Export to Excel
          </button>
          
          <button 
            type="button" 
            className="action-button update-excel"
            onClick={handleUpdateExistingFile}
          >
            Update Existing Excel
          </button>
          
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            accept=".xlsx" 
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;