# Stepper Component Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the `OnchainStepper` component on the landing page of the marketing section.

**Architecture:** Render the `OnchainStepper` client component inside the marketing layout page under the hero section.

**Tech Stack:** Next.js (App Router), React, TailwindCSS, Lucide Icons.

---

### Task 1: Integrate OnchainStepper on Marketing Page

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Edit page.tsx to import and integrate OnchainStepper**

Modify `src/app/(marketing)/page.tsx` to:
1. Import `OnchainStepper` from `@/components/marketing/OnchainStepper` (or relatively `../../components/marketing/OnchainStepper`).
2. Insert a new section below the Hero section (`</main>`) and above the `<section id="features" ...>` section.

Here is the exact code modification:

```tsx
// Insert import at top of file:
import OnchainStepper from '@/components/marketing/OnchainStepper';
```

And in the JSX, insert:
```tsx
      {/* STEPPER SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 z-10 border-t border-zinc-900 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-nice-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
          <OnchainStepper />
        </div>
      </section>
```

- [ ] **Step 2: Verify lint and type checking**

Run the following command to make sure there are no warnings or compilation issues:
`npm run prebuild`

Expected output: Command finishes successfully with exit code 0 and no errors or warnings.
