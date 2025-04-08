from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import io
from fastapi.responses import StreamingResponse
import openpyxl
from openpyxl import Workbook

from logic.decision_rules import determine_outcome

router = APIRouter()

class DecisionInput(BaseModel):
    core: str
    legal_requirement: str = ""
    risks: str = ""
    risk_tolerance: str = ""
    frequency: str
    specialised_skill: str
    similarity_with_scopes: str
    skill_capacity: str
    duration: str
    affordability: str
    strategic_fit: str
    activity_name: str = "Unnamed Activity"
    activity_type: str = ""

class DecisionRequest(BaseModel):
    inputs: List[DecisionInput]

class DecisionOutput(BaseModel):
    activity_name: str
    activity_type: str
    core: str
    legal_requirement: str
    risks: str
    risk_tolerance: str
    frequency: str
    specialised_skill: str
    similarity_with_scopes: str
    skill_capacity: str
    duration: str
    affordability: str
    strategic_fit: str
    outcome: str

class DecisionResponse(BaseModel):
    results: List[DecisionOutput]

@router.post("/determine", response_model=DecisionResponse)
async def determine_outcomes(request: DecisionRequest):
    """
    Determine the outcomes for the provided inputs based on decision rules
    """
    results = []
    
    for input_data in request.inputs:
        # Convert input to dict
        input_dict = input_data.dict()
        
        # Determine the outcome
        outcome = determine_outcome(input_dict)
        
        # Create output with all input fields plus outcome
        output = DecisionOutput(
            activity_name=input_dict.get("activity_name", ""),
            activity_type=input_dict.get("activity_type", ""),
            core=input_dict.get("core", ""),
            legal_requirement=input_dict.get("legal_requirement", ""),
            risks=input_dict.get("risks", ""),
            risk_tolerance=input_dict.get("risk_tolerance", ""),
            frequency=input_dict.get("frequency", ""),
            specialised_skill=input_dict.get("specialised_skill", ""),
            similarity_with_scopes=input_dict.get("similarity_with_scopes", ""),
            skill_capacity=input_dict.get("skill_capacity", ""),
            duration=input_dict.get("duration", ""),
            affordability=input_dict.get("affordability", ""),
            strategic_fit=input_dict.get("strategic_fit", ""),
            outcome=outcome
        )
        
        results.append(output)
    
    return DecisionResponse(results=results)

@router.post("/export-excel")
async def export_to_excel(request: DecisionRequest):
    """
    Generate Excel file with inputs and outcomes using openpyxl instead of pandas
    """
    # Process inputs to determine outcomes
    results = []
    
    for input_data in request.inputs:
        input_dict = input_data.dict()
        outcome = determine_outcome(input_dict)
        
        # Add outcome to the input data
        input_dict["outcome"] = outcome
        results.append(input_dict)
    
    # Create a workbook using openpyxl
    wb = Workbook()
    ws = wb.active
    ws.title = "Sourcing Decisions"
    
    # Add headers
    headers = [
        "activity_name", "activity_type", "core", "legal_requirement", 
        "risks", "risk_tolerance", "frequency", "specialised_skill", 
        "similarity_with_scopes", "skill_capacity", "duration", 
        "affordability", "strategic_fit", "outcome"
    ]
    
    for col_idx, header in enumerate(headers, 1):
        ws.cell(row=1, column=col_idx, value=header)
    
    # Add data
    for row_idx, result in enumerate(results, 2):
        for col_idx, header in enumerate(headers, 1):
            ws.cell(row=row_idx, column=col_idx, value=result.get(header, ""))
    
    # Save to a BytesIO object
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    # Return the Excel file as a response
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sourcing_decisions.xlsx"}
    )