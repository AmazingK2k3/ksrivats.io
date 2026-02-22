---
title: "RAG Pipeline Evals - Systematic RAG Benchmarking Framework"
slug: "rag-pipeline-evals"
date: "2025-02-10"
tags: ["RAG", "LLM", "evaluation", "AWS", "FAISS", "ChromaDB", "embeddings", "NLP", "python"]
category: "RAG & LLM Evaluation"
excerpt: "A configuration-driven evaluation framework for systematic testing, benchmarking, and optimization of Retrieval-Augmented Generation pipelines."
description: "Modular RAG evaluation framework that enables systematic benchmarking across parsing, chunking, embedding, vector storage, retrieval, and generation stages using RAGAS metrics and AWS Bedrock."
featured: true
status: "completed"
tech_stack: ["Python", "AWS Bedrock", "FAISS", "ChromaDB", "RAGAS", "LangChain", "HuggingFace", "OpenAI"]
cover: "/project-images/rag-pipeline-evals/cover.png"
links:
  - type: "github"
    url: "https://github.com/AmazingK2k3/RAG_Pipeline_Evals"
    label: "View on GitHub"
---

## Brief

A configuration-driven RAG evaluation framework built for systematic testing, benchmarking, and optimization of RAG pipelines. The framework enables modular combinations across six primary pipeline stages, allowing you to test different configurations and measure performance using standardized metrics. This project was started as part of my work to explore different RAG  methodologies out there and figure out which are actually effective and reliable to be used in production level environments. Each stage of the rag pipeline has multiple interchangeable methods that can be easily swapped out and tested against each other. The evaluation is done using the RAGAS framework, which provides a comprehensive set of metrics to assess the performance of the entire pipeline. The idea is instead of determining performance results from external sources, any user of this repository can simply add new methods from RAG by themselves and test the ideal combination suitable for their particular use case. The code is modular and configuration-driven, allowing for easy experimentation and benchmarking across different RAG components and evaluation methods. A derivative from this project is the Parser Evals repository, which focuses specifically on evaluating document parsing libraries using similar principles and methodologies. Hope to hear your feedback regarding this repository!

## Architecture

The pipeline is composed of six modular, interchangeable stages:

### 1. Parsing & Processing
Supports LangChain PDF extraction with future LlamaParse integration for handling diverse document formats.

### 2. Text Segmentation
Multiple chunking strategies including recursive, character-based, token-based, fixed, and semantic chunking — each configurable via YAML.

### 3. Vector Representations
Integrates AWS Titan, HuggingFace, and OpenAI embedding models for generating document embeddings.

### 4. Storage Solutions
Implements FAISS and ChromaDB as vector database backends for storing and querying embeddings.

### 5. Information Retrieval
Provides semantic search, keyword-based (BM25), and hybrid retrieval methods to find the most relevant context.

### 6. Generation & Evaluation
Uses AWS Bedrock Claude for response generation with RAGAS metrics for automated evaluation.

## Evaluation Metrics

The system measures RAG performance through five dimensions using the RAGAS framework:

- **Faithfulness Accuracy** — Does the answer stay true to the retrieved context?
- **Answer Relevance** — Is the generated answer relevant to the question?
- **Context Precision** — How precise is the retrieved context?
- **Context Recall** — Does the retrieval capture all relevant information?
- **Answer Correctness** — How does the answer compare against ground truth?

## Key Features

- **Configuration-driven**: Manage entire pipeline configurations via YAML files
- **Multi-format QA datasets**: Supports JSON-based question-answer specifications for benchmarking
- **Interactive chat**: Single-document testing mode for quick experimentation
- **Comprehensive outputs**: Per-question analysis with detailed scoring breakdowns

---

*Check the [GitHub repository](https://github.com/AmazingK2k3/RAG_Pipeline_Evals) for code, configurations, and evaluation results.*
