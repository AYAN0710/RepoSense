# RepoSense

### AI-Powered Codebase Intelligence Platform

RepoSense is an AI-powered codebase analysis platform that lets developers **upload a repository or paste a GitHub URL**, index the codebase, ask questions about the implementation, and detect potential bugs using AI.

It combines **RAG, code embeddings, vector search, reranking, query rewriting, and LLM-based reasoning** to turn an unfamiliar repository into an interactive AI-readable codebase.

---

## 🚀 Features

* 📦 **ZIP Repository Upload** — Upload and index an entire codebase.
* 🔗 **GitHub URL Scanning** — Paste a public GitHub repository URL and analyze it directly.
* 🔎 **Semantic Code Search** — Find relevant code using natural-language questions.
* 💬 **Conversational Codebase Chat** — Ask follow-up questions while maintaining context.
* 🔄 **Query Rewriting** — Converts contextual follow-up questions into retrieval-friendly queries.
* 🎯 **Reranking** — Improves relevance of retrieved code before LLM generation.
* 🐞 **AI Bug Detection** — Identifies potential bugs with severity, explanation, and suggested fixes.
* 📍 **Source Attribution** — Shows the files/chunks used to generate an answer.
* ⚡ **Latency Tracking** — Measures end-to-end RAG response performance.

---

## 🧠 How It Works

```text
ZIP / GitHub URL
       ↓
Repository Scanner
       ↓
Code Loader
       ↓
Code Chunking
       ↓
Jina Code Embeddings
       ↓
Qdrant Vector Database
       ↓
Semantic Retrieval
       ↓
Relevance Filtering + Reranking
       ↓
Query Rewriting
       ↓
Gemini LLM
       ↓
Grounded Answer + Sources
```

---

## 🔍 RAG Pipeline

When a user asks a question:

```text
User Query
    ↓
Query Rewriting
    ↓
Query Embedding
    ↓
Qdrant Retrieval
    ↓
Relevant Code Chunks
    ↓
Reranking
    ↓
Gemini
    ↓
Answer + Sources
```

Repository IDs are used to ensure that retrieval remains isolated to the selected codebase.

---

## 🐞 Bug Detection

RepoSense can analyze retrieved code for potential issues and return structured findings:

```json
{
  "severity": "HIGH",
  "file_path": "app/example.py",
  "chunk_index": 11,
  "issue": "Potential security vulnerability",
  "explanation": "Input is not sufficiently validated.",
  "suggested_fix": "Validate input before processing."
}
```

Supported severity levels:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

---

## 🏗️ Architecture

```text
                 ┌─────────────────┐
                 │   React UI      │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │    FastAPI      │
                 └────────┬────────┘
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
 Repository           RAG Pipeline      Bug Analysis
 Ingestion                 ↓
        ↓              Qdrant
 Code Processing          ↓
        └────────────→ Gemini
                          ↓
                    AI Response
```

---

## 📊 Current Metrics

Tested on a repository containing:

| Metric              |    Result |
| ------------------- | --------: |
| Files processed     |    **46** |
| Code chunks indexed |   **341** |
| Vectors stored      |   **341** |
| Queries evaluated   |    **11** |
| Average latency     | **~5.2s** |
| Median latency      | **4.73s** |
| Minimum latency     | **2.75s** |
| Maximum latency     | **7.90s** |

Latency represents the end-to-end user-facing RAG pipeline and can vary depending on model response time, hardware, network conditions, and repository size.

---

## 🛠️ Tech Stack

### Backend

* **Python**
* **FastAPI**
* **LangChain**
* **Gemini**
* **Jina Code Embeddings**
* **Qdrant**
* **Cross-Encoder Reranking**
* **Pydantic**
* **Uvicorn**

### Frontend

* **React**
* **JavaScript**
* **Tailwind CSS**
* **Axios**
* **Lucide React**

---

## 📁 Project Structure

```text
RepoSense/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── ingestion/
│   │   ├── chunking/
│   │   ├── embeddings/
│   │   ├── retrieval/
│   │   ├── reranking/
│   │   ├── rag/
│   │   ├── vectorstore/
│   │   ├── bug_detection/
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Upload Repository

```http
POST /repositories/upload
```

Accepts a `.zip` repository.

### Scan GitHub Repository

```http
POST /repositories/scan-url
```

```json
{
  "url": "https://github.com/user/repository.git"
}
```

### Codebase Chat

```http
POST /codeChat/chat
```

```json
{
  "repository_id": "...",
  "query": "How does the RAG pipeline work?"
}
```

### Bug Analysis

```http
POST /bugs/analyze
```

Analyzes the repository for potential bugs.

---

## ⚙️ Setup

### Backend

```bash
git clone <repository-url>
cd RepoSense/backend

python -m venv myenv
myenv\Scripts\activate

pip install -r requirements.txt
```

Create your environment file and configure the required API keys.

Run:

```bash
uvicorn app.main:app --reload
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure the backend URL in the frontend environment file.

---



> **RepoSense — Your Codebase, Understood.**
>
> Ask questions. Trace the logic. Find the bugs.
