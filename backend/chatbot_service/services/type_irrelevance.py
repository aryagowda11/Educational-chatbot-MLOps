from llama_index.core.llms import ChatMessage, MessageRole
from .utils import read_prompt
from langfuse.decorators import observe, langfuse_context
from .model_pricing import ModelRegistry
import time

"""
Irrelevant Question Handler module for the GRAID application.
This module provides functionality for handling questions deemed irrelevant
to the video content by giving appropriate, guided responses that
gently steer the user back to relevant topics.

Implementation details are masked for security and intellectual property protection.
"""

class IrrelevantQuestion:
    """
    Handles questions classified as irrelevant to the video content.
    
    This class manages irrelevant question responses, including:
    - Loading specialized prompt templates
    - Generating responses that acknowledge the question but redirect to relevant content
    - Tracking token usage and costs via Langfuse
    
    Implementation details masked for security and intellectual property protection.
    """
    
    def __init__(self, client, irrelevant_file):
        """
        Initialize the irrelevant question handler.
        
        Args:
            client: The LLM client to use for generating responses
            irrelevant_file: Path to the YAML file containing the irrelevant prompt template
            
        Implementation details masked for security and intellectual property protection.
        """
        # Implementation masked for security
        pass
        
    @observe(as_type="generation", name="Irrelevant_Intent")
    async def run(self, query: str, video_description: str, model_name: str = 'meta-llama/llama-4-scout-17b-16e-instruct'):
        """
        Process an irrelevant query and generate an appropriate response.
        
        This function:
        1. Loads the irrelevant prompt template from the specified file
        2. Formats the prompt with the query and video description context
        3. Sends the formatted prompt to the LLM
        4. Calculates token usage and costs
        5. Updates Langfuse with detailed usage metrics
        6. Returns a response that acknowledges the query but redirects to relevant topics
        
        Args:
            query (str): The user's irrelevant query
            video_description (str): Description of the current video for context
            model_name (str): The LLM model to use for generation
            
        Returns:
            str: The generated response for the irrelevant query
            
        Implementation details masked for security and intellectual property protection.
        """
        # Implementation masked for security
        pass