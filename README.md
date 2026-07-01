# OpenLLM Index — Community-Driven Open-Source LLM Directory

![OpenLLM Index Banner](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop&blur=1)

Welcome to the **OpenLLM Index**! This is a developer-first, visual directory, comparative ledger, and local hardware VRAM calculator for open-source Large Language Models (LLMs).

---

## ⚡ Markdown-First Architecture

Unlike traditional platforms that rely on cumbersome databases, complex server-side APIs, or hardcoded frontends, the **OpenLLM Index is 100% markdown-driven**. 

All data — including home page copy, tutorial guides, and LLM registry metadata — is parsed dynamically at runtime from structured markdown files. Contributors can add models, tweak benchmarks, or alter copy by submitting simple **Pull Requests** directly on GitHub. Once a PR is merged, the static deployment pipeline builds and deploys the update immediately.

```
                  ┌──────────────────────────────┐
                  │   Contributor submits PR     │
                  │   modifying Markdown file    │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │    GitHub Action / CI        │
                  │    compiles & validates      │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │    Static Website Rebuild    │
                  │    (Vite / Github Pages)     │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │  Users see instant updates   │
                  │  directly in their browser   │
                  └──────────────────────────────┘
```

---

## 📁 Folder Structure & Page Content Organization

To keep files organized and modular, all dynamic markdown files are categorized under `public/content/`. This keeps the application layout clean and decouples static marketing content from core application logic.

```bash
public/content/
├── pages/
│   └── home.md               # Hero title, badges, action links, and education guides
└── registry/
    ├── index.md              # Main manifest index indexing active models
    └── models/
        ├── deepseek-r1.md    # Detail files for each model (frontmatter + body)
        ├── llama-3.3-70b.md
        └── qwen-2.5-coder.md
```

### 1. Home Page Configuration (`/public/content/pages/home.md`)
You can adjust the landing page's main titles, badge text, and the structural educational blocks at the footer by editing the frontmatter keys inside this file:

```yaml
---
heroBadge: "100% COMPATIBLE WITH OLLAMA, VLLM & HUGGING FACE"
heroTitle: "Discover & Deploy the Perfect Open-Source LLMs In Seconds"
heroDescription: "Avoid catalog fatigue..."
guides:
  - id: "quantization"
    title: "How to choose quantization?"
    icon: "TrendingUp"
    description: "**Q4_K_M** is the gold standard..."
---
```

### 2. Registry Index Manifest (`/public/content/registry/index.md`)
This file holds a JSON array in its markdown body representing the active models listed on the explore page. To display or hide a model, simply add or remove its entry here:

```markdown
# Registered Models List

```json
[
  { "id": "deepseek-r1", "file": "./models/deepseek-r1.md" },
  { "id": "llama-3.3-70b-instruct", "file": "./models/llama-3.3-70b-instruct.md" }
]
```
```

---

## ✍️ How to Submit a Pull Request (PR)

We welcome model submissions, benchmark corrections, and documentation improvements! Follow these simple steps to contribute:

### Step 1: Fork & Clone the Repository
Fork the official repository and clone it to your local machine:
```bash
git clone https://github.com/your-username/openllm-index.git
cd openllm-index
```

### Step 2: Install Local Dependencies & Run Dev Server
Ensure your environment matches the build targets:
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to preview the site locally as you make edits.

### Step 3: Create a Markdown File for Your Model
Add a new markdown file named after your model under `/public/content/registry/models/your-model-id.md`. Follow this structured schema exactly:

```markdown
---
id: "qwen-2.5-coder-32b"
name: "Qwen 2.5 Coder 32B Instruct"
provider: "Alibaba"
releaseDate: "2024-11"
parameters: "32.5B"
activeParameters: ""
contextWindow: 128000
license: "Apache-2.0"
commercialAllowed: true
primaryUseCases: ["Coding", "Reasoning & Math"]
sizeInGb: 65
downloads: 4120300
likes: 8329
lastUpdated: "2025-02-15"
onyxLeaderboardRank: 4
mmlu: 82.4
humanEval: 91.5
gsm8k: 88.9
vision: 0
ollamaId: "qwen2.5-coder:32b"
hfRepo: "Qwen/Qwen2.5-Coder-32B-Instruct"
vllmId: "Qwen/Qwen2.5-Coder-32B-Instruct"
runCommand: "ollama run qwen2.5-coder:32b"
---

# Qwen 2.5 Coder 32B Instruct

Alibaba's premier open-weights model fine-tuned specifically for coding workflows, multi-language code generation, bug fixing, and mathematical problem-solving.

## Pros
- Outstanding performance across 40+ programming languages
- Matches proprietary models on HumanEval benchmarks
- Generous 128K context window for long-file parsing

## Cons
- Requires substantial local memory (VRAM) for 16-bit processing
- Slightly less creative for non-technical prose generation
```

### Step 4: Register the Model in the Manifest
Open `/public/content/registry/index.md` and add your model's ID and file path to the JSON block:
```json
  { "id": "qwen-2.5-coder-32b", "file": "./models/qwen-2.5-coder-32b.md" }
```

### Step 5: Test and Lint
Before pushing your changes, run the linter and typescript checks to prevent compilation issues:
```bash
npm run lint
npm run build
```

### Step 6: Commit and Push
```bash
git checkout -b add-model-qwen-coder
git add .
git commit -m "feat: add Qwen 2.5 Coder 32B markdown and manifest entry"
git push origin add-model-qwen-coder
```

Open a Pull Request on GitHub and describe your addition. Once verified, the team will review and merge it.

---

## 🤝 Community & Discussion Channels

Get involved with other developers, model authors, and researchers in our ecosystem:

-   💬 **GitHub Discussions**: Share templates, discuss local hosting architectures, or request help with hardware requirements.
-   🐛 **Issue Tracker**: Found an incorrect benchmark metric? Open a standard bug ticket or submit a quick patch PR!
-   🌐 **Ollama & vLLM Forums**: Share your integration blueprints, customized quantization setups, or benchmark score curves.

*OpenLLM Index is maintained entirely by the open-weights community. Thank you for making open-source models accessible to everyone!*
