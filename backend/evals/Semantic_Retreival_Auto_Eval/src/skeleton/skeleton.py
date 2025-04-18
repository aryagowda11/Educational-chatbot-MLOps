import os
import time
import asyncio
from src.services.utils import setup_llm_and_embeddings, load_documents_from_csv, build_vector_index
from src.services.evaluator import evaluate_retriever, display_results
from pathlib import Path
import json
from ..services.results_manager import create_run_directory, save_evaluation_results

async def run_evaluation(csv_path, test_size=None, question_count=2):
    """Run the retriever evaluation process."""
    # Setup and data loading
    embed_model, llm = setup_llm_and_embeddings()
    documents = load_documents_from_csv(csv_path)
    if test_size is not None:
        documents = documents[:test_size]
    
    # Build index and evaluate
    vector_index, nodes = build_vector_index(documents, embed_model)
    eval_results, qa_dataset = await evaluate_retriever(vector_index, nodes, llm, question_count=question_count)
    
    # Save results
    run_dir = create_run_directory(documents)
    save_evaluation_results(run_dir, qa_dataset, eval_results)
    
    return eval_results, qa_dataset
