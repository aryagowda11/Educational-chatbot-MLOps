from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import re
import logging
from llama_index.core.llms import ChatMessage, MessageRole
from backend.chatbot_service.services.utils import read_prompt

# Set up logging
logger = logging.getLogger(__name__)

class IntentResponse(BaseModel):
    """
    Pydantic model to structure the intent classification output.
    """
    intent: str
    reasoning: str

class IntentClassifierChecker:

    def __init__(self, client, intent_file):
        self.client = client
        self.intent_file = intent_file
    
    def run(self, query: str, video_description: str) -> str:
        """
        Runs the intent classification and returns structured output.
        
        Args:
            query: User's question
            video_description: Description of the video
            
        Returns:
            Classification intent as string
            
        Raises:
            ValueError: If response cannot be parsed or validated
        """
        intent_types = self.get_intent_types()
        
        try:
            prompt = read_prompt(self.intent_file)
            prompt = prompt.format(
                query=query,
                video_description=video_description,
                intent_types=intent_types
            )
            
            response = self.client.chat.completions.create(
                # model="gpt-4o",
                model="o3-mini",
                reasoning_effort="low",
                messages=[
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                stream=False
            )
            # Log the raw response for debugging
            content = response.choices[0].message.content
            logger.info(f"Raw LLM response: {content}")
            
            # Parse the response to extract the intent
            # This is a simplistic approach - you might need more robust parsing
            for intent in ["retrieval", "chat", "general_chat", "irrelevant"]:
                if intent.lower() in content.lower():
                    return intent
                    
            # If no intent found in the response, return the full response
            logger.warning(f"Could not identify clear intent in response: {content}")
            return content
    
        except Exception as e:
            logger.exception("Unexpected error in intent classification")
            # Fall back to a default intent for production resilience
            logger.warning(f"Falling back to default intent due to error: {str(e)}")
            return "general_chat"  # Default fallback intent

    def get_intent_types(self) -> str:
        return """Intent Types:
        - retrieval 
        - chat
        - general_chat
        - irrelevant"""