---
id: "kimi-k2.5"
name: "Kimi K2.5"
provider: "Moonshot AI"
releaseDate: "2026-06"
parameters: "1T"
activeParameters: "180B"
contextWindow: 2097152
license: "Moonshot Open License"
commercialAllowed: true
primaryUseCases: ["Reasoning & Math", "General Assistant", "Coding"]
sizeInGb: 2000
downloads: 150800
likes: 4900
lastUpdated: "2026-06-25"
onyxLeaderboardRank: 2
mmlu: 93.8
humanEval: 94.2
gsm8k: 97.4
vision: 
ollamaId: "kimi-k2.5"
hfRepo: "moonshotai/Kimi-K2.5-MoE"
vllmId: "moonshotai/Kimi-K2.5-MoE"
runCommand: "ollama run kimi-k2.5"
---

# Kimi K2.5

Moonshot AI's landmark 1-Trillion parameter open-weights Mixture-of-Experts (MoE) model. Renowned for native infinite-context processing up to 2 million tokens and unmatched multi-turn search/retrieval.

## Pros
- Gigantic 2,000,000 token native context processing
- Elite reasoning and math matching frontier-tier models
- Highly efficient MoE routing with 180B active parameters

## Cons
- Requires massive storage array for 1T weights
- Custom pipeline required for full context retrieval attention
