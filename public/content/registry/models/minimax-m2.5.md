---
id: "minimax-m2.5"
name: "MiniMax M2.5"
provider: "MiniMax"
releaseDate: "2026-05"
parameters: "230B"
activeParameters: ""
contextWindow: 131072
license: "MiniMax Developer Agreement"
commercialAllowed: true
primaryUseCases: ["General Assistant", "Low-Latency", "Coding"]
sizeInGb: 460
downloads: 480200
likes: 3200
lastUpdated: "2026-05-20"
onyxLeaderboardRank: 3
mmlu: 89.6
humanEval: 88.4
gsm8k: 91.2
vision: 
ollamaId: "minimax:m2.5"
hfRepo: "minimax/minimax-m2.5-dense"
vllmId: "minimax/minimax-m2.5-dense"
runCommand: "ollama run minimax:m2.5"
---

# MiniMax M2.5

MiniMax's high-throughput 230B dense foundation model. Optimized for ultra-low-latency real-time response generation, high-fidelity conversational agent mechanics, and tool calling.

## Pros
- Superb response speeds (tokens/sec) for real-time agents
- Excellent multi-turn instruction-following and tool selection
- Optimized VRAM profile for direct enterprise nodes

## Cons
- Lower pure reasoning depth compared to 1T models
- Dense architecture requires significant VRAM continuously
