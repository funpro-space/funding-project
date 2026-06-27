# Spec: Stepper Component Integration on Landing Page

## Overview
Integrate the interactive `OnchainStepper` component onto the main marketing landing page (`src/app/(marketing)/page.tsx`) to showcase our Web3 user journey.

## Position & Layout
- The stepper will be positioned directly below the Hero section (below the primary action buttons and "Explore funpro.space" link) and directly above the "How It Works" grid/features section.
- It will be wrapped in a contained, styled section matching the page max-width (`max-w-6xl`) with appropriate vertical margins.

## Visual Design & Enhancements
- Wrapped in a sleek container with borders and a dark-theme backdrop (`bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md`).
- A subtle background radial glow (`bg-nice-500/10 w-[500px] h-[300px] rounded-full blur-[100px] absolute -translate-x-1/2 left-1/2 pointer-events-none`) will be placed behind it to draw focus.

## Components & Data Flow
- Imports `OnchainStepper` from `src/components/marketing/OnchainStepper.tsx`.
- Since `OnchainStepper` already contains `"use client"` and self-managed active step state (`useState`), it can be imported and rendered directly.

## Verification & Testing
- Verify that the marketing page compiles successfully.
- Run `npm run prebuild` (or the equivalent lint/typecheck script) to ensure zero warnings or errors.
