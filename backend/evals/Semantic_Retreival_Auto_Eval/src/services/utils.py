from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.openai import OpenAI
import pandas as pd
from llama_index.core import (
    Document, VectorStoreIndex, Settings
)
import time
from llama_index.core.schema import TextNode
# ----------- Settings -----------
def setup_llm_and_embeddings():
    # Set embedding model
    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-large-en-v1.5")
    Settings.embed_model = embed_model

    # Set LLM
    llm = OpenAI(
        api_key="XXXXX",
        model="gpt-4o"
    )

    return embed_model, llm

# ----------- Load Data -----------
def load_documents_from_csv(csv_path):
    df = pd.read_csv(csv_path)
    documents = []

    for _, row in df.iterrows():
        metadata = {
            "video_id": row["video_id"],
            "timestamp": row["timestamp"]
        }
        doc = Document(text=row["corrected_text"], metadata=metadata)
        documents.append(doc)

    return documents

# ----------- Build Vector Index -----------
def build_vector_index(documents, embed_model):
    nodes = [TextNode(text=doc.text, metadata=doc.metadata) for doc in documents]
    start = time.time()
    vector_index = VectorStoreIndex(nodes, embed_model=embed_model)
    print("Node parsing time:", time.time() - start)
    return vector_index, nodes