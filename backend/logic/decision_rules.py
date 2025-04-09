from typing import Dict, Any

def determine_outcome(data: Dict[str, Any]) -> str:
    """
    Determine the outcome based on the decision rules from the Excel formula
    
    Args:
        data: Dictionary containing the decision factors
        
    Returns:
        str: The outcome (Eliminate, Current Outsource, New Outsource, or Insource)
    """
    # Extract values from data (with empty string as default)
    # Using the exact column names as referenced in the Excel formula
    core = data.get("core", "")  # J4
    legal_requirement = data.get("legal_requirement", "")  # K4
    risk_tolerance = data.get("risk_tolerance", "")  # L4
    specialised_skill = data.get("specialised_skill", "")  # M4
    frequency = data.get("frequency", "")  # N4
    # Note: O4 seems to be the level of specialized skill (High/Low)
    # For this, we'll use the specialised_skill field which can be "Yes", "No", "High", or "Low"
    similarity_with_scopes = data.get("similarity_with_scopes", "")  # P4
    skill_capacity = data.get("skill_capacity", "")  # Q4
    # R4 might be a different field in the Excel, possibly related to risk
    # For now, we'll interpret it as sensitivity or similar field
    risks = data.get("risks", "")  # R4 (assumption)
    duration = data.get("duration", "")  # S4
    affordability = data.get("affordability", "")  # T4
    strategic_fit = data.get("strategic_fit", "")  # U4
    
    # Now implement the exact logic from the Excel formula
    
    # First layer of conditions: Eliminate
    if core == "No" and risk_tolerance == "No" and specialised_skill == "No":
        return "Eliminate"
    elif core == "Yes" and legal_requirement == "No" and risk_tolerance == "No" and specialised_skill == "No":
        return "Eliminate"
    elif specialised_skill == "Yes" and frequency == "Inside":
        return "Eliminate"
    
    # Second layer: Current or New Outsource with Low specialized skill
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
    
    # Third layer: High specialized skill without similarity
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
    
    # Fourth layer: High specialized skill with similarity, short duration
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
    
    # Fifth layer: High specialized skill with similarity, long duration, missing affordability or strategic fit
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "Yes":
        return "Current Outsource"
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "No":
        return "New Outsource"
    
    # Sixth layer: High specialized skill with similarity and risks
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "Yes":
        return "Current Outsource"
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "No":
        return "New Outsource"
    
    # Seventh layer: Insourcing conditions
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    elif specialised_skill == "Yes" and frequency == "Outside" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and duration == "Long" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    
    # Eighth layer: Core and legal requirements with high specialized skill
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    
    # Ninth layer: Core and legal requirements with low specialized skill
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
    
    # Continue with the rest of the conditions...
    # Core and legal requirements with high specialized skill - no similarity
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
    
    # Core and legal requirements with high specialized skill - with similarity, short duration
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
    
    # Core and legal requirements with high specialized skill - with similarity, long duration, missing affordability or strategic fit
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "Yes":
        return "Current Outsource"
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "No":
        return "New Outsource"
    
    # Core and legal requirements with high specialized skill - with similarity and risks, missing affordability or strategic fit
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "Yes":
        return "Current Outsource"
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "No":
        return "New Outsource"
    
    # Core and legal requirements with high specialized skill - insourcing condition
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and duration == "Long" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    
    # Additional cases from formula
    # Risk conditions with high specialized skill
    elif (legal_requirement == "Yes" or legal_requirement == "No") and risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and strategic_fit == "No" and skill_capacity == "No":
        return "New Outsource"
    elif (legal_requirement == "Yes" or legal_requirement == "No") and risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and strategic_fit == "No" and skill_capacity == "Yes":
        return "Current Outsource"
    
    # Risk conditions with affordability issues
    elif (legal_requirement == "Yes" or legal_requirement == "No") and risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and affordability == "No" and skill_capacity == "No":
        return "New Outsource"
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and affordability == "No" and skill_capacity == "Yes":
        return "Current Outsource"
    
    # Insourcing with risk tolerance
    elif core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    
    # Risk tolerance with low specialized skill
    elif risk_tolerance == "Yes" and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
    elif risk_tolerance == "Yes" and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
    
    # Risk tolerance with high specialized skill - no similarity
    elif risk_tolerance == "Yes" and specialised_skill == "Low" and similarity_with_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
    elif risk_tolerance == "Yes" and specialised_skill == "Low" and similarity_with_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
    
    # Risk tolerance with high specialized skill - with similarity, short duration
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
    
    # Risk tolerance with high specialized skill - with similarity, long duration, missing affordability or strategic fit
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "Yes":
        return "Current Outsource"
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "No":
        return "New Outsource"
    
    # Risk tolerance with high specialized skill - with similarity and risks, missing affordability or strategic fit
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "Yes":
        return "Current Outsource"
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "Yes" and (affordability == "No" or strategic_fit == "No") and skill_capacity == "No":
        return "New Outsource"
    
    # Risk tolerance with high specialized skill - insourcing condition
    elif risk_tolerance == "Yes" and specialised_skill == "High" and similarity_with_scopes == "Yes" and risks == "No" and duration == "Long" and affordability == "Yes" and strategic_fit == "Yes":
        return "Insource or create in-house capacity"
    
    # Default fallback - core and strategic fit
    elif core == "Yes" and strategic_fit == "Yes":
        if skill_capacity == "Yes":
            return "Current Outsource"
        else:
            return "New Outsource"
    
    # Final fallback for any other cases
    return "Requires further analysis"