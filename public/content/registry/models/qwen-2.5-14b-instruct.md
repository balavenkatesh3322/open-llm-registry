---
id: "qwen-2.5-14b-instruct"
name: "Qwen 2.5 14B Instruct"
provider: "Alibaba Qwen"
releaseDate: "2024-09"
parameters: "14B"
activeParameters: ""
contextWindow: 128000
license: "Apache-2.0"
commercialAllowed: true
primaryUseCases: ["General Assistant", "Local / On-device", "Reasoning & Math"]
sizeInGb: 28
downloads: 2124618
likes: 351
lastUpdated: "2024-09-25"
onyxLeaderboardRank: 10
mmlu: 79.8
humanEval: 78.4
gsm8k: 85.3
vision: 
ollamaId: "qwen2.5:14b"
hfRepo: "Qwen/Qwen2.5-14B-Instruct"
vllmId: "Qwen/Qwen2.5-14B-Instruct"
runCommand: "ollama run qwen2.5:14b"
---

# Qwen 2.5 14B Instruct

The gold-standard mid-sized model from Alibaba. Provides high accuracy for reasoning, multilingual conversation, and general utility while fitting on a wider selection of developer systems.

## Pros
- Great balance between size, speed, and precision
- Apache 2.0 license and rich multilingual support
- Excellent agent framework compatibilities

## Cons
- Lower single-shot math accuracy compared to reasoning models
- High-density token throughput requires some VRAM headroom
