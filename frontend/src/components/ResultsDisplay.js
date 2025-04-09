import React from 'react';
import DataTable from './DataTable';

const ResultsDisplay = ({ results, onBackToForm, onExportExcel }) => {
  // Group results by outcome
  const resultsByOutcome = results.reduce((acc, result) => {
    const outcome = result.outcome;
    if (!acc[outcome]) {
      acc[outcome] = [];
    }
    acc[outcome].push(result);
    return acc;
  }, {});
  
  // Create columns for the data table
  const columns = [
    { name: 'Activity Name', selector: row => row.activity_name, sortable: true },
    { name: 'Activity Type', selector: row => row.activity_type, sortable: true },
    { name: 'Core', selector: row => row.core, sortable: true },
    { name: 'Legal Requirement', selector: row => row.legal_requirement, sortable: true },
    { name: 'Risks', selector: row => row.risks, sortable: true },
    { name: 'Risk Tolerance', selector: row => row.risk_tolerance, sortable: true },
    { name: 'Frequency', selector: row => row.frequency, sortable: true },
    { name: 'Specialized Skill', selector: row => row.specialised_skill, sortable: true },
    { name: 'Similarity with Scopes', selector: row => row.similarity_with_scopes, sortable: true },
    { name: 'Skill Capacity', selector: row => row.skill_capacity, sortable: true },
    { name: 'Duration', selector: row => row.duration, sortable: true },
    { name: 'Affordability', selector: row => row.affordability, sortable: true },
    { name: 'Strategic Fit', selector: row => row.strategic_fit, sortable: true },
    { name: 'Outcome', selector: row => row.outcome, sortable: true }
  ];

  // Helper function to get the CSS class for each outcome type
  const getOutcomeClass = (outcome) => {
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
      default:
        return 'Further analysis required';
    }
  };
  
  return (
    <div className="results-display">
      <h2>Decision Results</h2>
      
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
          data={results}
        />
      </div>
      
      <div className="results-actions">
        <button 
          type="button" 
          className="action-button back"
          onClick={onBackToForm}
        >
          Back to Form
        </button>
        
        <button 
          type="button" 
          className="action-button export"
          onClick={onExportExcel}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;