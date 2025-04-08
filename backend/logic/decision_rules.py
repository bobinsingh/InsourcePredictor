from typing import Dict, Any

def determine_outcome(data: Dict[str, Any]) -> str:
    """
    Determine the outcome based on the decision rules
    
    Args:
        data: Dictionary containing the decision factors
        
    Returns:
        str: The outcome (Eliminate, Current Outsource, New Outsource, or Insource)
    """
    # Extract values from data (with empty string as default)
    core = data.get("core", "")
    legal_requirement = data.get("legal_requirement", "")
    risks = data.get("risks", "")
    risk_tolerance = data.get("risk_tolerance", "")
    frequency = data.get("frequency", "")
    specialised_skill = data.get("specialised_skill", "")
    similarity_with_scopes = data.get("similarity_with_scopes", "")
    skill_capacity = data.get("skill_capacity", "")
    duration = data.get("duration", "")
    affordability = data.get("affordability", "")
    strategic_fit = data.get("strategic_fit", "")
    
    # Eliminate conditions
    if core == "No" and risk_tolerance == "No" and specialised_skill == "No":
        return "Eliminate"
    if core == "Yes" and legal_requirement == "No" and risk_tolerance == "No" and specialised_skill == "No":
        return "Eliminate"
    if specialised_skill == "Yes" and frequency == "Inside":
        return "Eliminate"
    
    # Outsourcing conditions - Low specialized skill
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
    
    # Outsourcing conditions - High specialized skill, no similarity
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
    
    # Outsourcing conditions - High specialized skill, with similarity, short duration
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
    
    # Outsourcing conditions - Long duration, missing strategic fit or affordability
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
    
    # Core activity conditions with legal requirements
    if core == "Yes" and legal_requirement == "Yes":
        # For low specialized skill
        if specialised_skill == "Low" and skill_capacity == "Yes":
            return "Current Outsource"
        if specialised_skill == "Low" and skill_capacity == "No":
            return "New Outsource"
            
        # For high specialized skill
        if specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "Yes":
            return "Current Outsource"
        if specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "No":
            return "New Outsource"
            
        # Short duration
        if specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Short" and skill_capacity == "Yes":
            return "Current Outsource"
        if specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Short" and skill_capacity == "No":
            return "New Outsource"
            
        # Long duration, missing strategic fit or affordability
        if specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
            return "Current Outsource"
        if specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
            return "New Outsource"
            
        # All conditions met for insourcing
        if specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
            return "Insource or create in-house capacity"
    
    # Risk conditions
    if risks == "Yes":
        # For low specialized skill
        if specialised_skill == "Low" and skill_capacity == "Yes":
            return "Current Outsource"
        if specialised_skill == "Low" and skill_capacity == "No":
            return "New Outsource"
            
        # Various conditions for high specialized skill
        if specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
            return "Insource or create in-house capacity"
    
    # Insourcing - all conditions met
    if specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
    
    # Default fallback - if no specific condition met but we have core and strategic fit
    if core == "Yes" and strategic_fit == "Yes":
        if skill_capacity == "Yes":
            return "Current Outsource"
        else:
            return "New Outsource"
            
    # Final fallback
    return "Requires further analysis"