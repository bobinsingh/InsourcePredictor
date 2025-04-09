from typing import Dict, Any

def determine_outcome(data: Dict[str, Any]) -> str:
    """
    Determine the outcome based on the decision rules from the Excel model
    
    Args:
        data: Dictionary containing the decision factors
        
    Returns:
        str: The outcome (Eliminate, Current Outsource, New Outsource, Insource or create in-house capacity, or Requires Further Analysis)
    """
    # Extract values from data (with empty string as default)
    business_case = data.get("business_case", "")
    core = data.get("core", "")
    legal_requirement = data.get("legal_requirement", "")
    risks = data.get("risks", "")
    risk_tolerance = data.get("risk_tolerance", "")
    frequency = data.get("frequency", "")
    specialised_skill = data.get("specialised_skill", "")
    similarity_with_current_scopes = data.get("similarity_with_current_scopes", "")
    skill_capacity = data.get("skill_capacity", "")
    duration = data.get("duration", "")
    affordability = data.get("affordability", "")
    strategic_fit = data.get("strategic_fit", "")
    
    # Decision logic following the Excel formula
    
    # Eliminate conditions
    if core == "No" and risk_tolerance == "No" and frequency == "No":
        return "Eliminate"
    
    if business_case == "Yes" and core == "No" and risk_tolerance == "No" and frequency == "No":
        return "Eliminate"
    
    if frequency == "Yes" and risk_tolerance == "Inside":
        return "Eliminate"
    
    # Current Outsource conditions
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    # Insource or create in-house capacity conditions
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if frequency == "Yes" and risk_tolerance == "Outside" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    # More conditions from the formula
    if business_case == "Yes" and core == "Yes" and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    # Additional conditions
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and affordability == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and affordability == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if legal_requirement == "Yes" and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
    
    # Default case if no condition is matched
    return "Requires Further Analysis"