# Spec: Marketing Layout and Hero Component Refactor

## 1. Goal
Move global/marketing layout elements (header, footer, background glows) to a dedicated Next.js layout file, and replace the inline hero with the `MarketingHero` component.

## 2. Approach
- **Layout (`src/app/(marketing)/layout.tsx`)**:
  - Contains background decorative glow divs.
  - Contains standard marketing header (Navbar).
  - Contains standard marketing footer.
  - Renders children.
- **Page (`src/app/(marketing)/page.tsx`)**:
  - Renders `<MarketingHero />`.
  - Renders `<OnchainStepper />` wrapper.
  - Renders the 3 core pillars.
  - No longer defines its own header, footer, or background glow divs.
- **Hero Component (`src/components/marketing/MarketingHero.tsx`)**:
  - Update the "Test Live AI Underwriting Box" button to use Next.js `<Link href="/workspace">` instead of a plain `<button>` to restore navigation behavior.

## 3. Testing & Verification
- Compile project (`npm run build` or Next build) to ensure no TS or import errors.
- Confirm navbar and footer are visible on the home page.
- Confirm clicking the "Test Live AI Underwriting Box" button navigates to `/workspace`.
