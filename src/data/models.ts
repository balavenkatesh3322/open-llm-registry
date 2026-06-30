export interface ModelMetadata {
  id: string;
  name: string;
  provider: 'Meta' | 'Google' | 'Microsoft' | 'DeepSeek' | 'Mistral AI' | 'Alibaba Qwen' | 'Cohere' | 'Zhipu AI' | 'Moonshot AI' | 'MiniMax';
  releaseDate: string;
  description: string;
  parameters: string;
  activeParameters?: string;
  contextWindow: number;
  license: string;
  commercialAllowed: boolean;
  primaryUseCases: ('Coding' | 'General Assistant' | 'Reasoning & Math' | 'Multimodal / Vision' | 'Local / On-device' | 'Low-Latency')[];
  benchmarks: {
    mmlu: number;      // General knowledge (%)
    humanEval: number; // Coding (%)
    gsm8k: number;     // Math (%)
    vision?: number;   // Visual Reasoning (%), optional
  };
  deployment: {
    ollamaId: string;
    hfRepo: string;
    vllmId: string;
    runCommand: string;
  };
  pros: string[];
  cons: string[];
  sizeInGb: number; // Size of weights in FP16 (approx 2 * param count)
  downloads?: number;  // Live Hugging Face download count
  likes?: number;      // Live Hugging Face likes
  lastUpdated?: string; // Last updated timestamp
  onyxLeaderboardRank?: number; // Rank on the Onyx Open LLM Leaderboard
}

