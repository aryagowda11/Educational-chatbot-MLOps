# Semantic Retrieval Evaluation Pipeline

This repository contains a pipeline for generating question-answer datasets and evaluating vector database retrieval performance using MRR (Mean Reciprocal Rank) and Hit Rate metrics.

## Project Structure

```
.
├── runs/
│   └── unknown_course_video_001_20250328-13...
│       ├── qa_dataset.json
│       └── retriever_evaluation_results.csv
├── src/
│   ├── services/
│   │   ├── __init__.py
│   │   ├── evaluator.py
│   │   ├── results_manager.py
│   │   └── utils.py
│   └── skeleton/
│       ├── __init__.py
│       └── skeleton.py
├── __init__.py
├── poetry.lock
├── pyproject.toml
├── semantic_retreival_evals.py
└── vectordb_data.csv
```

## Getting Started

### Prerequisites

- Python 3.8+
- Poetry for dependency management

### Installation

1. Clone this repository
2. Install dependencies using Poetry:
   ```
   poetry install
   ```

## Usage

You need the `vectordb_data.csv` file to run the pipeline. This file should be manually downloaded from the Google Cloud Storage bucket where all preprocessed files are stored and placed in the project's root directory.

### Running the Pipeline

To run the evaluation pipeline:

```bash
python semantic_retreival_evals.py
```

You can customize the number of questions generated per text chunk using the `question_count` parameter:

```bash
python semantic_retreival_evals.py --question_count 2
```

## Pipeline Process

1. **Data Loading**: The pipeline loads preprocessed text chunks from `vectordb_data.csv`
2. **Question Generation**: For each text chunk, the system generates questions based on the content. The number of questions per chunk can be configured using the `question_count` parameter
3. **Dataset Creation**: The generated questions and their answers are compiled into a QA dataset (`qa_dataset.json`)
4. **Retrieval Evaluation**: The system evaluates the retrieval performance using vector database search against the generated questions

## Output Files

The pipeline produces two main outputs:

1. **`qa_dataset.json`**: Contains the generated questions and their corresponding answers
2. **`retriever_evaluation_results.csv`**: Contains the evaluation metrics for the retrieval system

### Understanding Evaluation Metrics

#### Mean Reciprocal Rank (MRR)

MRR measures the effectiveness of the retrieval system by calculating the average of the reciprocal ranks of the first relevant result for each query.

**Example**: 
- If for 3 queries, the correct answer appears at positions 1, 3, and 5 respectively
- The reciprocal ranks are 1/1, 1/3, and 1/5
- MRR = (1/1 + 1/3 + 1/5) / 3 = 0.53

Higher MRR values (closer to 1.0) indicate better retrieval performance, meaning the system is ranking relevant documents higher.

#### Hit Rate

Hit Rate measures the percentage of queries for which a relevant document is retrieved within the top K results.

**Example**:
- For Hit@1: If out of 100 queries, the correct answer appears at position 1 for 75 queries, the Hit@1 is 75%
- For Hit@3: If out of 100 queries, the correct answer appears within the top 3 positions for 85 queries, the Hit@3 is 85%

The retriever_evaluation_results.csv will typically include Hit Rate metrics for different K values (Hit@1, Hit@3, Hit@5, etc.).

## Customization

You can modify the pipeline's behavior by editing:
- `src/services/evaluator.py`: To change evaluation metrics or parameters
- `src/skeleton/skeleton.py`: To modify the core processing logic
- `question_count` parameter: To adjust the number of questions generated per chunk

## Notes

- You need to manually download the `vectordb_data.csv` file from Google Cloud Storage and place it in the project's root directory before running the pipeline
- The quality of generated questions depends on the content of the text chunks in `vectordb_data.csv`
- For large datasets, the question generation process may take significant time