# 🎨 The 5-Color Progress Spectrum (Vibe Definition)

Our workspace linear progress bars dynamically shift color states across a 5-point spectrum from Red to Green to provide intuitive, responsive, and data-driven feedback. This replaces traditional or static grading indices with a clear, visual alignment progress bar.

---

## 🎨 Spectrum Breakdown

Instead of arbitrary percentages or old-school letter grades, the workspace uses five distinct visual color states mapping progression from initialization to peak network synergy.

| Color State | Range | UI Vibe / Meaning | 🛠️ AI Improvement Suggestion |
| :--- | :--- | :--- | :--- |
| 🔴 **Red** | 0% - 19% | **Initialized** (System online, raw state) | *"Workspace initialized. Add your core summary details to begin calibration."* |
| 🟠 **Orange** | 20% - 39% | **Assembling** (Data structure detected) | *"Structure found. Elaborate further on your timeline milestones to expand signal."* |
| 🔵 **Blue** | 40% - 59% | **Syncing** (Midway anchor reached) | *"Good momentum. Complete the remaining profile inputs to lock down verification."* |
| 🟣 **Purple** | 60% - 79% | **Optimized** (High alignment, near capacity) | *"Almost complete! Attaching your contact node now will unlock live notifications."* |
| 🟢 **Green** | 80% - 100% | **Harmonized** (Peak network synergy) | *"Total synergy achieved. Your workspace parameters are fully optimized for the network."* |

---

## 💻 Tech Implementation Specs

- **Red State Class:** `bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]`
- **Orange State Class:** `bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]`
- **Blue State Class:** `bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]`
- **Purple State Class:** `bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]`
- **Green State Class:** `bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]`

Each linear progress bar component automatically displays its corresponding dynamic helper text (`text-zinc-400 text-xs mt-2`) underneath its track.
