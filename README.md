# FunPro Space

Welcome to **FunPro Space**—a fast, flexible platform designed for the Base ecosystem. 

Live Demo: [http://funpro.space/](http://funpro.space/)

## Executive Overview

FunPro Space is an onchain logging, metrics tracking, and proposal polish platform optimized for Web3 founders on Base. By combining advanced AI-driven proposal evaluations with verifiable onchain registration and tracking, FunPro makes launching, funding, and assessing venture-scale projects seamless and reliable.

### 🌟 Core Architecture Pillars

#### 1. The Core Loop (4-Pillar Evaluation Engine)
Our foundational AI scoring model assesses every project across four distinct vectors:
- **Ecosystem Fit:** Alignment with Base core values and growth vectors.
- **Narrative Depth:** Clarity of the problem-solution-market thesis.
- **Economic Soundness:** Viability of the tokenomics/funding models and risk profiles.
- **Technical Integrity:** Feasibility, correctness, and architecture of the codebase.

#### 2. The Vibe Spectrum (5-Color Progress Tracking)
A dynamic progress tracking layout designed to instantly signal a project's maturity and alignment. The system assigns a visual spectrum color state to projects:
- `Red` (0% - 19%) - **Initialized** (System online, raw state).
- `Orange` (20% - 39%) - **Assembling** (Data structure detected).
- `Blue` (40% - 59%) - **Syncing** (Midway anchor reached).
- `Purple` (60% - 79%) - **Optimized** (High alignment, near capacity).
- `Green` (80% - 100%) - **Harmonized** (Peak network synergy).

#### 3. The Pre-Flight Interceptor
To maximize funding chances and presentation quality, user inputs undergo real-time humanization and AI-driven narrative polishing before committing to the database or registering onchain. The interceptor highlights gaps, suggests precise tone adjustments, and optimizes clarity.

#### 4. The Roadmap (Level 2 Ecosystem Treasury & Dev Bounties)
Looking ahead, FunPro is launching its Level 2 Ecosystem Treasury, introducing a decentralized Dev Bounties framework. This protocol expansion will distribute onchain rewards directly to builders contributing to key platform primitives, establishing a deep, long-term ecosystem.

---

## Getting Started

### Project Goals
FunPro aims to provide seamless logging and metrics tracking onchain. We log budget hashes to the Base Mainnet to track funding data persistently.

### Local Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment:**
   Copy `.env.example` to `.env.local` and add your `NEXT_PUBLIC_ONCHAINKIT_API_KEY` and the newly deployed `NEXT_PUBLIC_CONTRACT_ADDRESS`.

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Smart Contract Integration
The core contract `FunProRegistry.sol` is currently deployed on **Base Mainnet**:
- **Contract Address:** `0xfe0ad36ab1f67acb75ebb3ac1b7fd970863d1dcc`
- **Network:** Base Mainnet

To interact, use your Coinbase Smart Wallet (managed via the official web dashboard at https://keys.coinbase.com) which connects seamlessly on Base Mainnet. No MetaMask or manual RPC configuration is required.

---

## 🚀 What's Next: The Onchain Builder Roadmap

As we continue scaling our platform capabilities, we are building out the subsequent interactive levels to support founders from ideation to onchain settlement:

### 📁 Level 2: Project Workspace (Active Development)
* **Strategic Note Planning**: Private, encrypted split-screen document canvas for drafting deep-dive strategy outlines, storytelling metrics, and milestone checklists.
* **AI Narrative Alignment**: Real-time integration of the Gemini Underwriting Engine to highlight narrative blindspots and fine-tune ecosystem synergy.

### 📊 Level 3: Expense & Revenue Management (Active Development)
* **Relational Ledger Database Sync**: Create dynamic, itemized monthly expense charts and financial projection spreadsheets stored in relational DB tracks.
* **Burn-Rate Analytics Engine**: Automatic runway calculations and monthly tranche projections calculated in real-time alongside text notes.

### 🔒 Level 4: Advisory Review & Milestone Lock (Staging/Pipeline)
* **Multi-Signature Milestone Escrow Protocol**: Locking approved capital tranches into smart contract escrows that release funds programmatically upon verified proof-of-work.
* **Gasless USDC Settlement**: Optimizing treasury disbursement using gasless transactions to minimize operational costs for early-stage builders.

---

## 💎 Web3 Funding & Treasury Pathways

In parallel with developing these native planning tools, FunPro Space aligns with the **Base Ecosystem's official funding pathways** to streamline how registered projects transit into live capital opportunities:

### 1. 📅 Weekly Rewards (Experimental Prototyping Track)
* **Goal**: Perfect for weekend experiments, hackathon drafts, and first-time builders learning on Base.
* **Rewards**: 2 ETH weekly distributed to active builders based on shipping progress.
* **Action Portal**: [Builder Score & Talent Protocol](https://www.builderscore.xyz/)
* *FunPro Role*: Use your Level 1 registered concept and Level 2 workspace notes to easily document your shipping progress and secure weekly rewards.

### 2. ⚡ Builder Grants (Retroactive Validation Track)
* **Goal**: Retroactive funding for shipped projects and functional onchain applications demonstrating early utility.
* **Rewards**: 1-5 ETH in retroactive grants.
* **Action Portal**: [Base Builder Grants](https://paragraph.com/@grants.base.eth/calling-based-builders)
* *FunPro Role*: Export your Level 3 audited financial runway sheets and verified Base Mainnet contract receipts to back up your retroactive application with robust metrics.

### 3. 🏆 OP Retro Funding (Ecosystem Public Goods Track)
* **Goal**: Rewarding developers building open-source libraries, tooling, and infrastructure that benefit the entire Base ecosystem.
* **Action Portal**: [Optimism Atlas](https://atlas.optimism.io/)
* *FunPro Role*: Log your project metrics and public goods impact data persistently on Base via FunPro's onchain logging registry.

### 🚀 Base Batches (The Full-Scale Founder Track)
* **Goal**: A structured, recurring cohort program for builders ready to turn projects into venture-scale startups. Includes mentorship, MVP refinement, and direct pitches to leading VCs like Coinbase Ventures.
* **Action Portal**: [Base Batches](https://basebatches.xyz)
* *FunPro Role*: Your complete 4-level FunPro strategy canvas serves as the definitive pitch and readiness portfolio for Batch validation.

