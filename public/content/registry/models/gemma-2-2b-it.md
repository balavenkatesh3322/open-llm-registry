---
id: "gemma-2-2b-it"
name: "Gemma 2 2B IT"
provider: "Google"
releaseDate: "2024-06"
parameters: "2B"
activeParameters: ""
contextWindow: 8192
license: "Gemma License"
commercialAllowed: true
primaryUseCases: ["Local / On-device", "Low-Latency"]
sizeInGb: 4
downloads: 397301
likes: 1406
lastUpdated: "2024-08-27"
onyxLeaderboardRank: 0
mmlu: 63.8
humanEval: 42.1
gsm8k: 67.2
vision: 
ollamaId: "gemma2:2b"
hfRepo: "google/gemma-2-2b-it"
vllmId: "google/gemma-2-2b-it"
runCommand: "ollama run gemma2:2b"
---

# Gemma 2 2B IT

Google's ultra-compact 2B model. Utilizes distiller architectures to punch massive weight on micro-devices, making it ideal for mobile apps or basic edge automation.

## Pros
- Runs flawlessly on mobile, tablets, or Raspberry Pi nodes
- Exceptional performance-to-size metric ratio
- Clean output formatting suitable for structured tagging

## Cons
- Narrow math/code performance ceiling
- Easily sidetracked by long context inputs
