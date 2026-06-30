# Gemini Underwriting & Validation Engine

## Overview
The Gemini Underwriting Engine is the core intelligence layer of the FunPro platform. It assesses project viability, grades sustainability efforts, validates business readiness, and helps founders polish their narratives to unlock funding opportunities.

By evaluating qualitative founder inputs against ecosystem rules and industry benchmarks, the engine converts raw narratives into structured metrics, dynamic action plans, and verifiable scores.

---

## 1. Core Evaluation Pillars (The 4-Vector Framework)
The engine scores projects across four core vectors, aggregating them into a unified validation percentage (0% to 100%):

1. **Operational Strategy** (`operationalStrategy`)
   - Assesses business readiness, risk mitigation, and scaling execution.
   - Evaluates short-term and long-term milestones.
2. **Sustainability Process** (`sustainabilityProcess`)
   - Analyzes resource efficiency, trace supply chain integrations, and waste management.
   - Measures ecological impact and environmental responsibility.
3. **World Betterment** (`worldBetterment`)
   - Gauges regional alignment, local job creation, and positive community/cultural impact.
4. **Expertise & Origin** (`expertiseOrigin`)
   - Validates founder tenure, specialized training, heritage transfer, and verified competencies.

Each vector is scored from **1 to 5** and paired with dynamic, contextual recommendations.

---

## 2. Sustainability Index Breakdown
For deep ecological validation, the engine scores positive environmental restoration efforts across several granular criteria:
- **Water & Energy Audits:** Usage metrics, conservation tactics, and clean energy transition.
- **Trace Supply Chains:** Transparency of resource sourcing and ethical logistics.
- **Circular Upcycling:** Waste reduction and repurposing protocols.
- **Ecological Restoration:** Active contribution to local ecosystem health.

---

## 3. Narrative Polish & Optimization
Using the `/api/workspace-ai-polish` endpoint, the AI reads the founder's raw narrative and offers structural improvements:
- **Tone Calibration:** Aligns narrative to target underwriting criteria.
- **Clarity & Impact:** Eliminates jargon, emphasizes milestones, and highlights core differentiators.
- **Interactive Feedback:** Founders receive side-by-side comparative views of raw vs. polished text.

---

## 4. Personal Training & Mastery Paths
To address verified skill gaps identified during the Underwriting process, the engine dynamically prescribes professional development guidelines:
- **Mastery Tiers:** Categorizes expertise levels (e.g., Master, Intermediate, Apprentice) based on experience duration.
- **Personalized Recommendations:** Integrates local guild networks, textbook foundations, and intermediate milestone targets (detailed in `docs/TRAINING_GUIDE.md`).
- **Targeted Skill Suggestions:** Prescribes specific training paths (e.g., Soil Food Web Analysis, Sustainability Accounting, cottage ordinance licensing) based on the project's selected industry.

---

## 5. Technical Architecture
The engine leverages standard APIs to coordinate frontend interactions with backend AI models:
- **Evaluation/Prediction:** Handled via `src/app/api/workspace-ai-review/route.ts`.
- **Polish/Optimization:** Handled via `src/app/api/workspace-ai-polish/route.ts`.
- **Provider Context:** Model tokens, constraints, and cost efficiencies are tracked globally under `src/lib/ai/gemini-token-cost.js`.
