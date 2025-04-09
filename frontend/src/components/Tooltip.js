import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({ content }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="tooltip-container">
      <button 
        className="tooltip-button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Information"
      >
        ?
      </button>
      
      {showTooltip && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;