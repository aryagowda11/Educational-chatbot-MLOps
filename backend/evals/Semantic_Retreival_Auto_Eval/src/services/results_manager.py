import time
from src.services.evaluator import display_results
from pathlib import Path

def create_run_directory(documents):
    """Create and return a directory for storing evaluation results."""
    base_dir = Path(__file__).resolve().parent.parent.parent
    runs_dir = base_dir / 'runs'
    runs_dir.mkdir(exist_ok=True)
    
    # Extract metadata from documents
    course_name = documents[0].metadata.get('course_name', 'unknown_course')
    video_id = documents[0].metadata.get('video_id', 'unknown_video')
    
    # Create a unique folder name with timestamp
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    folder_name = f"{course_name}_{video_id}_{timestamp}"
    run_dir = runs_dir / folder_name
    run_dir.mkdir(exist_ok=True)
    
    return run_dir

def save_evaluation_results(run_dir, qa_dataset, eval_results):
    """Save evaluation results to files."""
    qa_dataset_path = run_dir / "qa_dataset.json"
    results_path = run_dir / "retriever_evaluation_results.csv"
    
    qa_dataset.save_json(str(qa_dataset_path))
    result_df = display_results("Embedding Retriever", eval_results)
    result_df.to_csv(str(results_path), index=False)
    
    print(f"Results saved to {run_dir}")