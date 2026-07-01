---
id: "llama-3.2-1b-it"
name: "Llama 3.2 1B Instruct"
provider: "Meta"
releaseDate: "2024-09"
parameters: "1B"
activeParameters: ""
contextWindow: 128000
license: "Llama 3.2 License"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "Low-Latency"]
sizeInGb: 2
downloads: 8583830
likes: 1502
lastUpdated: "2024-10-24"
onyxLeaderboardRank: 0
mmlu: 49.3
humanEval: 31.2
gsm8k: 52.4
vision: 
ollamaId: "llama3.2:1b"
hfRepo: "meta-llama/Llama-3.2-1B-Instruct"
vllmId: "meta-llama/Llama-3.2-1B-Instruct"
runCommand: "ollama run llama3.2:1b"
---

# Llama 3.2 1B Instruct

Meta's absolute smallest LLM. Custom-tuned for micro-latency edge deployment, local text classifications, and rapid low-level orchestrations.

## Pros
- Negligible memory requirement (less than 2GB unquantized)
- Ultra-fast latency suitable for real-time keystroke processing
- Incredible context window size relative to parameter counts

## Cons
- Severely limited deductive reasoning abilities
- Not suitable for any programming or logical problem solving
