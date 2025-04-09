import React, { useState } from 'react';

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
        i
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