export const OPEN_SOURCE_MODELS: ModelMetadata[] = [
  {
    "id": "glm-5",
    "name": "GLM-5",
    "provider": "Zhipu AI",
    "releaseDate": "2026-05",
    "description": "Zhipu AI's next-generation multimodal bilingual foundation model with 744B parameters. Sets new records for cross-lingual understanding, reasoning, and visual-agent instructions.",
    "parameters": "744B",
    "contextWindow": 262144,
    "license": "GLM-5 Open License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Reasoning & Math",
      "Multimodal / Vision",
      "Coding"
    ],
    "benchmarks": {
      "mmlu": 92.4,
      "humanEval": 91.5,
      "gsm8k": 95.8,
      "vision": 89.2
    },
    "deployment": {
      "ollamaId": "glm5:744b",
      "hfRepo": "THUDM/glm-5-744b",
      "vllmId": "THUDM/glm-5-744b",
      "runCommand": "ollama run glm5:744b"
    },
    "pros": [
      "State-of-the-art bilingual reasoning and agent instructions",
      "Extremely long 256K token context window support",
      "Outstanding vision grounding and multi-turn audio integration"
    ],
    "cons": [
      "Massive hardware requirement (744B parameters)",
      "Requires complex distributed setup across multiple H100 nodes"
    ],
    "sizeInGb": 1488,
    "downloads": 320500,
    "likes": 5400,
    "lastUpdated": "2026-06-15",
    "onyxLeaderboardRank": 1
  },
  {
    "id": "kimi-k2.5",
    "name": "Kimi K2.5",
    "provider": "Moonshot AI",
    "releaseDate": "2026-06",
    "description": "Moonshot AI's landmark 1-Trillion parameter open-weights Mixture-of-Experts (MoE) model. Renowned for native infinite-context processing up to 2 million tokens and unmatched multi-turn search/retrieval.",
    "parameters": "1T",
    "activeParameters": "180B",
    "contextWindow": 2097152,
    "license": "Moonshot Open License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Reasoning & Math",
      "General Assistant",
      "Coding"
    ],
    "benchmarks": {
      "mmlu": 93.8,
      "humanEval": 94.2,
      "gsm8k": 97.4
    },
    "deployment": {
      "ollamaId": "kimi-k2.5",
      "hfRepo": "moonshotai/Kimi-K2.5-MoE",
      "vllmId": "moonshotai/Kimi-K2.5-MoE",
      "runCommand": "ollama run kimi-k2.5"
    },
    "pros": [
      "Gigantic 2,000,000 token native context processing",
      "Elite reasoning and math matching frontier-tier models",
      "Highly efficient MoE routing with 180B active parameters"
    ],
    "cons": [
      "Requires massive storage array for 1T weights",
      "Custom pipeline required for full context retrieval attention"
    ],
    "sizeInGb": 2000,
    "downloads": 150800,
    "likes": 4900,
    "lastUpdated": "2026-06-25",
    "onyxLeaderboardRank": 2
  },
  {
    "id": "minimax-m2.5",
    "name": "MiniMax M2.5",
    "provider": "MiniMax",
    "releaseDate": "2026-05",
    "description": "MiniMax's high-throughput 230B dense foundation model. Optimized for ultra-low-latency real-time response generation, high-fidelity conversational agent mechanics, and tool calling.",
    "parameters": "230B",
    "contextWindow": 131072,
    "license": "MiniMax Developer Agreement",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Low-Latency",
      "Coding"
    ],
    "benchmarks": {
      "mmlu": 89.6,
      "humanEval": 88.4,
      "gsm8k": 91.2
    },
    "deployment": {
      "ollamaId": "minimax:m2.5",
      "hfRepo": "minimax/minimax-m2.5-dense",
      "vllmId": "minimax/minimax-m2.5-dense",
      "runCommand": "ollama run minimax:m2.5"
    },
    "pros": [
      "Superb response speeds (tokens/sec) for real-time agents",
      "Excellent multi-turn instruction-following and tool selection",
      "Optimized VRAM profile for direct enterprise nodes"
    ],
    "cons": [
      "Lower pure reasoning depth compared to 1T models",
      "Dense architecture requires significant VRAM continuously"
    ],
    "sizeInGb": 460,
    "downloads": 480200,
    "likes": 3200,
    "lastUpdated": "2026-05-20",
    "onyxLeaderboardRank": 3
  },
  {
    "id": "deepseek-r1",
    "name": "DeepSeek-R1",
    "provider": "DeepSeek",
    "releaseDate": "2025-01",
    "description": "A revolutionary open-source reasoning model using reinforcement learning. Features chain-of-thought capabilities matching proprietary frontiers in math, code, and complex logical reasoning.",
    "parameters": "671B",
    "activeParameters": "37B",
    "contextWindow": 128000,
    "license": "MIT",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Reasoning & Math",
      "Coding",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 90.8,
      "humanEval": 92.6,
      "gsm8k": 96.3
    },
    "deployment": {
      "ollamaId": "deepseek-r1:671b",
      "hfRepo": "deepseek-ai/DeepSeek-R1",
      "vllmId": "deepseek-ai/DeepSeek-R1",
      "runCommand": "ollama run deepseek-r1"
    },
    "pros": [
      "Unmatched open reasoning & math capabilities",
      "Extremely permissive MIT License",
      "Cost-efficient mixture-of-experts (MoE) active weights"
    ],
    "cons": [
      "Huge local memory footprint (671B weights)",
      "Slower time-to-first-token due to CoT thinking steps",
      "Requires multi-GPU hardware nodes for full FP16 hosting"
    ],
    "sizeInGb": 1342,
    "downloads": 7483926,
    "likes": 13422,
    "lastUpdated": "2025-03-27",
    "onyxLeaderboardRank": 4
  },
  {
    "id": "deepseek-v3",
    "name": "DeepSeek-V3",
    "provider": "DeepSeek",
    "releaseDate": "2024-12",
    "description": "A powerful Mixture-of-Experts (MoE) model. Standardized on Multi-head Latent Attention (MLA) and DeepSeekMoE architectures, providing extreme speed and quality.",
    "parameters": "671B",
    "activeParameters": "37B",
    "contextWindow": 128000,
    "license": "MIT",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Coding",
      "Low-Latency"
    ],
    "benchmarks": {
      "mmlu": 88.5,
      "humanEval": 82.6,
      "gsm8k": 90.2
    },
    "deployment": {
      "ollamaId": "deepseek-v3",
      "hfRepo": "deepseek-ai/DeepSeek-V3",
      "vllmId": "deepseek-ai/DeepSeek-V3",
      "runCommand": "ollama run deepseek-v3"
    },
    "pros": [
      "Excellent general knowledge and reasoning",
      "Super cost-effective active weights for serving speeds",
      "Fully permissive MIT license"
    ],
    "cons": [
      "Massive disk requirements for storing the base 671B weights",
      "Requires advanced clustering techniques to host locally"
    ],
    "sizeInGb": 1342,
    "downloads": 1118088,
    "likes": 4092,
    "lastUpdated": "2025-03-27",
    "onyxLeaderboardRank": 4
  },
  {
    "id": "llama-3.3-70b-instruct",
    "name": "Llama 3.3 70B Instruct",
    "provider": "Meta",
    "releaseDate": "2024-12",
    "description": "Meta's state-of-the-art 70B model, delivering industry-leading performance for agentic workflows, complex reasoning, and structured data extraction.",
    "parameters": "70B",
    "contextWindow": 128000,
    "license": "Llama 3.3 License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Coding",
      "Reasoning & Math"
    ],
    "benchmarks": {
      "mmlu": 88.6,
      "humanEval": 84.8,
      "gsm8k": 93.4
    },
    "deployment": {
      "ollamaId": "llama3.3:70b",
      "hfRepo": "meta-llama/Llama-3.3-70B-Instruct",
      "vllmId": "meta-llama/Llama-3.3-70B-Instruct",
      "runCommand": "ollama run llama3.3"
    },
    "pros": [
      "Industry benchmark standard for agent workflows",
      "Massive 128k context length with high retrieval fidelity",
      "Excellent tool use and function calling"
    ],
    "cons": [
      "Requires substantial compute (minimum single 48GB VRAM or dual 24GB GPUs)",
      "Custom license with active-user restriction (>700M MAU)"
    ],
    "sizeInGb": 140,
    "downloads": 712448,
    "likes": 2863,
    "lastUpdated": "2024-12-21",
    "onyxLeaderboardRank": 3
  },
  {
    "id": "llama-3.1-405b-instruct",
    "name": "Llama 3.1 405B Instruct",
    "provider": "Meta",
    "releaseDate": "2024-07",
    "description": "The heavyweight flagship of open weights. Delivers massive reasoning, multilingual synthesis, and synthetic dataset generation capabilities designed to benchmark industry developments.",
    "parameters": "405B",
    "contextWindow": 128000,
    "license": "Llama 3.1 License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Reasoning & Math",
      "Coding"
    ],
    "benchmarks": {
      "mmlu": 90.1,
      "humanEval": 89,
      "gsm8k": 95.2
    },
    "deployment": {
      "ollamaId": "llama3.1:405b",
      "hfRepo": "meta-llama/Llama-3.1-405B-Instruct",
      "vllmId": "meta-llama/Llama-3.1-405B-Instruct",
      "runCommand": "ollama run llama3.1:405b"
    },
    "pros": [
      "Superlative general knowledge and complex instruction following",
      "Capable of distilling and training smaller custom LLMs",
      "Enormous cross-lingual vocabulary support"
    ],
    "cons": [
      "Requires a massive cluster of GPUs (minimum 8x 80GB VRAM nodes) for real-time hosting",
      "High-latency without heavy enterprise parallelization setups"
    ],
    "sizeInGb": 810,
    "downloads": 206825,
    "likes": 596,
    "lastUpdated": "2024-09-25",
    "onyxLeaderboardRank": 2
  },
  {
    "id": "llama-3.1-70b-instruct",
    "name": "Llama 3.1 70B Instruct",
    "provider": "Meta",
    "releaseDate": "2024-07",
    "description": "Meta's robust 70B model with the Llama 3.1 pipeline. Highly capable for enterprise workloads, agent orchestration, and complex reasoning.",
    "parameters": "70B",
    "contextWindow": 128000,
    "license": "Llama 3.1 License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Coding",
      "Reasoning & Math"
    ],
    "benchmarks": {
      "mmlu": 86,
      "humanEval": 80.5,
      "gsm8k": 91.2
    },
    "deployment": {
      "ollamaId": "llama3.1:70b",
      "hfRepo": "meta-llama/Llama-3.1-70B-Instruct",
      "vllmId": "meta-llama/Llama-3.1-70B-Instruct",
      "runCommand": "ollama run llama3.1:70b"
    },
    "pros": [
      "Highly stable and verified industry standard",
      "Robust tool use and system instruction compliance",
      "Fully compatible across all local platforms"
    ],
    "cons": [
      "Slightly lower math scores than the newer Llama 3.3",
      "Significant VRAM requirements for local deployments"
    ],
    "sizeInGb": 140,
    "downloads": 737626,
    "likes": 927,
    "lastUpdated": "2024-12-15"
  },
  {
    "id": "llama-3.1-8b-instruct",
    "name": "Llama 3.1 8B Instruct",
    "provider": "Meta",
    "releaseDate": "2024-07",
    "description": "The standard-bearer for compact, accessible LLMs. Meta's highly optimized 8B model offers a huge 128k context and serves as a premier foundation for local systems.",
    "parameters": "8B",
    "contextWindow": 128000,
    "license": "Llama 3.1 License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 68.4,
      "humanEval": 72.6,
      "gsm8k": 82.3
    },
    "deployment": {
      "ollamaId": "llama3.1:8b",
      "hfRepo": "meta-llama/Llama-3.1-8B-Instruct",
      "vllmId": "meta-llama/Llama-3.1-8B-Instruct",
      "runCommand": "ollama run llama3.1"
    },
    "pros": [
      "Incredible performance in an incredibly lightweight format",
      "Runs blazing fast on standard consumer laptops (M-series Macs, RTX cards)",
      "128k context is unmatched for this class"
    ],
    "cons": [
      "Prone to reasoning limitations on nested code logic",
      "Reduced factual retention on niche long-tail queries"
    ],
    "sizeInGb": 16,
    "downloads": 10008529,
    "likes": 6181,
    "lastUpdated": "2024-09-25"
  },
  {
    "id": "qwen-2.5-72b-instruct",
    "name": "Qwen 2.5 72B Instruct",
    "provider": "Alibaba Qwen",
    "releaseDate": "2024-09",
    "description": "Alibaba's ultimate general-purpose model. Excels across multilingual tasks, coding, agent tools, and creative text orchestration, standing as a primary rival to Llama 3.3.",
    "parameters": "72B",
    "contextWindow": 128000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Coding",
      "Reasoning & Math"
    ],
    "benchmarks": {
      "mmlu": 85.3,
      "humanEval": 83.5,
      "gsm8k": 91.8
    },
    "deployment": {
      "ollamaId": "qwen2.5:72b",
      "hfRepo": "Qwen/Qwen2.5-72B-Instruct",
      "vllmId": "Qwen/Qwen2.5-72B-Instruct",
      "runCommand": "ollama run qwen2.5:72b"
    },
    "pros": [
      "Completely permissive Apache 2.0 commercial licensing",
      "Superb multilingual and Asian language mastery",
      "Extremely stable structured JSON output generator"
    ],
    "cons": [
      "Requires substantial local compute or multi-GPU setup",
      "Can occasionally generate Chinese text tags if system prompt isn't rigid"
    ],
    "sizeInGb": 144,
    "downloads": 637646,
    "likes": 959,
    "lastUpdated": "2025-01-12",
    "onyxLeaderboardRank": 5
  },
  {
    "id": "qwen-2.5-coder-32b",
    "name": "Qwen 2.5 Coder 32B Instruct",
    "provider": "Alibaba Qwen",
    "releaseDate": "2024-11",
    "description": "The reigning open-source coding specialist. Capable of complex multi-file software engineering, code generation, debugging, and system scripting across 40+ programming languages.",
    "parameters": "32B",
    "contextWindow": 128000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Coding",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 83.1,
      "humanEval": 91.5,
      "gsm8k": 88.9
    },
    "deployment": {
      "ollamaId": "qwen2.5-coder:32b",
      "hfRepo": "Qwen/Qwen2.5-Coder-32B-Instruct",
      "vllmId": "Qwen/Qwen2.5-Coder-32B-Instruct",
      "runCommand": "ollama run qwen2.5-coder:32b"
    },
    "pros": [
      "Coding capability rivaling GPT-4o at a fraction of the size",
      "Completely open Apache 2.0 license",
      "Excellent code explanation and multi-file project refactoring"
    ],
    "cons": [
      "Narrower performance on heavy creative writing / humanities",
      "Slightly lower math benchmark than specialized reasoning models"
    ],
    "sizeInGb": 64,
    "downloads": 1474623,
    "likes": 2060,
    "lastUpdated": "2025-01-12",
    "onyxLeaderboardRank": 7
  },
  {
    "id": "qwen-2.5-14b-instruct",
    "name": "Qwen 2.5 14B Instruct",
    "provider": "Alibaba Qwen",
    "releaseDate": "2024-09",
    "description": "The gold-standard mid-sized model from Alibaba. Provides high accuracy for reasoning, multilingual conversation, and general utility while fitting on a wider selection of developer systems.",
    "parameters": "14B",
    "contextWindow": 128000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Local / On-device",
      "Reasoning & Math"
    ],
    "benchmarks": {
      "mmlu": 79.8,
      "humanEval": 78.4,
      "gsm8k": 85.3
    },
    "deployment": {
      "ollamaId": "qwen2.5:14b",
      "hfRepo": "Qwen/Qwen2.5-14B-Instruct",
      "vllmId": "Qwen/Qwen2.5-14B-Instruct",
      "runCommand": "ollama run qwen2.5:14b"
    },
    "pros": [
      "Great balance between size, speed, and precision",
      "Apache 2.0 license and rich multilingual support",
      "Excellent agent framework compatibilities"
    ],
    "cons": [
      "Lower single-shot math accuracy compared to reasoning models",
      "High-density token throughput requires some VRAM headroom"
    ],
    "sizeInGb": 28,
    "downloads": 2124618,
    "likes": 351,
    "lastUpdated": "2024-09-25",
    "onyxLeaderboardRank": 10
  },
  {
    "id": "qwen-2.5-coder-7b",
    "name": "Qwen 2.5 Coder 7B Instruct",
    "provider": "Alibaba Qwen",
    "releaseDate": "2024-11",
    "description": "An elite on-device coding companion. Packs state-of-the-art coding and debugging capabilities into a tight 7B size that runs locally with extreme speeds.",
    "parameters": "7B",
    "contextWindow": 128000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Coding",
      "Local / On-device",
      "Low-Latency"
    ],
    "benchmarks": {
      "mmlu": 71.5,
      "humanEval": 85.4,
      "gsm8k": 78.2
    },
    "deployment": {
      "ollamaId": "qwen2.5-coder:7b",
      "hfRepo": "Qwen/Qwen2.5-Coder-7B-Instruct",
      "vllmId": "Qwen/Qwen2.5-Coder-7B-Instruct",
      "runCommand": "ollama run qwen2.5-coder:7b"
    },
    "pros": [
      "Outstanding coding benchmarks for a 7B model",
      "Permissive commercial license (Apache 2.0)",
      "Sub-second token latency on modern developer workstations"
    ],
    "cons": [
      "Limited creative or non-code text capability",
      "Context windows at extreme depth require memory optimization techniques"
    ],
    "sizeInGb": 14,
    "downloads": 1935745,
    "likes": 744,
    "lastUpdated": "2025-01-12"
  },
  {
    "id": "qwen-2.5-7b-instruct",
    "name": "Qwen 2.5 7B Instruct",
    "provider": "Alibaba Qwen",
    "releaseDate": "2024-09",
    "description": "Alibaba's highly capable 7B general-purpose model, perfect for standard offline chat, structuring text, and task parsing on consumer edge systems.",
    "parameters": "7B",
    "contextWindow": 128000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 74.2,
      "humanEval": 71.8,
      "gsm8k": 81.2
    },
    "deployment": {
      "ollamaId": "qwen2.5:7b",
      "hfRepo": "Qwen/Qwen2.5-7B-Instruct",
      "vllmId": "Qwen/Qwen2.5-7B-Instruct",
      "runCommand": "ollama run qwen2.5:7b"
    },
    "pros": [
      "High instruction-following accuracy in a compact format",
      "Apache 2.0 open distribution license",
      "Extremely versatile multilingual translation"
    ],
    "cons": [
      "Prone to standard logical constraints of 7B networks",
      "CoT capability is highly abbreviated"
    ],
    "sizeInGb": 14,
    "downloads": 12723410,
    "likes": 1391,
    "lastUpdated": "2025-01-12"
  },
  {
    "id": "gemma-2-27b-it",
    "name": "Gemma 2 27B IT",
    "provider": "Google",
    "releaseDate": "2024-06",
    "description": "Google DeepMind's mid-sized open model. It matches or beats several 70B models in reasoning and conversational quality while requiring less than half the VRAM.",
    "parameters": "27B",
    "contextWindow": 8192,
    "license": "Gemma License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Reasoning & Math",
      "Coding"
    ],
    "benchmarks": {
      "mmlu": 81.3,
      "humanEval": 72,
      "gsm8k": 89
    },
    "deployment": {
      "ollamaId": "gemma2:27b",
      "hfRepo": "google/gemma-2-27b-it",
      "vllmId": "google/gemma-2-27b-it",
      "runCommand": "ollama run gemma2:27b"
    },
    "pros": [
      "Exceptional price/performance ratio",
      "Easily fits on a single professional consumer GPU (e.g. RTX 3090/4090 or Mac Studio)",
      "Highly articulate prose and conversational empathy"
    ],
    "cons": [
      "Shorter 8k context window",
      "High attention memory overhead at full precision"
    ],
    "sizeInGb": 54,
    "downloads": 36542,
    "likes": 567,
    "lastUpdated": "2024-08-27",
    "onyxLeaderboardRank": 8
  },
  {
    "id": "gemma-2-9b-it",
    "name": "Gemma 2 9B IT",
    "provider": "Google",
    "releaseDate": "2024-06",
    "description": "Built by Google DeepMind with a unique sliding window attention and logit soft-capping design. It punches far above its weight class, outperforming many 13B-20B models.",
    "parameters": "9B",
    "contextWindow": 8192,
    "license": "Gemma License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 75.3,
      "humanEval": 62.2,
      "gsm8k": 84.1
    },
    "deployment": {
      "ollamaId": "gemma2:9b",
      "hfRepo": "google/gemma-2-9b-it",
      "vllmId": "google/gemma-2-9b-it",
      "runCommand": "ollama run gemma2:9b"
    },
    "pros": [
      "Blazing fast generation speeds locally",
      "Exceptional conversational and structured formatting capability",
      "Excellent for edge/mobile device experimentation"
    ],
    "cons": [
      "8k context limit is restrictive for large RAG document processing",
      "Requires careful prompt engineering to prevent refusal behavior"
    ],
    "sizeInGb": 18,
    "downloads": 317025,
    "likes": 832,
    "lastUpdated": "2024-08-27"
  },
  {
    "id": "gemma-2-2b-it",
    "name": "Gemma 2 2B IT",
    "provider": "Google",
    "releaseDate": "2024-06",
    "description": "Google's ultra-compact 2B model. Utilizes distiller architectures to punch massive weight on micro-devices, making it ideal for mobile apps or basic edge automation.",
    "parameters": "2B",
    "contextWindow": 8192,
    "license": "Gemma License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency"
    ],
    "benchmarks": {
      "mmlu": 63.8,
      "humanEval": 42.1,
      "gsm8k": 67.2
    },
    "deployment": {
      "ollamaId": "gemma2:2b",
      "hfRepo": "google/gemma-2-2b-it",
      "vllmId": "google/gemma-2-2b-it",
      "runCommand": "ollama run gemma2:2b"
    },
    "pros": [
      "Runs flawlessly on mobile, tablets, or Raspberry Pi nodes",
      "Exceptional performance-to-size metric ratio",
      "Clean output formatting suitable for structured tagging"
    ],
    "cons": [
      "Narrow math/code performance ceiling",
      "Easily sidetracked by long context inputs"
    ],
    "sizeInGb": 4,
    "downloads": 397301,
    "likes": 1406,
    "lastUpdated": "2024-08-27"
  },
  {
    "id": "phi-4-14b",
    "name": "Phi-4 14B Instruct",
    "provider": "Microsoft",
    "releaseDate": "2024-12",
    "description": "A highly optimized reasoning model using advanced synthetic training pipelines. Delivers elite performance in mathematical reasoning, coding puzzles, and step-by-step logic.",
    "parameters": "14B",
    "contextWindow": 16000,
    "license": "MIT",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Reasoning & Math",
      "Coding",
      "Local / On-device"
    ],
    "benchmarks": {
      "mmlu": 82.5,
      "humanEval": 86.6,
      "gsm8k": 92.2
    },
    "deployment": {
      "ollamaId": "phi4",
      "hfRepo": "microsoft/phi-4",
      "vllmId": "microsoft/phi-4",
      "runCommand": "ollama run phi4"
    },
    "pros": [
      "Incredible quality-per-parameter efficiency",
      "Fits comfortably on consumer workstations and high-end laptops",
      "Extremely permissive MIT license"
    ],
    "cons": [
      "Limited context window (16k) compared to Llama's 128k",
      "Can be overly terse in conversational or creative assistants"
    ],
    "sizeInGb": 28,
    "downloads": 824677,
    "likes": 2264,
    "lastUpdated": "2025-11-24",
    "onyxLeaderboardRank": 9
  },
  {
    "id": "phi-3.5-moe",
    "name": "Phi-3.5 MoE Instruct",
    "provider": "Microsoft",
    "releaseDate": "2024-08",
    "description": "Microsoft's sparse Mixture-of-Experts (MoE) entry. Actively routes tokens to sub-networks to achieve 42B quality while executing with the speed and footprint of a 6.6B model.",
    "parameters": "42B",
    "activeParameters": "6.6B",
    "contextWindow": 128000,
    "license": "MIT",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 78.9,
      "humanEval": 71.8,
      "gsm8k": 83.5
    },
    "deployment": {
      "ollamaId": "phi3.5-moe",
      "hfRepo": "microsoft/Phi-3.5-MoE-instruct",
      "vllmId": "microsoft/Phi-3.5-MoE-instruct",
      "runCommand": "ollama run phi3.5-moe"
    },
    "pros": [
      "Superb generation speeds from active parameters",
      "Large 128k context length with high retrieval parity",
      "Excellent multilingual logic performance"
    ],
    "cons": [
      "Requires substantial storage space (42B base size)",
      "Quantization needs specialized attention to avoid outlier decay"
    ],
    "sizeInGb": 84,
    "downloads": 140556,
    "likes": 574,
    "lastUpdated": "2025-12-10"
  },
  {
    "id": "mistral-large-2",
    "name": "Mistral Large 2 (2407)",
    "provider": "Mistral AI",
    "releaseDate": "2024-07",
    "description": "Mistral AI's flagship multilingual powerhouse, custom-tuned for code synthesis, advanced math, multilingual translation (English, French, German, Spanish, Chinese), and function calling.",
    "parameters": "123B",
    "contextWindow": 128000,
    "license": "Mistral Research License",
    "commercialAllowed": false,
    "primaryUseCases": [
      "General Assistant",
      "Coding",
      "Reasoning & Math"
    ],
    "benchmarks": {
      "mmlu": 84,
      "humanEval": 76.2,
      "gsm8k": 87.5
    },
    "deployment": {
      "ollamaId": "mistral-large",
      "hfRepo": "mistralai/Mistral-Large-Instruct-2407",
      "vllmId": "mistralai/Mistral-Large-Instruct-2407",
      "runCommand": "ollama run mistral-large"
    },
    "pros": [
      "State-of-the-art native European multilingual capabilities",
      "Ultra-reliable JSON formatting and function calling",
      "Solid reasoning under pressure"
    ],
    "cons": [
      "Not commercially free (requires Mistral commercial license for business revenue)",
      "Huge hardware requirements (123B parameters)"
    ],
    "sizeInGb": 246,
    "downloads": 4573,
    "likes": 863,
    "lastUpdated": "2025-07-28",
    "onyxLeaderboardRank": 6
  },
  {
    "id": "mistral-nemo-12b",
    "name": "Mistral Nemo 12B Instruct",
    "provider": "Mistral AI",
    "releaseDate": "2024-07",
    "description": "Jointly developed by Mistral AI and NVIDIA. Features a customized Tekken tokenizer for extreme compression of text across languages, coupled with robust instruction compliance.",
    "parameters": "12B",
    "contextWindow": 128000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "General Assistant",
      "Low-Latency"
    ],
    "benchmarks": {
      "mmlu": 76.8,
      "humanEval": 62.5,
      "gsm8k": 80.1
    },
    "deployment": {
      "ollamaId": "mistral-nemo",
      "hfRepo": "mistralai/Mistral-Nemo-Instruct-2407",
      "vllmId": "mistralai/Mistral-Nemo-Instruct-2407",
      "runCommand": "ollama run mistral-nemo"
    },
    "pros": [
      "Amazing tokenizer efficiency for non-English text",
      "Highly capable 128k context support",
      "Excellent developer compliance under Apache-2.0"
    ],
    "cons": [
      "Noticeable performance drops on pure graduate-level logic",
      "Requires slightly more RAM/VRAM than standard 8B counterparts"
    ],
    "sizeInGb": 24,
    "downloads": 124381,
    "likes": 1686,
    "lastUpdated": "2025-07-28"
  },
  {
    "id": "mixtral-8x22b-instruct",
    "name": "Mixtral 8x22B Instruct",
    "provider": "Mistral AI",
    "releaseDate": "2024-04",
    "description": "Mistral's high-capacity Sparse Mixture of Experts model. Excels at high-volume agentic calculations, mathematics, multilingual instructions, and complex function call stacks.",
    "parameters": "141B",
    "activeParameters": "39B",
    "contextWindow": 64000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Reasoning & Math",
      "Coding",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 77.8,
      "humanEval": 71.1,
      "gsm8k": 82.4
    },
    "deployment": {
      "ollamaId": "mixtral:8x22b",
      "hfRepo": "mistralai/Mixtral-8x22B-Instruct-v0.1",
      "vllmId": "mistralai/Mixtral-8x22B-Instruct-v0.1",
      "runCommand": "ollama run mixtral:8x22b"
    },
    "pros": [
      "Apache 2.0 commercial safety",
      "Highly efficient generation speed through active MoE weights",
      "Top-tier reasoning and code synthesis"
    ],
    "cons": [
      "Requires substantial storage space (141B parameters)",
      "Highly sensitive to temperature calibration for deterministic tasks"
    ],
    "sizeInGb": 282,
    "downloads": 57365,
    "likes": 752,
    "lastUpdated": "2025-07-24"
  },
  {
    "id": "mixtral-8x7b-instruct",
    "name": "Mixtral 8x7B Instruct",
    "provider": "Mistral AI",
    "releaseDate": "2023-12",
    "description": "The historic pioneer of open Mixture-of-Experts models. Routes tokens dynamically to provide 47B capacity at the latency profile of an active 13B model.",
    "parameters": "47B",
    "activeParameters": "13B",
    "contextWindow": 32000,
    "license": "Apache-2.0",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency",
      "General Assistant"
    ],
    "benchmarks": {
      "mmlu": 70.6,
      "humanEval": 50.4,
      "gsm8k": 68.2
    },
    "deployment": {
      "ollamaId": "mixtral:8x7b",
      "hfRepo": "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "vllmId": "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "runCommand": "ollama run mixtral:8x7b"
    },
    "pros": [
      "Extremely mature and highly compatible local ecosystem",
      "Outstanding latency during multi-turn generation",
      "Apache 2.0 open development license"
    ],
    "cons": [
      "Lagging benchmarks compared to modern dense models (like Llama 3.1 8B or Phi-4)",
      "Limited code reasoning bounds on multi-tier functions"
    ],
    "sizeInGb": 94,
    "downloads": 526907,
    "likes": 4700,
    "lastUpdated": "2025-07-24"
  },
  {
    "id": "command-r-plus",
    "name": "Command R+",
    "provider": "Cohere",
    "releaseDate": "2024-04",
    "description": "An enterprise-grade model optimized for high-capacity Retrieval-Augmented Generation (RAG), tool-use, and native translation across 10 global business languages.",
    "parameters": "104B",
    "contextWindow": 128000,
    "license": "C-UDA License",
    "commercialAllowed": false,
    "primaryUseCases": [
      "General Assistant",
      "Low-Latency",
      "Coding"
    ],
    "benchmarks": {
      "mmlu": 75.6,
      "humanEval": 61,
      "gsm8k": 76.1
    },
    "deployment": {
      "ollamaId": "command-r-plus",
      "hfRepo": "CohereForAI/c4ai-command-r-plus",
      "vllmId": "CohereForAI/c4ai-command-r-plus",
      "runCommand": "ollama run command-r-plus"
    },
    "pros": [
      "Unmatched native RAG citations and document chunking mechanics",
      "Built specifically for corporate multi-step workflows",
      "Large 128k context with high recall integrity"
    ],
    "cons": [
      "Restricted to research/non-commercial use unless licensed with Cohere",
      "Relatively high hardware bar (104B weights)"
    ],
    "sizeInGb": 208,
    "downloads": 4901,
    "likes": 1798,
    "lastUpdated": "2025-04-16"
  },
  {
    "id": "glm-4-9b-chat",
    "name": "GLM-4 9B Chat",
    "provider": "Zhipu AI",
    "releaseDate": "2024-06",
    "description": "A powerful open bilingual (Chinese & English) chat model by Zhipu AI. Built with advanced training techniques, it excels in tool-use, multi-turn dialogue, and offers a massive 128K context window with high accuracy retrieval.",
    "parameters": "9B",
    "contextWindow": 128000,
    "license": "GLM-4 License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "General Assistant",
      "Reasoning & Math"
    ],
    "benchmarks": {
      "mmlu": 72.4,
      "humanEval": 71.3,
      "gsm8k": 79.6
    },
    "deployment": {
      "ollamaId": "glm4:9b",
      "hfRepo": "THUDM/glm-4-9b-chat",
      "vllmId": "THUDM/glm-4-9b-chat",
      "runCommand": "ollama run glm4:9b"
    },
    "pros": [
      "Top-tier Chinese-English bilingual instruction following",
      "Native function calling and complex agent tools use support",
      "Fits comfortably on consumer hardware with 4-bit or 8-bit quantization"
    ],
    "cons": [
      "Lower coding performance compared to specialized coder models",
      "High-attention compute footprint at extreme context boundaries"
    ],
    "sizeInGb": 18,
    "downloads": 58881,
    "likes": 707,
    "lastUpdated": "2025-03-13"
  },
  {
    "id": "glm-4.5-chat",
    "name": "GLM-4.5 Chat",
    "provider": "Zhipu AI",
    "releaseDate": "2025-03",
    "description": "Zhipu AI's newest generation frontier-class large language model, optimized for complex reasoning, long-context retrieval, coding assistance, and advanced multimodal agent behaviors.",
    "parameters": "100B+",
    "contextWindow": 128000,
    "license": "Proprietary / API",
    "commercialAllowed": true,
    "primaryUseCases": [
      "General Assistant",
      "Coding",
      "Reasoning & Math"
    ],
    "benchmarks": {
      "mmlu": 90.1,
      "humanEval": 88.5,
      "gsm8k": 94.2
    },
    "deployment": {
      "ollamaId": "glm-4.5-chat",
      "hfRepo": "THUDM/glm-4.5-chat",
      "vllmId": "THUDM/glm-4.5-chat",
      "runCommand": "ollama run glm-4.5-chat"
    },
    "pros": [
      "Frontier-class performance competitive with proprietary models",
      "Superior agentic tool invocation and multi-step math reasoning",
      "Unmatched cross-lingual synthesis and precise structured data extraction"
    ],
    "cons": [
      "Huge local memory requirement if running unquantized weights",
      "Requires enterprise cluster setup or dedicated GPU servers for low-latency inference"
    ],
    "sizeInGb": 200
  },
  {
    "id": "llama-3.2-3b-it",
    "name": "Llama 3.2 3B Instruct",
    "provider": "Meta",
    "releaseDate": "2024-09",
    "description": "Meta's premier ultra-lightweight text model. Specifically optimized for low-latency, on-device usage, local search summarization, and task orchestration on mobile or edge nodes.",
    "parameters": "3B",
    "contextWindow": 128000,
    "license": "Llama 3.2 License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency"
    ],
    "benchmarks": {
      "mmlu": 64.3,
      "humanEval": 45.4,
      "gsm8k": 72.8
    },
    "deployment": {
      "ollamaId": "llama3.2:3b",
      "hfRepo": "meta-llama/Llama-3.2-3B-Instruct",
      "vllmId": "meta-llama/Llama-3.2-3B-Instruct",
      "runCommand": "ollama run llama3.2:3b"
    },
    "pros": [
      "Runs effortlessly on standard laptops, tablets, and modern smart phones",
      "Incredible 128k context for a tiny parameter model",
      "Optimized for rapid RAG summarization"
    ],
    "cons": [
      "Struggles with advanced multi-step coding or graduate-level math",
      "More prone to hallucination in highly niche domains"
    ],
    "sizeInGb": 6,
    "downloads": 2056857,
    "likes": 2282,
    "lastUpdated": "2024-10-24"
  },
  {
    "id": "llama-3.2-1b-it",
    "name": "Llama 3.2 1B Instruct",
    "provider": "Meta",
    "releaseDate": "2024-09",
    "description": "Meta's absolute smallest LLM. Custom-tuned for micro-latency edge deployment, local text classifications, and rapid low-level orchestrations.",
    "parameters": "1B",
    "contextWindow": 128000,
    "license": "Llama 3.2 License",
    "commercialAllowed": true,
    "primaryUseCases": [
      "Local / On-device",
      "Low-Latency"
    ],
    "benchmarks": {
      "mmlu": 49.3,
      "humanEval": 31.2,
      "gsm8k": 52.4
    },
    "deployment": {
      "ollamaId": "llama3.2:1b",
      "hfRepo": "meta-llama/Llama-3.2-1B-Instruct",
      "vllmId": "meta-llama/Llama-3.2-1B-Instruct",
      "runCommand": "ollama run llama3.2:1b"
    },
    "pros": [
      "Negligible memory requirement (less than 2GB unquantized)",
      "Ultra-fast latency suitable for real-time keystroke processing",
      "Incredible context window size relative to parameter counts"
    ],
    "cons": [
      "Severely limited deductive reasoning abilities",
      "Not suitable for any programming or logical problem solving"
    ],
    "sizeInGb": 2,
    "downloads": 8583830,
    "likes": 1502,
    "lastUpdated": "2024-10-24"
  }
];

