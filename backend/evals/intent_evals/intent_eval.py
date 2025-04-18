import pandas as pd
import json
import os
from datetime import datetime
from pathlib import Path
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from dotenv import load_dotenv
from .intent_classifier import IntentClassifierChecker

load_dotenv()

def evaluate_intent_classifier(llm, intent_prompt, data_path, base_dir, sample_size=None):
    """
    Evaluation that loads data, makes classifier calls, calculates metrics, and saves results.
    
    Args:
        llm: Language model to use
        intent_prompt: Path to intent prompt file
        data_path: Path to Excel with test data
        base_dir: Base directory for saving evaluation outputs
        sample_size: Optional number of samples to evaluate
    
    Returns:
        Dictionary with evaluation results
    """
    # Create run timestamp for folder naming
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir = base_dir / "intent_runs" / timestamp
    run_dir.mkdir(parents=True, exist_ok=True)

    # Load test data
    df = pd.read_excel(data_path)
    print(f"Loaded {len(df)} examples from {data_path}")

    # Sample if requested
    if sample_size and sample_size < len(df):
        df = df.sample(sample_size, random_state=42)
        print(f"Evaluating on {sample_size} examples")

    # Save a copy of the data used
    original_path = run_dir / "original_data.csv"
    df.to_csv(original_path, index=False)

    # Make predictions
    true_intents = []
    pred_intents = []
    errors = []

    classifier = IntentClassifierChecker(llm, intent_prompt)

    for idx, row in df.iterrows():
        try:
            true_intent = row['intent']
            pred_intent = classifier.run(row['user_question'], row['video_description'])

            true_intents.append(true_intent)
            pred_intents.append(pred_intent)

            print(f"Example {idx}: True={true_intent}, Pred={pred_intent}")

            if true_intent != pred_intent:
                errors.append({
                    'index': idx,
                    'video_description': row['video_description'],
                    'user_question': row['user_question'],
                    'true_intent': true_intent,
                    'predicted_intent': pred_intent
                })

        except Exception as e:
            print(f"Error on example {idx}: {e}")

    # Calculate metrics
    accuracy = accuracy_score(true_intents, pred_intents)

    intent_labels = ['retrieval', 'chat', 'general_chat', 'irrelevant']
    precision, recall, f1, support = precision_recall_fscore_support(
        true_intents,
        pred_intents,
        labels=intent_labels,
        average=None,
        zero_division=0
    )

    metrics = {
        'timestamp': timestamp,
        'sample_size': len(true_intents),
        'accuracy': float(accuracy),
        'class_metrics': {}
    }

    for i, label in enumerate(intent_labels):
        metrics['class_metrics'][label] = {
            'precision': float(precision[i]),
            'recall': float(recall[i]),
            'f1': float(f1[i]),
            'support': int(support[i])
        }

    macro_precision, macro_recall, macro_f1, _ = precision_recall_fscore_support(
        true_intents,
        pred_intents,
        average='macro',
        zero_division=0
    )

    metrics['macro_avg'] = {
        'precision': float(macro_precision),
        'recall': float(macro_recall),
        'f1': float(macro_f1)
    }

    print(f"\nAccuracy: {accuracy:.4f}")
    print(f"Macro Precision: {macro_precision:.4f}")
    print(f"Macro Recall: {macro_recall:.4f}")
    print(f"Macro F1: {macro_f1:.4f}")

    # Save results to JSON
    results_path = run_dir / "run.json"
    with open(results_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"Saved results to {results_path}")

    # Save errors to CSV
    if errors:
        errors_df = pd.DataFrame(errors)
        errors_path = run_dir / "errors.csv"
        errors_df.to_csv(errors_path, index=False)
        print(f"Saved {len(errors)} errors to {errors_path}")

    return metrics


# Example usage
if __name__ == "__main__":
    from backend.chatbot_service.services.utils import setup_environment  # Replace with your actual LLM import
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    current_dir = Path(__file__).resolve().parent
    backend_dir = current_dir.parents[1]
    print(f"Backend directory: {backend_dir}")

    intent_prompt = backend_dir / "chatbot_service" / "prompts" / "intent.yaml"
    data_path = current_dir / "ml-intent-classification-dataset.xlsx"

    accuracy = evaluate_intent_classifier(client, intent_prompt, data_path, current_dir, sample_size=10)
