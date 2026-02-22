---
title: "Parser Evals - Document Parsing Benchmark Toolkit"
slug: "parser-evals"
date: "2025-02-08"
tags: ["document-parsing", "LLM", "evaluation", "AWS", "PDF", "DOCX", "benchmarking", "python"]
category: "Machine Learning"
excerpt: "A comprehensive toolkit for evaluating document parsing libraries across multiple formats using LLM-based scoring and vision-enhanced assessment."
description: "Modular evaluation toolkit that benchmarks document parsers (Docling, Marker, PyMuPDF, LlamaParse, etc.) across PDF, DOCX, and PPTX formats using text-based, vision-enhanced, and LLM judge evaluation methods."
featured: true
status: "completed"
tech_stack: ["Python", "AWS Bedrock", "Claude 3.5 Sonnet", "Docling", "Marker", "PyMuPDF", "LlamaParse"]
cover: "/project-images/parser-evals/cover.png"
links:
  - type: "github"
    url: "https://github.com/AmazingK2k3/Parser_evals"
    label: "View on GitHub"
---

## Overview

A comprehensive toolkit for assessing document parsing libraries across multiple formats (PDF, DOCX, PPTX, etc.), leveraging LLM-based evaluation to help users select the most suitable parser for their specific use case. This project was a branch off from the RAG Pipeline Evals repository, focusing specifically on evaluating document parsing libraries using similar principles and methodologies. While RAG seems simple at start and each parser may seem to be doing a good job, the reality is that there are many edge cases and nuances in document parsing that can significantly impact RAG performance especially in production and real world applications. This toolkit provides a systematic way to evaluate and compare different parsers across various document formats, using a combination of text-based, vision-enhanced, and LLM judge evaluation methods. The goal is to provide users with actionable insights into the strengths and weaknesses of each parser, helping them make informed decisions about which one to use for their specific needs. The code is modular and configuration-driven, allowing for easy experimentation and benchmarking across different parsing solutions and evaluation methods. Hope you can check out the project yourself and provide feedback on how to improve it!

## Evaluation Methods

The toolkit provides three distinct evaluation approaches, each suited for different needs:

### 1. Text-Based Evaluation
Fast and economical (1-2 minutes, $1-2 per evaluation). Compares extracted text output against expected content, suitable for most standard evaluation scenarios.

### 2. Vision-Enhanced Evaluation
Compares parser output against original PDF page images for thorough visual accuracy verification. Higher cost but catches layout and formatting issues that text-only evaluation misses.

### 3. LLM Judge System
Employs AWS Bedrock Claude 3.5 Sonnet as an expert judge, providing detailed scoring across five criteria:
- **Text Accuracy** — Correctness of extracted text content
- **Structure Preservation** — Headings, lists, and hierarchy maintained
- **Formatting Quality** — Tables, bold/italic, and styling preserved
- **Completeness** — No missing content or sections
- **Readability** — Clean, well-formatted output

## Supported Parsers

The toolkit evaluates multiple parsing solutions:
- **Docling** — IBM's document understanding library
- **Marker** — High-quality PDF to markdown conversion
- **PyMuPDF** — Fast, lightweight PDF extraction
- **MarkItDown** — Microsoft's document converter
- **Mammoth** — DOCX to HTML/markdown converter
- **LlamaParse** — LlamaIndex's cloud parsing service
- Specialized DOCX parsers for office document formats

## Technical Architecture

- **core/** — Configuration and environment variable management
- **parsing_extract/** — Parser implementations with abstract base classes for easy extension
- Main evaluation scripts supporting batch processing across all parsers and formats

---

*Full code, evaluation results, and setup instructions available in the [GitHub repository](https://github.com/AmazingK2k3/Parser_evals).*
