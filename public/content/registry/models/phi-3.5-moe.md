---
id: "phi-3.5-moe"
name: "Phi-3.5 MoE Instruct"
provider: "Microsoft"
releaseDate: "2024-08"
parameters: "42B"
activeParameters: "6.6B"
contextWindow: 128000
license: "MIT"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "Low-Latency", "General Assistant"]
sizeInGb: 84
downloads: 140556
likes: 574
lastUpdated: "2025-12-10"
onyxLeaderboardRank: 0
mmlu: 78.9
humanEval: 71.8
gsm8k: 83.5
vision: 
ollamaId: "phi3.5-moe"
hfRepo: "microsoft/Phi-3.5-MoE-instruct"
vllmId: "microsoft/Phi-3.5-MoE-instruct"
runCommand: "ollama run phi3.5-moe"
---

# Phi-3.5 MoE Instruct

Microsoft's sparse Mixture-of-Experts (MoE) entry. Actively routes tokens to sub-networks to achieve 42B quality while executing with the speed and footprint of a 6.6B model.

## Pros
- Superb generation speeds from active parameters
- Large 128k context length with high retrieval parity
- Excellent multilingual logic performance

## Cons
- Requires substantial storage space (42B base size)
- Quantization needs specialized attention to avoid outlier decay
