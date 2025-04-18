# Intent Classification Evaluation

This module provides tools for evaluating the performance of an intent classification system for conversational AI applications. It tests how accurately a language model can classify user questions into predefined intent categories based on context.

## Overview

The intent classifier categorizes user questions into one of the following intent types:
- **retrieval**: Questions that can be answered by retrieving information from a specific video
- **chat**: Questions that are specific to the video but require conversation
- **general_chat**: General conversational questions not specific to video content
- **irrelevant**: Questions unrelated to or inappropriate for the system

## Project Structure

```
intent_evals/
│
├── intent_runs/          # Timestamped evaluation run outputs
│   └── YYYYMMDD-HHMMSS/  # Individual run folders
│       ├── original_data.csv  # Copy of evaluation data
│       ├── run.json      # Metrics and results
│       └── errors.csv    # Misclassifications
│
├── intent_classifier.py  # Implementation of the intent classifier
├── intent_eval.py        # Main evaluation script
├── __init__.py
└── ml-intent-classification-dataset.xlsx  # Test dataset
```

## Requirements

- Python 3.8+
- pandas
- scikit-learn
- openai (or other LLM client)
- python-dotenv
- openpyxl (for Excel file handling)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install pandas scikit-learn openai python-dotenv openpyxl
   ```
3. Set up environment variables:
   ```
   # .env file
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

### Running Evaluations

```python
from pathlib import Path
from openai import OpenAI
from intent_evals.intent_eval import evaluate_intent_classifier

# Initialize your LLM client
client = OpenAI(api_key="your_api_key")

# Set up paths
current_dir = Path(__file__).resolve().parent
intent_prompt = Path("path/to/intent.yaml")  # Your intent prompt file
data_path = current_dir / "ml-intent-classification-dataset.xlsx"

# Run evaluation
results = evaluate_intent_classifier(
    llm=client,
    intent_prompt=intent_prompt,
    data_path=data_path,
    base_dir=current_dir,
    sample_size=100  # Optional: evaluate on a subset
)
```

### Evaluation Outputs

Each evaluation run creates a timestamped directory containing:

1. **original_data.csv** - Copy of the dataset used for evaluation
2. **run.json** - Evaluation metrics including:
   - Overall accuracy
   - Per-class precision, recall, F1, and support
   - Macro-averaged metrics
3. **errors.csv** - Details of misclassified examples

### Example Output Format

```json
{
  "timestamp": "20240407-153012",
  "sample_size": 100,
  "accuracy": 0.87,
  "class_metrics": {
    "retrieval": {
      "precision": 0.92,
      "recall": 0.88,
      "f1": 0.90,
      "support": 50
    },
    "chat": {
      "precision": 0.85,
      "recall": 0.82,
      "f1": 0.83,
      "support": 25
    },
    "general_chat": {
      "precision": 0.78,
      "recall": 0.88,
      "f1": 0.83,
      "support": 15
    },
    "irrelevant": {
      "precision": 0.90,
      "recall": 0.90,
      "f1": 0.90,
      "support": 10
    }
  },
  "macro_avg": {
    "precision": 0.86,
    "recall": 0.87,
    "f1": 0.87
  }
}
```

## Customization

### Intent Prompt

The intent classification prompt is loaded from a YAML file, allowing easy modification of the classification criteria and examples without changing code.

### Intent Classifier

The `IntentClassifierChecker` class in `intent_classifier.py` handles the interaction with the language model. You can extend or modify this class to use different classification strategies or LLM providers.

## Testing New Models

To evaluate a different language model:

1. Create an appropriate client instance for your LLM
2. Pass it to the `evaluate_intent_classifier` function
3. Compare results across different runs to assess performance differences