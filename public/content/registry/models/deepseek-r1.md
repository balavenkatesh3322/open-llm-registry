---
id: "deepseek-r1"
name: "DeepSeek-R1"
provider: "DeepSeek"
releaseDate: "2025-01"
parameters: "671B"
activeParameters: "37B"
contextWindow: 128000
license: "MIT"
commercialAllowed: true
primaryUseCases: ["Reasoning & Math", "Coding", "General Assistant"]
sizeInGb: 1342
downloads: 7483926
likes: 13422
lastUpdated: "2025-03-27"
onyxLeaderboardRank: 4
mmlu: 90.8
humanEval: 92.6
gsm8k: 96.3
vision: 
ollamaId: "deepseek-r1:671b"
hfRepo: "deepseek-ai/DeepSeek-R1"
vllmId: "deepseek-ai/DeepSeek-R1"
runCommand: "ollama run deepseek-r1"
---

# DeepSeek-R1

A revolutionary open-source reasoning model using reinforcement learning. Features chain-of-thought capabilities matching proprietary frontiers in math, code, and complex logical reasoning.

## Pros
- Unmatched open reasoning & math capabilities
- Extremely permissive MIT License
- Cost-efficient mixture-of-experts (MoE) active weights

## Cons
- Huge local memory footprint (671B weights)
- Slower time-to-first-token due to CoT thinking steps
- Requires multi-GPU hardware nodes for full FP16 hosting
