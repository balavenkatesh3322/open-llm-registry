---
id: "mistral-nemo-12b"
name: "Mistral Nemo 12B Instruct"
provider: "Mistral AI"
releaseDate: "2024-07"
parameters: "12B"
activeParameters: ""
contextWindow: 128000
license: "Apache-2.0"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "General Assistant", "Low-Latency"]
sizeInGb: 24
downloads: 124381
likes: 1686
lastUpdated: "2025-07-28"
onyxLeaderboardRank: 0
mmlu: 76.8
humanEval: 62.5
gsm8k: 80.1
vision: 
ollamaId: "mistral-nemo"
hfRepo: "mistralai/Mistral-Nemo-Instruct-2407"
vllmId: "mistralai/Mistral-Nemo-Instruct-2407"
runCommand: "ollama run mistral-nemo"
---

# Mistral Nemo 12B Instruct

Jointly developed by Mistral AI and NVIDIA. Features a customized Tekken tokenizer for extreme compression of text across languages, coupled with robust instruction compliance.

## Pros
- Amazing tokenizer efficiency for non-English text
- Highly capable 128k context support
- Excellent developer compliance under Apache-2.0

## Cons
- Noticeable performance drops on pure graduate-level logic
- Requires slightly more RAM/VRAM than standard 8B counterparts
