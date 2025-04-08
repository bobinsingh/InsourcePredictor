# InsourcePredictor

# Sourcing Decision Tool

A tool for determining optimal sourcing strategies based on multiple factors including core requirements, risk tolerance, specialized skills, and business alignment.

## Project Structure

This project consists of two main parts:
- Backend: FastAPI application that implements the decision rules
- Frontend: React application that provides a user interface for input and results display

## Backend Setup

### Requirements
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Backend

To start the FastAPI server:
```bash
python app.py
```

This will start the server at http://localhost:8000. You can access the API documentation at http://localhost:8000/docs.

## Frontend Setup

### Requirements
- Node.js 14 or higher
- npm (Node.js package manager)

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Running the Frontend

To start the React development server:
```bash
npm start
```

This will start the application at http://localhost:3000.

## Using the Application

1. Fill out the form for each activity you want to analyze
2. Navigate through the form using Next/Back buttons
3. Add or remove activities as needed
4. Submit your inputs to get results
5. View the outcome for each activity
6. Export results to Excel if needed

## Decision Rules

The application determines the optimal sourcing strategy based on multiple factors:

### Possible Outcomes:
- **Eliminate**: Activity should be discontinued
- **Current Outsource**: Continue existing outsourcing arrangement
- **New Outsource**: Find a new outsourcing partner
- **Insource or create in-house capacity**: Bring the activity in-house

Key decision factors include:
- Core activity status
- Legal requirements
- Risk factors
- Specialized skill requirements
- Similarity with current operations
- Skill capacity
- Duration
- Affordability
- Strategic fit



sourcing-decision-tool/
├── backend/
│   ├── app.py                # Main FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── routers/
│   │   └── decision.py       # API endpoints
│   └── logic/
│       └── decision_rules.py # Business logic for decision rules
│
├── frontend/
│   ├── package.json          # Node.js dependencies
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   └── src/
│       ├── index.js          # Entry point
│       ├── App.js            # Main application component
│       ├── components/
│       │   ├── DecisionForm.js    # Form component for inputs
│       │   ├── FormNavigation.js  # Next/Back navigation buttons
│       │   ├── ResultsDisplay.js  # Display results component
│       │   └── DataTable.js       # Table component for inputs/outcomes
│       └── styles/
│           └── styles.css    # CSS styles