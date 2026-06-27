# funpro.space — Workspace Feature & Level 1 Integration Design Document

This document outlines the relationship between the landing page, the current workspace implementation, and the detailed architectural and UX design needed to deliver the **Level 1 (Founder Profile)** promises in the workspace of **funpro.space**.

---

## 1. System Mapping & Current State

### A. Landing Page Layout & Context (`src/app/(home)/page.tsx`)
- **Structure:** Managed by `src/app/(home)/layout.tsx` inside the `<AnimationEngine>` provider.
- **Components:**
  - `MarketingHero`: Hook to grab attention. Includes an action button ("Test Live AI Underwriting Box").
  - `OnchainStepper`: Houses the four levels of the platform lifecycle.
  - `BottomCallToAction`, `FAQ`, and `FloatingUSDC` (GSAP scroll-driven animations).
- **Core Theme Styling:** Managed by `src/styles/theme.css` (Nice Light Blue spectrum, dark slate layout).

### B. Onchain Stepper Level 1: "Founder Profile"
On Level 1, the platform promises:
1. **Wallet Connection:** Connect wallet to safely sign in and initialize.
2. **Concept Registration:** Enter initial concept, check funding qualification using AI, and get the project onto the Base Mainnet test rails in seconds.
3. **Core Features:**
   - **Gemini Underwriting Engine** (Live)
   - **Base Mainnet Smart Contract Registry** (Live)
   - **Business Readiness** (Live)
4. **Action Trigger:** "Test the Live Registration Space Now" (currently a static button that does not redirect/navigate to `/workspace`).

### C. Current Workspace Implementation (`src/app/(dashboard)/workspace/page.tsx`)
- **Left Panel (Input):** Underwriter Form with an Operational Strategy text canvas, Timeline (1–12 Months), Requested Amount (1k–30k USDC).
- **Underwriting API Route (`src/app/api/predict/route.ts`):** Checks if the strategy mentions `"SaaS"`, `"App"`, or `"Shop"`. If verified, returns a JSON object with monthly expense tranches.
- **Right Panel (Output & Auditing):**
  - Displays monthly tranches.
  - Reveals "Business Readiness Audit" after confirming the roadmap.
  - "Business Readiness Audit" contains fields: Entity Status, EIN/Tax ID, Active Team Size, Monthly Burn, and Pitch Deck/GitHub URL.
  - Base Mainnet integration with OnchainKit (`Wallet`, `ConnectWallet`, etc.) and a "Log Budget On-Chain" button executing `logBudget(string _ipfsHash, uint256 _totalUSDC)` on the contract registry.

---

## 2. Gap Analysis: Stepper Level 1 vs. Workspace UX

There are key UX/architectural gaps between what is promised on the landing page/stepper and how the workspace is structured:

1. **Broken Stepper Redirection:** The Level 1 action button in the `OnchainStepper` component is a static `<button>` with no navigation logic. It must link directly to `/workspace`.
2. **Late Wallet Connection:** The Level 1 stepper promises "Connect your wallet to safely sign in and get started." However, in the workspace, the wallet connect option is locked inside the "Business Readiness Audit" section, which only appears *after* the user submits their idea and clicks "Confirm & Apply for Advisory."
3. **Lack of Stepper-to-Workspace Alignment:** The workspace lacks visual cues connecting its forms to the Stepper levels (e.g. clearly indicating "Step 1: Founder Profile" vs "Step 2: Project Workspace").

---

## 3. Recommended Feature & UX Design

To fulfill the Level 1 "Founder Profile" promise cleanly and prepare the workspace for subsequent levels (2, 3, and 4), we design the following UX flow and structural layout for `/workspace`.

### A. Phase 1: Progressive Onboarding & The "Founder Profile" Gate
Instead of locking the wallet connection at the bottom of the audit, we introduce a **Founder Profile Gate** or an prominent header wallet sign-in that mirrors Level 1:

1. **State A: Disconnected Wallet (Unauthenticated / Guest)**
   - Display a welcome block matching the Level 1 Stepper styling.
   - Action: "Connect Wallet to Initialize Founder Profile".
   - Using OnchainKit's `ConnectWallet`, the user connects. Once connected, they are signed in, and the "Operational Strategy Canvas" is unlocked.
2. **State B: Connected Wallet (Authenticated)**
   - Displays their Base Mainnet ENS/address at the top-left of the canvas.
   - Unlocks the **Gemini Underwriting Engine** text inputs.

### B. Phase 2: Underwriting & qualification check
1. The user inputs their Operational Strategy Notes, Timeline, and Requested USDC.
2. Submitting the form calls the `/api/predict` underwriting route.
3. **Gemini Underwriting Engine Response:**
   - Validates business readiness constraints (e.g. checking for SaaS/App/Shop keywords, limits: Max 30k USDC, Max 12 months).
   - Generates the monthly tranche budget on the screen.

### C. Phase 3: Business Readiness Audit & Contract Registration
1. Once the budget is generated, the workspace reveals the **Business Readiness Audit** form.
2. This represents the final verification step of Level 1:
   - User inputs entity type, tax ID, team size, burn rate, and pitch deck.
   - **Log Budget On-Chain action:** Clicking "Log Budget On-Chain" directly calls `logBudget` in `contracts/FunProRegistry.sol` using `wagmi`'s `useWriteContract`. This anchors their concept total USDC budget and metadata on the Base Mainnet test rails, completing the Level 1 "Founder Profile" loop.

---

## 4. Implementation Step-by-Step Blueprint

### Task 1: Connect Landing Page Stepper to Workspace
Modify `src/components/home/OnchainStepper.tsx` to handle navigation.
- **Action:** Convert the Level 1 action button into a Next.js `<Link href="/workspace">` or attach an `onClick` that pushes the router to `/workspace`.
```tsx
import Link from 'next/link';
// ...
<Link href="/workspace" className="w-full text-center block py-2.5 px-4 rounded-[var(--brand-radius-sm)] font-display text-[var(--font-size-xs)] font-bold tracking-wide transition-all bg-[var(--brand-primary)] text-black shadow-[var(--shadow-btn-primary)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]">
  {step.actionText} →
</Link>
```

### Task 2: Refactor Workspace Page to Prompt Wallet Connection Early
Modify `src/app/(dashboard)/workspace/page.tsx` to elevate the `ConnectWallet` component:
- Put an elegant, elevated `ConnectWallet` prompt at the very beginning of the underwriting page or as a visual header block so that users feel they are "signing in to create their profile."
- Highlight that a wallet is required to execute the final smart contract writes on Base Mainnet.

### Task 3: Match UI Layout with Level-Based Navigation
Add a visual Stepper Tracker to the workspace sidebar or top bar:
- **Level 1 (Active):** Founder Profile & Onchain Registration.
- **Level 2 (Staging):** Project Workspace & Document Sandbox.
- **Level 3 (Pipeline):** Expense Matrix & Revenue Ledger.
- **Level 4 (Pipeline):** Advisory Milestone Lock & Smart Escrows.

---

## 5. Verification & Strict Build Requirements
- Run `npm run prebuild` (`eslint` + `tsc`) to guarantee no type or lint regressions are introduced.
- Ensure proper error-state fallback when `writeContract` fails or rejects.
