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
    frequency = "Yes" if frequency == "High" else "No"
    # Frontend uses "Yes"/"No" for specialised_skill, but Excel logic uses "High"/"Low"
    specialised_skill = "High" if specialised_skill == "Yes" else "Low"
    
    # Decision logic based on Excel formula
    
    # Special cases
    if business_case == "Yes" and core == "No" and legal_requirement == "No" and risks == "Yes" and risk_tolerance == "Outside" and frequency == "Yes" and specialised_skill == "Low" and similarity_with_current_scopes == "Yes" and skill_capacity == "Yes" and duration == "Long" and affordability == "Yes" and strategic_fit == "Yes":
        return "Current Outsource"
    
    # Eliminate conditions
    if business_case == "No" and (legal_requirement == "No" or legal_requirement == "") and frequency == "No":
        return "Eliminate"
    
    if business_case == "Yes" and core == "No" and (legal_requirement == "No" or legal_requirement == "") and frequency == "No":
        return "Eliminate"
    
    # Additional eliminate condition - corporate level activities that are not core
    if business_case == "Yes" and core == "No" and (legal_requirement == "No" or legal_requirement == ""):
        return "Eliminate"
    
    if frequency == "Yes" and risk_tolerance == "Inside":
        return "Eliminate"
    
    # Current Outsource and New Outsource conditions
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "Low" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "Low" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    # Insource or create in-house capacity conditions
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if core == "Yes" and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    # More conditions from the Excel formula
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
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
        
    # Additional conditions from Excel formula
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or strategic_fit == "") and skill_capacity == "No":
        return "New Outsource"
        
    if (core == "Yes" or core == "No") and legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and (strategic_fit == "No" or strategic_fit == "") and skill_capacity == "Yes":
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
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "Yes":
        return "Current Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and skill_capacity == "No":
        return "New Outsource"
        
    if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "Yes" and (risks == "No" or risks == "") and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
        return "Insource or create in-house capacity"
    
    # More focused fallback logic that preserves the intent of the decision tree
    # Rather than having a generic default, we use priority-based classification
    
    # Step 1: Check if this should be eliminated
    if (frequency == "No" and (legal_requirement == "No" or legal_requirement == "")) or risk_tolerance == "Inside" or (core == "No" and (legal_requirement == "No" or legal_requirement == "")):
        return "Eliminate"
        
    # Step 2: Check criteria for insourcing
    if (specialised_skill == "High" and similarity_with_current_scopes == "Yes" and 
        strategic_fit == "Yes" and affordability == "Yes" and 
        (core == "Yes" or legal_requirement == "Yes")):
        return "Insource or create in-house capacity"
        
    # Step 3: Check Current Outsource conditions - MUST match Excel formula exactly
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "Low" and skill_capacity == "Yes"):
        return "Current Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "No" and 
        skill_capacity == "Yes"):
        return "Current Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "Yes" and 
        (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "Yes"):
        return "Current Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "Yes" and 
        (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and 
        skill_capacity == "Yes"):
        return "Current Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "Yes" and 
        risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and 
        skill_capacity == "Yes"):
        return "Current Outsource"
        
    # Step 4: Check New Outsource conditions - MUST match Excel formula exactly
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "Low" and skill_capacity == "No"):
        return "New Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "No" and 
        skill_capacity == "No"):
        return "New Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "Yes" and 
        (risks == "No" or risks == "") and duration == "Short" and skill_capacity == "No"):
        return "New Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "Yes" and 
        (risks == "No" or risks == "") and duration == "Long" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and 
        skill_capacity == "No"):
        return "New Outsource"
        
    if (frequency == "Yes" and (risk_tolerance == "Outside" or risk_tolerance == "") and 
        specialised_skill == "High" and similarity_with_current_scopes == "Yes" and 
        risks == "Yes" and ((strategic_fit == "No" or strategic_fit == "") or affordability == "No") and 
        skill_capacity == "No"):
        return "New Outsource"
        
    # Final fallback - prefer Current Outsource if we reach here and have skill capacity
    if skill_capacity == "Yes":
        return "Current Outsource"
    else:
        # Complete Edge Cases - Additional New Outsource cases from Excel formula
        if legal_requirement == "Yes" and specialised_skill == "Low" and skill_capacity == "No":
            return "New Outsource"
        if legal_requirement == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
            return "New Outsource"
        if business_case == "Yes" and core == "Yes" and specialised_skill == "Low" and skill_capacity == "No":
            return "New Outsource"
        if business_case == "Yes" and core == "Yes" and specialised_skill == "High" and similarity_with_current_scopes == "No" and skill_capacity == "No":
            return "New Outsource"
        
        return "Requires Further Analysis"