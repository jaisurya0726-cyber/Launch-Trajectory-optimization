import React from "react";
import { Rocket, ArrowUp, Terminal, Cpu, Atom, Globe } from "lucide-react";
import { SINGLE_PAGE_SECTIONS } from "./SinglePageNavbar";

interface FooterSectionProps {
  historyCount: number;
  onNavigateSection: (sectionId: string) => void;
  onOpenGeminiChat: () => void;
}

const TECH_STACK = [
  "React 19",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "Three.js WebGL",
  "D3.js",
  "Recharts",
  "jsPDF",
  "Express API",
  "Python 3.10",
  "Qiskit Ising QAOA",
  "RK4 Integrator",
];

export const FooterSection: React.FC<FooterSectionProps> = ({
  historyCount,
  onNavigateSection,
  onOpenGeminiChat,
}) => {
  return (
    <footer id="contact" className="bg-[#03060f] border-t border-slate-800/90 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Project Identity & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400">
                <Rocket className="w-4 h-4" />
              </span>
              <div>
                <div className="text-base font-bold text-white tracking-tight">
                  Launch Trajectory &amp; Mission Quantum Optimization
                </div>
                <div className="text-xs font-mono text-cyan-400">AeroQuantum Research Platform</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              An academic spaceflight simulation and quantum mission-planning platform uniting
              4th-order Runge-Kutta orbital dynamics, classical multi-objective baselines,
              9-qubit QUBO Ising formulation, and QAOA statevector simulation.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-purple-400" />
                2⁹ Hilbert Space
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                {historyCount} Saved Runs
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                500 Mission Profiles
              </span>
            </div>
          </div>

          {/* Column 2: Section Navigation Mirror */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Sections
            </h3>
            <ul className="space-y-2 text-xs">
              {SINGLE_PAGE_SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateSection(sec.id);
                    }}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {sec.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#methodology"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection("methodology");
                  }}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Methodology
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Technology Stack & Academic Contact */}
          <div className="md:col-span-4 space-y-4">
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Technology Stack
              </h3>
              <div className="text-xs text-slate-300 leading-relaxed font-mono">
                {TECH_STACK.join(" · ")}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Academic Research &amp; Support
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For questions on the Python/Qiskit backend (models/, simulation/, tests/) or
                real-time mission parameter interpretation, consult the integrated AI assistant or
                inspect the unit-tested simulation suite.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={onOpenGeminiChat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-cyan-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Ask Gemini Copilot</span>
                </button>
                <button
                  onClick={() => onNavigateSection("home")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Academic Notice */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Launch Trajectory &amp; Mission Quantum Optimization (AeroQuantum). Academic Simulation Platform.
          </div>
          <div>
            Python 3.10 + Qiskit-Compatible Ising QAOA · Tsiolkovsky &amp; RK4 Dynamics
          </div>
        </div>
      </div>
    </footer>
  );
};
