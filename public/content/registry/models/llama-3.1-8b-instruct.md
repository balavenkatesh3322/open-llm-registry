---
id: "llama-3.1-8b-instruct"
name: "Llama 3.1 8B Instruct"
provider: "Meta"
releaseDate: "2024-07"
parameters: "8B"
activeParameters: ""
contextWindow: 128000
license: "Llama 3.1 License"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "Low-Latency", "General Assistant"]
sizeInGb: 16
downloads: 10008529
likes: 6181
lastUpdated: "2024-09-25"
onyxLeaderboardRank: 0
mmlu: 68.4
humanEval: 72.6
gsm8k: 82.3
vision: 
ollamaId: "llama3.1:8b"
hfRepo: "meta-llama/Llama-3.1-8B-Instruct"
vllmId: "meta-llama/Llama-3.1-8B-Instruct"
runCommand: "ollama run llama3.1"
---

# Llama 3.1 8B Instruct

The standard-bearer for compact, accessible LLMs. Meta's highly optimized 8B model offers a huge 128k context and serves as a premier foundation for local systems.

## Pros
- Incredible performance in an incredibly lightweight format
- Runs blazing fast on standard consumer laptops (M-series Macs, RTX cards)
- 128k context is unmatched for this class

## Cons
- Prone to reasoning limitations on nested code logic
- Reduced factual retention on niche long-tail queries