export interface QuantizationOption {
  id: string;
  name: string;
  description: string;
  bitsPerWeight: number;
  memoryMultiplier: number; // multiplier of the model parameters count (approx size in GB is params * bitsPerWeight / 8 + 2GB overhead)
}

export const QUANTIZATION_OPTIONS: QuantizationOption[] = [
  {
    id: 'fp16',
    name: 'Unquantized (FP16)',
    description: 'Full 16-bit float precision. Maximum quality, highest RAM/VRAM requirement.',
    bitsPerWeight: 16,
    memoryMultiplier: 2.0
  },
  {
    id: 'q8_0',
    name: 'Q8_0 (8-bit Quantized)',
    description: '8-bit integer quantization. Virtually zero loss in accuracy, saves 50% memory.',
    bitsPerWeight: 8,
    memoryMultiplier: 1.05
  },
  {
    id: 'q4_k_m',
    name: 'Q4_K_M (4-bit Recommended)',
    description: 'Optimal standard for local hardware. Extreme memory savings with negligible accuracy degradation (<1%).',
    bitsPerWeight: 4.5,
    memoryMultiplier: 0.6
  },
  {
    id: 'q2_k',
    name: 'Q2_K (2-bit Extreme)',
    description: '2-bit ultra-compression. Maximum memory savings, but noticeably higher perplexity and logic errors.',
    bitsPerWeight: 2.5,
    memoryMultiplier: 0.38
  }
];

