---
id: "mixtral-8x7b-instruct"
name: "Mixtral 8x7B Instruct"
provider: "Mistral AI"
releaseDate: "2023-12"
parameters: "47B"
activeParameters: "13B"
contextWindow: 32000
license: "Apache-2.0"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "Low-Latency", "General Assistant"]
sizeInGb: 94
downloads: 526907
likes: 4700
lastUpdated: "2025-07-24"
onyxLeaderboardRank: 0
mmlu: 70.6
humanEval: 50.4
gsm8k: 68.2
vision: 
ollamaId: "mixtral:8x7b"
hfRepo: "mistralai/Mixtral-8x7B-Instruct-v0.1"
vllmId: "mistralai/Mixtral-8x7B-Instruct-v0.1"
runCommand: "ollama run mixtral:8x7b"
---

# Mixtral 8x7B Instruct

The historic pioneer of open Mixture-of-Experts models. Routes tokens dynamically to provide 47B capacity at the latency profile of an active 13B model.

## Pros
- Extremely mature and highly compatible local ecosystem
- Outstanding latency during multi-turn generation
- Apache 2.0 open development license

## Cons
- Lagging benchmarks compared to modern dense models (like Llama 3.1 8B or Phi-4)
- Limited code reasoning bounds on multi-tier functions
