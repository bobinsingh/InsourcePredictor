from typing import Dict, Any

def determine_outcome(data: Dict[str, Any]) -> str:
    """
    Determine the outcome based on the decision rules from the Excel model
    
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
    
    # Decision logic follows the Excel formula patterns
    
    # Eliminate conditions
    if core == "No" and risk_tolerance == "No" and specialised_skill == "No":
        return "Eliminate"
        
    if core == "No" and legal_requirement == "No" and risk_tolerance == "No" and specialised_skill == "No":
        return "Eliminate"
    
    # Outsourcing conditions for non-core activities
    if core == "No" and frequency == "Outside":
        if specialised_skill == "Low" and skill_capacity == "Yes":
            return "Current Outsource"
        elif specialised_skill == "Low" and skill_capacity == "No":
            return "New Outsource"
        elif specialised_skill == "High" and similarity_with_scopes == "No":
            if skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
        elif specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Short":
            if skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
        elif specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long":
            if strategic_fit == "Yes" and affordability == "Yes":
                return "Insource or create in-house capacity"
            elif skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
    
    # Core activities with legal requirements
    if core == "Yes" and legal_requirement == "Yes":
        if specialised_skill == "Low":
            if skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
        elif specialised_skill == "High" and similarity_with_scopes == "No":
            if skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
        elif specialised_skill == "High" and similarity_with_scopes == "Yes":
            if duration == "Short":
                if skill_capacity == "Yes":
                    return "Current Outsource"
                else:
                    return "New Outsource"
            elif duration == "Long":
                if strategic_fit == "Yes" and affordability == "Yes":
                    return "Insource or create in-house capacity"
                elif skill_capacity == "Yes":
                    return "Current Outsource"
                else:
                    return "New Outsource"
    
    # Core activities with risks
    if core == "Yes" and risks == "Yes":
        if risk_tolerance == "Yes":
            if specialised_skill == "Low":
                if skill_capacity == "Yes":
                    return "Current Outsource"
                else:
                    return "New Outsource"
            elif specialised_skill == "High" and similarity_with_scopes == "No":
                if skill_capacity == "Yes":
                    return "Current Outsource"
                else:
                    return "New Outsource"
            elif specialised_skill == "High" and similarity_with_scopes == "Yes":
                if duration == "Short":
                    if skill_capacity == "Yes":
                        return "Current Outsource"
                    else:
                        return "New Outsource"
                elif duration == "Long":
                    if strategic_fit == "Yes" and affordability == "Yes":
                        return "Insource or create in-house capacity"
                    elif skill_capacity == "Yes":
                        return "Current Outsource"
                    else:
                        return "New Outsource"
        elif risk_tolerance == "No":
            if specialised_skill == "High" and similarity_with_scopes == "Yes" and duration == "Long" and strategic_fit == "Yes" and affordability == "Yes":
                return "Insource or create in-house capacity"
            elif skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
    
    # Core activities without legal requirements or specific risks
    if core == "Yes" and legal_requirement == "No" and risks == "No":
        if specialised_skill == "Low":
            if skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
        elif specialised_skill == "High" and similarity_with_scopes == "No":
            if skill_capacity == "Yes":
                return "Current Outsource"
            else:
                return "New Outsource"
        elif specialised_skill == "High" and similarity_with_scopes == "Yes":
            if duration == "Short":
                if skill_capacity == "Yes":
                    return "Current Outsource"
                else:
                    return "New Outsource"
            elif duration == "Long":
                if strategic_fit == "Yes" and affordability == "Yes":
                    return "Insource or create in-house capacity"
                elif skill_capacity == "Yes":
                    return "Current Outsource"
                else:
                    return "New Outsource"
    
    # Default fallback - if no specific condition met
    if skill_capacity == "Yes":
        return "Current Outsource"
    else:
        return "New Outsource"