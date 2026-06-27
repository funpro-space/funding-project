<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Quality Standards
##  Error Fixing & Debugging
- **Never bypass errors:** Fix root cause. Do NOT use `@ts-ignore`, `eslint-disable`, or suppress warnings without explicit user approval.
- **Strict Builds:** Build must pass zero warnings and zero TypeScript errors (`npm run lint:strict` and `npm run typecheck`).
- **Prebuild Verification:** `npm run prebuild` runs strict linting and typechecking. Ensure this passes before claiming success.
- **Systematic Debug:** If build fails, read logs carefully, reproduce the issue, and apply surgical fixes rather than wide rewrites. 

