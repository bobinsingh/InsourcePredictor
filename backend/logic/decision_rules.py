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
    
    # Convert frontend values to Excel formula values if needed
    # Frontend uses "High"/"Low" for frequency, but Excel logic uses "Yes"/"No"
    frequency_excel = "Yes" if frequency == "High" else "No"
    # Frontend uses "Yes"/"No" for specialised_skill, but Excel logic uses "High"/"Low"
    specialised_skill_excel = "High" if specialised_skill == "Yes" else "Low"
    
    # Decision logic based on Excel formula
    
    # Eliminate conditions
    if business_case == "No" and legal_requirement == "No" and frequency_excel == "No":
        return "Eliminate"
    
    if business_case == "Yes" and core == "No" and legal_requirement == "No" and frequency_excel == "No":
        return "Eliminate"
    
    if frequency_excel == "Yes" and risk_tolerance == "Inside":
        return "Eliminate"
    
    # Current Outsource and New Outsource conditions
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "Low" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    # Insource or create in-house capacity conditions
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if frequency_excel == "Yes" and risk_tolerance == "Outside" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if core == "Yes" and legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    # More conditions from the Excel formula
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "Low" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    # Additional conditions from Excel formula
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and affordability == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if core == "Yes" and legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and affordability == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "Low" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "Low" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill_excel == "High" and similarity_with_current_scopes == "Yes" and risks == "No" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
    
    # Default case if no condition is matched
    return "Requires Further Analysis"