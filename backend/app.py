from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import decision

app = FastAPI(title="Sourcing Decision Tool API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(decision.router, prefix="/api/decision", tags=["decision"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Sourcing Decision Tool API"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("app:app", host="0.0.0.0", port=port)