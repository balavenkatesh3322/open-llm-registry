import fs from 'fs';
import path from 'path';
import { OPEN_SOURCE_MODELS } from '../src/data/models';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const contentDir = path.join(publicDir, 'content');
const pagesDir = path.join(contentDir, 'pages');
const registryDir = path.join(contentDir, 'registry');
const modelsDir = path.join(registryDir, 'models');

// Ensure directories exist
[publicDir, contentDir, pagesDir, registryDir, modelsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('--- Generating Markdown Content Files ---');

// 1. Generate Home Page Markdown (/public/content/pages/home.md)
const homeMdPath = path.join(pagesDir, 'home.md');
const homeMdContent = `---
heroBadge: "100% COMPATIBLE WITH OLLAMA, VLLM & HUGGING FACE"
heroTitle: "Discover & Deploy the Perfect Open-Source LLMs In Seconds"
heroDescription: "Avoid catalog fatigue. Discover, analyze, and test the finest open-weight models vetted by execution benchmarks, licenses, and context limits. Compute local VRAM hardware compatibility and compare execution structures in 30 seconds."
guides:
  - id: "quantization"
    title: "How to choose quantization?"
    icon: "TrendingUp"
    description: "**Q4_K_M** (4-bit quantization) is the gold standard for running open LLMs locally. It reduces weight size by 70%+ with virtually zero noticeable loss in conversational intelligence. Only choose 16-bit float if doing complex scientific evaluations."
  - id: "why-local"
    title: "Why local models?"
    icon: "Terminal"
    description: "Running models offline ensures 100% data privacy (crucial for proprietary codebases or medical/financial context), works entirely without internet connection, has zero per-token execution costs, and bypasses third-party rate limits."
  - id: "evaluation"
    title: "Our evaluation strategy"
    icon: "Award"
    description: "Instead of loading custom proprietary test benches, we curate authenticated industry ratings across MMLU (high-level general knowledge), HumanEval (strict Python code block accuracy tests), and GSM8K (high-school multi-step mathematical reasoning)."
---

# Welcome to OpenLLM Index

OpenLLM Index is an advanced decision directory and VRAM estimator for open-weights large language models. This platform allows developers, researchers, and hobbyists to evaluate model hardware requirements, explore benchmark performance metrics, and retrieve command-line deployment blueprints for tools like Ollama, vLLM, and Hugging Face.
`;

fs.writeFileSync(homeMdPath, homeMdContent, 'utf8');
console.log(`Generated Home page markdown content at ${homeMdPath}`);

// 2. Generate Model Markdown files
OPEN_SOURCE_MODELS.forEach(model => {
  const modelMdPath = path.join(modelsDir, `${model.id}.md`);
  const modelMdContent = `---
id: "${model.id}"
name: "${model.name}"
provider: "${model.provider}"
releaseDate: "${model.releaseDate}"
parameters: "${model.parameters}"
activeParameters: "${model.activeParameters || ''}"
contextWindow: ${model.contextWindow}
license: "${model.license}"
commercialAllowed: ${model.commercialAllowed}
primaryUseCases: [${model.primaryUseCases.map(uc => `"${uc}"`).join(', ')}]
sizeInGb: ${model.sizeInGb}
downloads: ${model.downloads || 0}
likes: ${model.likes || 0}
lastUpdated: "${model.lastUpdated || ''}"
onyxLeaderboardRank: ${model.onyxLeaderboardRank || 0}
mmlu: ${model.benchmarks.mmlu}
humanEval: ${model.benchmarks.humanEval}
gsm8k: ${model.benchmarks.gsm8k}
vision: ${model.benchmarks.vision || ''}
ollamaId: "${model.deployment.ollamaId}"
hfRepo: "${model.deployment.hfRepo}"
vllmId: "${model.deployment.vllmId}"
runCommand: "${model.deployment.runCommand}"
---

# ${model.name}

${model.description}

## Pros
${model.pros.map(pro => `- ${pro}`).join('\n')}

## Cons
${model.cons.map(con => `- ${con}`).join('\n')}
`;

  fs.writeFileSync(modelMdPath, modelMdContent, 'utf8');
});

console.log(`Generated ${OPEN_SOURCE_MODELS.length} model markdown files in ${modelsDir}`);

// 3. Generate Index Manifest of Models (/public/content/registry/index.md)
const indexMdPath = path.join(registryDir, 'index.md');
const indexMdContent = `---
title: "Model Registry Index"
lastUpdated: "2026-07-01"
---

# Registered Models List

This markdown file acts as the list of active models served on the website. Contributors can add their new models to the JSON array below, and the frontend will automatically load them.

\`\`\`json
[
${OPEN_SOURCE_MODELS.map(m => `  { "id": "${m.id}", "file": "./models/${m.id}.md" }`).join(',\n')}
]
\`\`\`
`;

fs.writeFileSync(indexMdPath, indexMdContent, 'utf8');
console.log(`Generated Registry Index list markdown at ${indexMdPath}`);
console.log('--- Completed Content Generation ---');
