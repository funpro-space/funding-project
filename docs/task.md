# Context & Goal
We need to update our web app landing page architecture for `funpro.space`. Currently, our app requires a wallet connection right at the start to view or use anything. The JesseXBT ecosystem review bot flagged this because the site reads like a text-only landing page instead of a functional application. 

We need to un-gate our MVP workspace features by creating an interactive "Guest Sandbox" experience right on initial page load, moving the wallet connection to the very end of the user's flow.

# UI/UX Technical Requirements
1. Keep the standard "Connect Wallet" button inside the top header navbar for returning users who already have active profiles.
2. Immediately below the navigation header, load and feature our interactive Floating Chat Box / Business Idea Evaluation Engine directly in plain view.
3. Allow a standard visitor (or an automated web crawler/scraper) to interact with this engine as a guest completely off-chain. They must be able to type a business idea, hit 'Evaluate', and see the generated results/advice checklists appear natively dynamically on-screen.
4. Do NOT trigger any wallet signature or window pop-up during this initial sandbox step. Manage the temporary session state strictly using frontend data structures (e.g., local state memory).

# The Wallet Handshake (The New Gate)
1. Once the engine completes generating the personalized advice checklists, template prompts, or workspace planners on-screen, introduce a sleek interactive call-to-action (CTA) module below the output.
2. The card should read: "Workspace Evaluation Complete! Connect your wallet to securely save your research dashboards, unlock level 2 features, and activate on-chain milestone tracking."
3. Clicking this specific CTA must invoke our Base Smart Wallet/Coinbase Wallet connection hook.
4. Once the wallet is successfully connected, push the existing state data to our database/smart contract to bind the workspace data to that `0x...` user address permanently.

Please generate or update the frontend React/Next.js/HTML page code to implement this exact 'Try First, Connect Later' user flow.

# Checklist Update Requirements
1. Remove the interactive checkbox inputs (`<input type="checkbox">`) entirely from the Core Project Features section.
2. Convert the four points ("Core Creation", "Sourcing Integrity", "Process Sustainability", "Community Betterment") into a static text bulleted display or checklist icon layout (`✓`). 
3. Remove the block lock state (`disabled`) from the chat box input field entirely. 
4. The chat input must be 100% active and unlocked immediately on initial page load, with the "Core Project Features" acting as visible prompt guidelines directly above it so the user (and automated scrapers) can instantly see how to interact with the engine.

# Security & Rate Limiting Requirements
1. Implement a server-side rate limit on the evaluation API endpoint to protect our AI backend usage.
2. Track usage by the incoming request IP address. 
3. Limit every unique IP address to a maximum of 3 evaluations per 24 hours.
4. If an IP exceeds this limit, return a 429 Too Many Requests status code and display a user-friendly error message under the chat box: "Guest limit reached. Connect your wallet to unlock unlimited daily evaluations and save your workspace permanently."

# UI Presentation Update: Core Features Guidance
1. Convert the "Checklist: Core Project Features" module into a static, read-only instructional card layout. 
2. Remove all interactive HTML checkbox inputs (`<input type="checkbox">`) completely. Instead, use styled static bullet icons or checkmark shapes (e.g., using `✓` icons or custom CSS styling) to present the four required aspects as a helpful "How-To" reference list.
3. Keep all text formatting intact so humans still know they need to cover Core Creation, Sourcing Integrity, Process Sustainability, and Community Betterment in their writing.
4. Ensure the placeholder overlay text ("Check all four guidelines above to unlock...") is entirely removed.
5. Set the chat box input text area state to permanently enabled/unlocked immediately upon page load. The user (and automated review scripts) must be able to click into the input and type instantly without hitting any blockades.

# Landing Page Interactive Layout Requirements
1. Implement a combination CTA strategy for the un-gated Guest Sandbox evaluation chat.
2. Section CTAs: Place a prominent button in the main Hero section and near the bottom labeled "Launch Free Evaluation Sandbox". Clicking these buttons should smoothly scroll the window (`window.scrollTo`) directly down to the dedicated, open, read-only "Core Project Features" guidelines block and main text input field.
3. Sticky Floating Icon: Implement a fixed-position floating widget in the bottom-right corner (`position: fixed; bottom: 24px; right: 24px; z-index: 50;`) featuring an elegant AI/Chat icon.
4. Floating Icon Action: Clicking this sticky icon should toggle open a compact, animated side-drawer chat interface containing the unlocked business evaluator text area.
5. Ensure both pathways map to the exact same off-chain backend evaluation API endpoint and handle temporary state memory gracefully.

# Comprehensive Sandbox Feature & UI Upgrades
1. Global Usage Analytics: Implement a public metric counter component displayed prominently on the landing page (e.g., "Total Ideas Evaluated On-Chain/Off-Chain: [Count]"). Fetch this dynamically from our database on load. Increment this number every time an evaluation API call completes successfully.
2. User Feedback Loop: At the bottom of the generated evaluation results interface, insert a minimal feedback text field and button: "Suggest an improvement to our workspace engine". Save submitted feedback strings directly into a `user_feedback` database table along with a timestamp.
3. Purpose of Wallet Connection: The 'Connect Wallet' feature must serve strictly as an upgrade pathway to convert a guest session into a permanent profile. 
4. The On-Chain Handshake: Once a user clicks the final "Save Profile to Base" call-to-action, invoke the wallet connection hooks. Bind the active session's temporary evaluation text, research blueprints, and dashboard templates directly to the connected `0x...` wallet address in our backend data schemas, initializing their profile layer.