---
id: "deepseek-v3"
name: "DeepSeek-V3"
provider: "DeepSeek"
releaseDate: "2024-12"
parameters: "671B"
activeParameters: "37B"
contextWindow: 128000
license: "MIT"
commercialAllowed: true
primaryUseCases: ["General Assistant", "Coding", "Low-Latency"]
sizeInGb: 1342
downloads: 1118088
likes: 4092
lastUpdated: "2025-03-27"
onyxLeaderboardRank: 4
mmlu: 88.5
humanEval: 82.6
gsm8k: 90.2
vision: 
ollamaId: "deepseek-v3"
hfRepo: "deepseek-ai/DeepSeek-V3"
vllmId: "deepseek-ai/DeepSeek-V3"
runCommand: "ollama run deepseek-v3"
---

# DeepSeek-V3

A powerful Mixture-of-Experts (MoE) model. Standardized on Multi-head Latent Attention (MLA) and DeepSeekMoE architectures, providing extreme speed and quality.

## Pros
- Excellent general knowledge and reasoning
- Super cost-effective active weights for serving speeds
- Fully permissive MIT license

## Cons
- Massive disk requirements for storing the base 671B weights
- Requires advanced clustering techniques to host locally
