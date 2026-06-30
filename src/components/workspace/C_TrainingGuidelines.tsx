"use client";

// import { useState } from "react";
// import WorkspaceLevel2Modal from "./WorkspaceLevel2Modal";
// import RevealCrossIcon from "@/components/RevealCrossIcon";
// import { getThermalState } from "@/lib/utils";
// 
// export default function TrainingGuidelines() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
//   const thermal = getThermalState(90); // Use high-grade styling
// 
//   const resources = [
//     {
//       id: "textiles",
//       industry: "Artisan Textiles & Weaving",
//       icon: "🧵",
//       skills: ["Pattern Drafting Math", "Natural Pigment Dye Chemistry", "Ergonomics"],
//       links: [
//         { name: "John C. Campbell Folk School", desc: "Immersive in-person handweaving & spinning." },
//         { name: "Yarnworker School of Weaving", desc: "Rigid-heddle pattern setup & online instruction." },
//         { name: "School of SweetGeorgia", desc: "Multi-shaft weaving & plant-based dye science." }
//       ]
//     },
//     {
//       id: "farming",
//       industry: "Regenerative Farming & Agroecology",
//       icon: "🌾",
//       skills: ["Soil Food Web Analysis", "Composting Biology", "Holistic Grazing"],
//       links: [
//         { name: "Soil Food Web School (Dr. Elaine Ingham)", desc: "Scientific training in soil microbiology." },
//         { name: "Rodale Institute Certificates", desc: "Industry-leading organic farming training." },
//         { name: "Savory Institute", desc: "Holistic ranching & grazing planning." }
//       ]
//     },
//     {
//       id: "woodworking",
//       industry: "Fine Woodworking & Carpentry",
//       icon: "🪚",
//       skills: ["Precision Joinery", "Timber Behavior", "Shop & Hand Tool Safety"],
//       links: [
//         { name: "North Bennet Street School", desc: "Elite carpentry & cabinetmaking diplomas." },
//         { name: "North House Folk School", desc: "Traditional forest crafts & timber framing." },
//         { name: "Woodworkers Guild of America", desc: "Comprehensive step-by-step video training libraries." }
//       ]
//     },
//     {
//       id: "baking",
//       industry: "Artisan Baking & Fermentation",
//       icon: "🥖",
//       skills: ["Wild Yeast Cultivation", "High Hydration Sourdough", "Baker's Math"],
//       links: [
//         { name: "Institute of Culinary Education (ICE)", desc: "200-hour professional bread baking program." },
//         { name: "The School of Artisan Food", desc: "Sourdough & cheese-making diplomas (UK)." },
//         { name: "Bakers Research Organization (BRO)", desc: "Production scheduling & fermentation science." }
//       ]
//     },
//     {
//       id: "business",
//       industry: "Small Business & Sustainability",
//       icon: "⚖️",
//       skills: ["Sustainability Accounting", "Narrative Brand Storytelling", "Cottage Ordinance Licensing"],
//       links: [
//         { name: "USDA NRCS Portal", desc: "Guides to soil health & conservation planning." },
//         { name: "EIT Food Training", desc: "Circular food system business planning." }
//       ]
//     }
//   ];
// 
//   const filteredResources = selectedIndustry === "all" 
//     ? resources 
//     : resources.filter(r => r.id === selectedIndustry);
// 
//   return (
//     <>
//       {/* Level 1: Summary Card */}
//       <div
//         onClick={() => setIsOpen(true)}
//         className="workspace-pillar-summary-card"
//         style={{ "--thermal-color": thermal.colorHex } as React.CSSProperties}
//       >
//         <div className="workspace-reveal-trigger-content w-full">
//           <div className="workspace-pillar-content w-full flex-1">
//             <div className="flex items-center gap-4 w-full mb-1">
//               <h4 className="workspace-pillar-card-title">
//                 Personal Training & Mastery Suggestions
//               </h4>
//               <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] text-[#93c5fd]" title="Training / Professional Development">
//                 <svg className="w-3.5 h-3.5 text-[#3b82f6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//                   <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
//                 </svg>
//               </div>
//             </div>
//             <p className="workspace-pillar-card-subtitle text-left">
//               Professional pathways, skill suggestions, and vetted industry learning programs.
//             </p>
//             <p className="workspace-thermal-suggestion">Enhance operational longevity and heritage retention with structured learning resources.</p>
//           </div>
//         </div>
//         <div className="workspace-pillar-arrow-container">
//           <RevealCrossIcon isOpen={isOpen} className="workspace-pillar-arrow-icon" />
//         </div>
//       </div>
// 
//       {/* Level 2: Modal */}
//       <WorkspaceLevel2Modal
//         isOpen={isOpen}
//         onOpenChange={setIsOpen}
//         title="Personal Training & Skill Development"
//         icon=""
//         size="wide"
//       >
//         <div className="workspace-modal-scrollable custom-scrollbar space-y-6">
//           <div className="workspace-interpretation-card" style={{ borderColor: "rgba(59,130,246, 0.3)", background: "rgba(30, 41, 59, 0.2)" }}>
//             <h5 className="font-bold text-white mb-2 font-mono text-base uppercase flex items-center gap-2">
//               🎓 Personal Development Philosophy
//             </h5>
//             <p className="workspace-modal-text text-slate-300 leading-relaxed">
//               True artisanal mastery is built through a lifelong learning cycle. We believe personal training plans should cover three core categories:
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
//               <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
//                 <span className="font-bold text-blue-400 block mb-1">🛠️ Craft Safety & Basics</span>
//                 <span className="text-xs text-slate-400">Ergonomics, tool sharpening, raw material limits, and emergency protocols.</span>
//               </div>
//               <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
//                 <span className="font-bold text-blue-400 block mb-1">📐 Production Logistics</span>
//                 <span className="text-xs text-slate-400">Scaling math, ecological metrics, and carbon-footprint accounting.</span>
//               </div>
//               <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
//                 <span className="font-bold text-blue-400 block mb-1">🤝 Heritage Transfer</span>
//                 <span className="text-xs text-slate-400">Apprentice mentoring, local workshops, and community education.</span>
//               </div>
//             </div>
//           </div>
// 
//           {/* Selector / Filter Buttons */}
//           <div className="space-y-2">
//             <span className="text-sm font-bold text-slate-300 font-mono block">FILTER BY YOUR SPECIALTY:</span>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setSelectedIndustry("all")}
//                 className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition border ${
//                   selectedIndustry === "all"
//                     ? "bg-blue-600 text-white border-blue-500 shadow-md"
//                     : "bg-zinc-900 text-slate-400 border-zinc-800 hover:text-slate-200"
//                 }`}
//               >
//                 🌍 Show All
//               </button>
//               {resources.map(r => (
//                 <button
//                   key={r.id}
//                   onClick={() => setSelectedIndustry(r.id)}
//                   className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition border ${
//                     selectedIndustry === r.id
//                       ? "bg-blue-600 text-white border-blue-500 shadow-md"
//                       : "bg-zinc-900 text-slate-400 border-zinc-800 hover:text-slate-200"
//                   }`}
//                 >
//                   {r.icon} {r.industry.split(" & ")[0]}
//                 </button>
//               ))}
//             </div>
//           </div>
// 
//           {/* Curated Suggestions Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {filteredResources.map(r => (
//               <div key={r.id} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between">
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-2xl select-none">{r.icon}</span>
//                     <span className="font-bold text-slate-200 font-mono text-sm tracking-wide">{r.industry}</span>
//                   </div>
// 
//                   <span className="text-xs font-bold text-blue-400 uppercase font-mono block mb-1">Recommended Skills:</span>
//                   <div className="flex flex-wrap gap-1.5 mb-4">
//                     {r.skills.map(s => (
//                       <span key={s} className="px-2 py-0.5 rounded bg-blue-950/40 border border-blue-900/30 text-blue-300 text-[10px] font-mono">
//                         • {s}
//                       </span>
//                     ))}
//                   </div>
// 
//                   <span className="text-xs font-bold text-slate-400 uppercase font-mono block mb-2">Validated Academies & Resources:</span>
//                   <ul className="space-y-2.5">
//                     {r.links.map(link => (
//                       <li key={link.name} className="text-xs text-slate-300">
//                         <strong className="text-slate-100 font-medium block">{link.name}</strong>
//                         <span className="text-slate-400 text-[11px] block mt-0.5">{link.desc}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
// 
//           <div className="mt-4 p-4 rounded bg-zinc-950/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-left">
//               <strong className="text-sm font-mono text-white block mb-0.5">Looking for the detailed guide?</strong>
//               <span className="text-xs text-slate-400 leading-relaxed block">
//                 A full comprehensive training guide detailing local guilds, textbook foundations, and intermediate milestone targets is saved locally at <code className="px-1.5 py-0.5 bg-zinc-900 text-slate-300 rounded font-mono text-[11px]">docs/TRAINING_GUIDE.md</code>.
//               </span>
//             </div>
//           </div>
//         </div>
//       </WorkspaceLevel2Modal>
//     </>
//   );
// }

export default function TrainingGuidelines() {
  return null;
}
