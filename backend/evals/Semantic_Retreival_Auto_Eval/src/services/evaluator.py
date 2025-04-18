from llama_index.core.evaluation import (
    generate_question_context_pairs,
    RetrieverEvaluator
)
import pandas as pd

# ----------- Evaluate -----------
async def evaluate_retriever(vector_index, nodes, llm,question_count=2):
    qa_dataset = generate_question_context_pairs(
        nodes,
        llm=llm,
        num_questions_per_chunk=2
    )

    retriever = vector_index.as_retriever(similarity_top_k=10)

    retriever_evaluator = RetrieverEvaluator.from_metric_names(
        ["mrr", "hit_rate"], retriever=retriever
    )

    eval_results = await retriever_evaluator.aevaluate_dataset(qa_dataset)
    return eval_results,qa_dataset

# ----------- Display -----------
def display_results(name, eval_results):
    metric_dicts = [res.metric_vals_dict for res in eval_results]
    full_df = pd.DataFrame(metric_dicts)

    hit_rate = full_df["hit_rate"].mean()
    mrr = full_df["mrr"].mean()

    metric_df = pd.DataFrame(
        {"Retriever Name": [name], "Hit Rate": [hit_rate], "MRR": [mrr]}
    )

    print(metric_df)
    return metric_df