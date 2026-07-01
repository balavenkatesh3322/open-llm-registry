---
id: "glm-4-9b-chat"
name: "GLM-4 9B Chat"
provider: "Zhipu AI"
releaseDate: "2024-06"
parameters: "9B"
activeParameters: ""
contextWindow: 128000
license: "GLM-4 License"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "General Assistant", "Reasoning & Math"]
sizeInGb: 18
downloads: 58881
likes: 707
lastUpdated: "2025-03-13"
onyxLeaderboardRank: 0
mmlu: 72.4
humanEval: 71.3
gsm8k: 79.6
vision: 
ollamaId: "glm4:9b"
hfRepo: "THUDM/glm-4-9b-chat"
vllmId: "THUDM/glm-4-9b-chat"
runCommand: "ollama run glm4:9b"
---

# GLM-4 9B Chat

A powerful open bilingual (Chinese & English) chat model by Zhipu AI. Built with advanced training techniques, it excels in tool-use, multi-turn dialogue, and offers a massive 128K context window with high accuracy retrieval.

## Pros
- Top-tier Chinese-English bilingual instruction following
- Native function calling and complex agent tools use support
- Fits comfortably on consumer hardware with 4-bit or 8-bit quantization

## Cons
- Lower coding performance compared to specialized coder models
- High-attention compute footprint at extreme context boundaries
