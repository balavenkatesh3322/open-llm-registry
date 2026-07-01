---
id: "gemma-2-9b-it"
name: "Gemma 2 9B IT"
provider: "Google"
releaseDate: "2024-06"
parameters: "9B"
activeParameters: ""
contextWindow: 8192
license: "Gemma License"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "Low-Latency", "General Assistant"]
sizeInGb: 18
downloads: 317025
likes: 832
lastUpdated: "2024-08-27"
onyxLeaderboardRank: 0
mmlu: 75.3
humanEval: 62.2
gsm8k: 84.1
vision: 
ollamaId: "gemma2:9b"
hfRepo: "google/gemma-2-9b-it"
vllmId: "google/gemma-2-9b-it"
runCommand: "ollama run gemma2:9b"
---

# Gemma 2 9B IT

Built by Google DeepMind with a unique sliding window attention and logit soft-capping design. It punches far above its weight class, outperforming many 13B-20B models.

## Pros
- Blazing fast generation speeds locally
- Exceptional conversational and structured formatting capability
- Excellent for edge/mobile device experimentation

## Cons
- 8k context limit is restrictive for large RAG document processing
- Requires careful prompt engineering to prevent refusal behavior