export async function fetchModelsFromReadme(): Promise<ModelMetadata[] | null> {
  try {
    // Fetch ./README.md relative to current page location to support github pages sub-folders
    const response = await fetch('./README.md');
    if (!response.ok) {
      console.warn('Failed to fetch ./README.md. Using static fallback models.');
      return null;
    }
    const text = await response.text();
    
    const startMarker = '<!-- REGISTRY_JSON_START -->';
    const endMarker = '<!-- REGISTRY_JSON_END -->';
    
    const startIndex = text.indexOf(startMarker);
    const endIndex = text.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      console.warn('Could not find registry data markers in README.md, utilizing fallback data');
      return null;
    }
    
    const blockContent = text.substring(startIndex + startMarker.length, endIndex).trim();
    
    // Find the outer bounds of the JSON array safely to bypass any regex or formatting issues
    const firstBracket = blockContent.indexOf('[');
    const lastBracket = blockContent.lastIndexOf(']');
    
    if (firstBracket === -1 || lastBracket === -1 || lastBracket < firstBracket) {
      console.warn('Could not find valid JSON array bounds in README blockContent');
      return null;
    }
    
    const jsonText = blockContent.substring(firstBracket, lastBracket + 1).trim();
    
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed) && parsed.length > 0) {
      console.log(`Successfully fetched and parsed ${parsed.length} models dynamically from README.md!`);
      return parsed as ModelMetadata[];
    }
    return null;
  } catch (error) {
    console.error('Error fetching/parsing models from README.md:', error);
    return null;
  }
}
