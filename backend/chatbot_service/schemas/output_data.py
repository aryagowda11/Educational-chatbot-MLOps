from pydantic import BaseModel

class OutputData(BaseModel):
    """
    Output data model for the API response.

    Attributes:
        response (str): The response containing the final answer from the LLM.
    """
    response: str