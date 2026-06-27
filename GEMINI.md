# Gemini Project Instructions — Funding Project Space

## Build & Development Guide

### Commands
- Dev Server: `npm run dev`
- Strict Check (Lint + Types): `npm run prebuild` (runs `eslint --max-warnings 0` and `tsc --noEmit`)
- Build: `npm run build` (Next.js build, depends on prebuild passing)
- Run Lint: `npm run lint`

### Standards
- **Zero Warnings/Errors:** Zero typescript errors or eslint warnings allowed. Never use `@ts-ignore` or `eslint-disable` without explicit user permission.
- **Verification:** Always run `npm run prebuild` to verify changes before completing a task.

---

## Onchain & AI Integration Rules

Whenever working with Base smart contracts, Coinbase Smart Wallets, or OnchainKit distribution rails:
1. **No API Guesswork:** Do not guess the API syntax based on old training data.
2. **Read Index First:** Read `https://docs.base.org/llms.txt` to discover live documentation layout.
3. **Fetch Pages:** Always fetch required sub-pages (via `web_fetch`) before writing or modifying any component files.

---

## Core Architecture Primitives

Refer to `public/llms.txt` for the index.
- **Onchain Provider:** `/src/components/providers/OnchainProvider.tsx` (Base Mainnet RPC, Coinbase Smart Wallets, OnchainKit)
- **Animation Engine:** `/src/components/providers/AnimationEngine.tsx` (GSAP executions)
- **Theme Styles:** `/src/styles/theme.css` (Brand variables, Nice Light Blue spectrum)
- **AI Infrastructure:** `/src/app/api/workspace-ai-review/route.ts` (Evaluation/prediction engine)

---

## Next.js System Note

Next.js has breaking changes and new APIs relative to standard models training data. Refer to `node_modules/next/dist/docs/` or online docs for exact APIs.
