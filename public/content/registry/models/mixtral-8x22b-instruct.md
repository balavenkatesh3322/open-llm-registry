---
id: "mixtral-8x22b-instruct"
name: "Mixtral 8x22B Instruct"
provider: "Mistral AI"
releaseDate: "2024-04"
parameters: "141B"
activeParameters: "39B"
contextWindow: 64000
license: "Apache-2.0"
commercialAllowed: true
primaryUseCases: ["Reasoning & Math", "Coding", "General Assistant"]
sizeInGb: 282
downloads: 57365
likes: 752
lastUpdated: "2025-07-24"
onyxLeaderboardRank: 0
mmlu: 77.8
humanEval: 71.1
gsm8k: 82.4
vision: 
ollamaId: "mixtral:8x22b"
hfRepo: "mistralai/Mixtral-8x22B-Instruct-v0.1"
vllmId: "mistralai/Mixtral-8x22B-Instruct-v0.1"
runCommand: "ollama run mixtral:8x22b"
---

# Mixtral 8x22B Instruct

Mistral's high-capacity Sparse Mixture of Experts model. Excels at high-volume agentic calculations, mathematics, multilingual instructions, and complex function call stacks.

## Pros
- Apache 2.0 commercial safety
- Highly efficient generation speed through active MoE weights
- Top-tier reasoning and code synthesis

## Cons
- Requires substantial storage space (141B parameters)
- Highly sensitive to temperature calibration for deterministic tasks
