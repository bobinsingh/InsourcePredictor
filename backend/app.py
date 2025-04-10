from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routers import decision

app = FastAPI(title="Sourcing Decision Tool API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://insource-predictor.vercel.app/"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(decision.router, prefix="/api/decision", tags=["decision"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Sourcing Decision Tool API"}

# if __name__ == "__main__":
#     uvicorn.run("app:app", host="0.0.0.0", port=8080, reload=True)