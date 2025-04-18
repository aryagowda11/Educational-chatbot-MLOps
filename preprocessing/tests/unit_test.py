import os
import unittest
import time
import pandas as pd
from unittest.mock import MagicMock, patch
from pinecone import pinecone
from src.vector_db import create_vector_index
from src.llms_initialize import setup_environment
from src.API_Calling import groq_transcriber, triple_generator, vector_data_generator
from dotenv import load_dotenv

class TestVectorDB(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Load environment variables
        load_dotenv()
        cls.PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
        cls.PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
        cls.TEST_INDEX_NAME = "test-course"
        
        try:
            cls.embed_model, cls.llm = setup_environment(model_type="openai")
        except Exception as e:
            print(f"Warning: Failed to set up environment: {str(e)}")
        
        # Initialize Pinecone client for later cleanup
        cls.pc = pinecone.Pinecone(api_key=cls.PINECONE_API_KEY)
        cls.video = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_video.mp4")
        cls.video_id = "video_001"
        cls.course_id = "course_001"
        
        # Create a mock for transcription response
        cls.mock_transcription = MagicMock()
        cls.mock_transcription.dict.return_value = {
            "segments": [
                {
                    "start": 0,
                    "end": 60,
                    "text": "This is a sample transcription for segment 1."
                },
                {
                    "start": 60,
                    "end": 120,
                    "text": "This is a sample transcription for segment 2."
                }
            ],
            "full_transcript": "This is a sample transcription for segment 1. This is a sample transcription for segment 2."
        }

    def test_groq_transcriber(self):
        """Test the actual transcriber with a real API call"""
        response = groq_transcriber(self.video)
        self.assertIsNotNone(response, "Transcription response should not be None")
        print(f"Type of real response: {type(response)}")
        print(f"Has dict method: {hasattr(response, 'dict')}")

    def test_vector_data_generator(self):
        """Test vector data generation with the mock response"""
        vector_df = vector_data_generator(self.mock_transcription, self.video_id,self.course_id)
        self.assertIsNotNone(vector_df)
        self.assertTrue(isinstance(vector_df, pd.DataFrame), "Should return a pandas DataFrame")
        self.assertEqual(set(vector_df.columns), {'course_id','video_id', 'timestamp', 'text'}, 
                    "DataFrame should have the expected columns")
        self.assertTrue(len(vector_df) > 0, "DataFrame should not be empty")

    def test_triple_generator(self):
        """Test triple generation with the mock response"""
        triples_df = triple_generator(self.mock_transcription, self.video_id,self.course_id)
        self.assertIsNotNone(triples_df)
        self.assertTrue(isinstance(triples_df, pd.DataFrame), "Should return a pandas DataFrame")
        self.assertEqual(set(triples_df.columns), {'subject', 'predicate', 'object'}, 
                        "DataFrame should contain subject, predicate, object columns")
        self.assertTrue(len(triples_df) > 0, "Triples DataFrame should not be empty")

    @patch("src.vector_db.Pinecone")  # This mocks the Pinecone class
    def test_create_vector_index_with_mock(self, MockPinecone):
        """Test create_vector_index logic using mocked Pinecone client"""
        print("🚀 Running mocked create_vector_index test")

        # Setup fake Pinecone client and fake index
        mock_pc = MagicMock()
        mock_index = MagicMock()

        mock_pc.list_indexes.return_value = []  # Simulate no index exists
        mock_pc.Index.return_value = mock_index
        MockPinecone.return_value = mock_pc

        # Prepare a minimal DataFrame with required fields
        mock_vector_df = pd.DataFrame([{
            "video_id": "video_mock_01",
            "timestamp": "00:00-01:00",
            "corrected_text": "Mocked text for indexing"
        }])

        # Run the function with the mock
        result = create_vector_index(
            vector_df=mock_vector_df,
            embed_model=self.embed_model,
            course_id="mock-course-index",
            pinecone_api_key="mock_api_key",
            pinecone_environment="mock_env"
        )

        print(f"✅ create_vector_index returned: {result}")
        self.assertTrue(result, "create_vector_index should return True with mock setup")
        mock_pc.create_index.assert_called_once()  # Optional: ensure it tried to create the index

    @classmethod
    def tearDownClass(cls):
        try:
            existing_indexes = [index.name for index in cls.pc.list_indexes()]
            if cls.TEST_INDEX_NAME in existing_indexes:
                print(f"Cleaning up: Deleting test index '{cls.TEST_INDEX_NAME}'")
                cls.pc.delete_index(cls.TEST_INDEX_NAME)
                print("Test index deleted successfully")
        except Exception as e:
            print(f"Error during cleanup: {str(e)}")

if __name__ == '__main__':
    unittest.main()
