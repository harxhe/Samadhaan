from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import logging

# Configure logging at INFO level to see server activity
logging.basicConfig(level=logging.INFO)
# Create a logger instance for this module
logger = logging.getLogger(__name__)

# Initialize FastAPI application with metadata
app = FastAPI(title="Samadhaan AI Service")

# Load the zero-shot classification pipeline using Hugging Face Transformers
# We use try/except block to handle model loading failures gracefully
try:
    # Use 'facebook/bart-large-mnli' model which is excellent for Zero-Shot Classification
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    logger.info("Deep Learning Model loaded successfully.")
except Exception as e:
    # If model fails to load (e.g. no internet), log error and set classifier to None
    logger.error(f"Failed to load model: {e}")
    classifier = None

# Define the input schema using Pydantic
class ClassificationRequest(BaseModel):
    text: str  # The complaint text to be classified
    # Default categories if not provided by the client
    categories: list[str] = ["Roads", "Sanitation", "Civic"]

# Define the output schema for API response
class ClassificationResponse(BaseModel):
    category: str      # The top predicted category
    confidence: float  # Confidence score (0.0 to 1.0)
    all_scores: dict   # Detailed scores for all categories

# Health check endpoint at root URL
@app.get("/")
async def root():
    return {"message": "Samadhaan AI Service is running"}

# Main endpoint for text classification
# Accepts POST request with JSON body matching ClassificationRequest schema
# Returns JSON matching ClassificationResponse schema
@app.post("/classify", response_model=ClassificationResponse)
async def classify_text(request: ClassificationRequest):
    # Ensure the model is loaded before processing
    if not classifier:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Run the classification model on the input text
        result = classifier(request.text, request.categories)
        
        # Extract the top predicted category (first in the list)
        top_category = result['labels'][0]
        # Extract the score for the top category
        top_score = result['scores'][0]
        
        # Create a dictionary of all categories and their scores
        all_scores = {
            label: score 
            for label, score in zip(result['labels'], result['scores'])
        }
        
        # Return structured response
        return ClassificationResponse(
            category=top_category,
            confidence=top_score,
            all_scores=all_scores
        )
            
    except Exception as e:
        # Log any internal errors and return 500 response
        logger.error(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # If run directly as a script, start uvicorn server
    # Listen on 0.0.0.0 (all interfaces) port 8000
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
