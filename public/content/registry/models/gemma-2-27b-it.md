---
id: "gemma-2-27b-it"
name: "Gemma 2 27B IT"
provider: "Google"
releaseDate: "2024-06"
parameters: "27B"
activeParameters: ""
contextWindow: 8192
license: "Gemma License"
commercialAllowed: true
primaryUseCases: ["General Assistant", "Reasoning & Math", "Coding"]
sizeInGb: 54
downloads: 36542
likes: 567
lastUpdated: "2024-08-27"
onyxLeaderboardRank: 8
mmlu: 81.3
humanEval: 72
gsm8k: 89
vision: 
ollamaId: "gemma2:27b"
hfRepo: "google/gemma-2-27b-it"
vllmId: "google/gemma-2-27b-it"
runCommand: "ollama run gemma2:27b"
---

# Gemma 2 27B IT

Google DeepMind's mid-sized open model. It matches or beats several 70B models in reasoning and conversational quality while requiring less than half the VRAM.

## Pros
- Exceptional price/performance ratio
- Easily fits on a single professional consumer GPU (e.g. RTX 3090/4090 or Mac Studio)
- Highly articulate prose and conversational empathy

## Cons
- Shorter 8k context window
- High attention memory overhead at full precision
