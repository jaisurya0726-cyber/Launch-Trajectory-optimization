import React from "react";
import {
  Rocket,
  ArrowRight,
  Atom,
  Activity,
  Flame,
  Cpu,
  Sparkles,
  Sun,
  Moon,
  Compass,
  Globe,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface CoverPageProps {
  onGetStarted: (initialTab?: number) => void;
  onOpenGeminiChat?: () => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onGetStarted, onOpenGeminiChat }) => {
  const { isDark, toggleTheme } = useTheme();

  const handleLaunch = (tabIndex: number = 0) => {
    // Direct call with zero delay to prevent any white screen flash
    onGetStarted(tabIndex);
  };

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 ${
        isDark ? "bg-[#07090e] text-slate-200" : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-cyan-600/5 blur-[120px]" />
      </div>

      {/* =========================================================================
          TOP NAVIGATION BAR
          ========================================================================= */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20">
            <Rocket className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>AeroQuantum</span>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/60 uppercase">
                v2.4
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Mission Optimizer &amp; Quantum Computing Engine
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenGeminiChat && (
            <button
              onClick={onOpenGeminiChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 hover:from-cyan-900/90 hover:to-indigo-900/90 border border-cyan-500/50 text-cyan-200 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Chat with Gemini (AI Spaceflight Copilot)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chat with Gemini</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN HERO CONTENT
          ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-14 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Mission Description & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono text-cyan-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AEROSPACE FLIGHT DYNAMICS &amp; QUANTUM OPTIMIZATION</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Launch Trajectory &amp; Mission Quantum Optimization
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
                A dual classical and quantum optimization platform for spaceflight engineering. Simulate 4th-order Runge-Kutta rocket ascent trajectories, formulate 9-qubit combinatorial QUBO Ising Hamiltonians, execute QAOA statevector quantum circuits, and model hypersonic atmospheric re-entry aerothermal dynamics.
              </p>
            </div>

            {/* Quick Feature Highlights */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>RK4 Numerical Flight Dynamics</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Atom className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>9-Qubit QAOA Simulation</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Flame className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sutton-Graves Re-entry</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleLaunch(0)}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-mono text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleLaunch(2)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer"
              >
                <span>Explore Trajectory Sim</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>

            {/* Direct Workflow Phase Jump Shortcuts */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                Quick Jump to Workflow Phase:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleLaunch(0)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Stage 01: Catalog
                </button>
                <button
                  onClick={() => handleLaunch(2)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Stage 03: Trajectory
                </button>
                <button
                  onClick={() => handleLaunch(5)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Stage 06: QAOA Circuit
                </button>
                <button
                  onClick={() => handleLaunch(6)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Stage 07: Benchmark
                </button>
                <button
                  onClick={() => handleLaunch(13)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Stage 14: Re-entry
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visually Rich Aerospace Orbit & Quantum Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Outer Glow Halo */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 blur-2xl pointer-events-none" />

              {/* Concentric Rotating Orbital Rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-dashed border-indigo-500/30 animate-[spin_45s_linear_infinite_reverse]" />
              <div className="absolute inset-14 rounded-full border border-slate-800" />
              <div className="absolute inset-20 rounded-full border border-cyan-500/30 animate-[spin_30s_linear_infinite]" />

              {/* Central Globe Representation */}
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-slate-950 via-cyan-950 to-blue-950 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/30 flex items-center justify-center overflow-hidden">
                {/* Globe Wireframe Grids */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-cyan-500/30" />
                  <div className="absolute h-full w-[1px] bg-cyan-500/30" />
                  <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-5 rounded-full border border-dashed border-cyan-500/20" />
                </div>
                
                {/* Center Core Badge */}
                <div className="relative z-10 flex flex-col items-center">
                  <Globe className="w-8 h-8 text-cyan-400 mb-1" />
                  <span className="text-[10px] font-mono font-bold text-white tracking-widest">EARTH</span>
                  <span className="text-[9px] font-mono text-cyan-300">R = 6,371 km</span>
                </div>
              </div>

              {/* Floating Orbit Schematic SVG Overlays */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                {/* Inclined Orbit Ellipse */}
                <ellipse
                  cx="200"
                  cy="200"
                  rx="160"
                  ry="75"
                  transform="rotate(-28 200 200)"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  strokeOpacity="0.8"
                />

                {/* Ascent Trajectory Curve */}
                <path
                  d="M 170 230 Q 140 140 280 120"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Launch Pad Point */}
                <circle cx="170" cy="230" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                
                {/* Satellite Orbital Injection Point */}
                <circle cx="280" cy="120" r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                <circle cx="280" cy="120" r="10" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.6" />
              </svg>

              {/* Dynamic Floating Telemetry Badges */}
              <div className="absolute top-4 right-0 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-800/80 shadow-lg text-xs font-mono backdrop-blur-md">
                <div className="text-[9px] text-slate-400">TARGET ORBIT</div>
                <div className="text-cyan-300 font-bold">540 km LEO · 53.2°</div>
              </div>

              <div className="absolute bottom-6 left-0 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 shadow-lg text-xs font-mono backdrop-blur-md">
                <div className="text-[9px] text-slate-400">MISSION ΔV</div>
                <div className="text-emerald-400 font-bold">9.35 km/s (Nominal)</div>
              </div>

              <div className="absolute bottom-2 right-4 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-indigo-800/80 shadow-lg text-xs font-mono backdrop-blur-md">
                <div className="text-[9px] text-slate-400">HILBERT SPACE</div>
                <div className="text-indigo-300 font-bold">2⁹ = 512 States</div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CORE ARCHITECTURE CAPABILITIES (4 PILLARS)
            ========================================================================= */}
        <div className="pt-16 lg:pt-20 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Platform Architecture
              </h2>
              <div className="text-lg font-bold text-white tracking-tight mt-0.5">
                Complete End-to-End Mission Engineering
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400">14 Workflow Stages</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Card 1 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase text-white">
                  01. Ascent Trajectory
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                4th-order Runge-Kutta numerical integration with gravity turn, atmospheric drag, Max-Q aerodynamic limits, and live 3D Earth orbit visualization.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase text-white">
                  02. Classical Optimization
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Simulated annealing and combinatorial pruning balancing fuel consumption, launch cost, safety thresholds, and payload capacity margins.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-indigo-400">
                <Atom className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase text-white">
                  03. QAOA Quantum Circuit
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                9-qubit QUBO Ising Hamiltonian formulation solved via statevector evolution, evaluating quantum ground state convergence and fidelity.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase text-white">
                  04. Atmospheric Re-entry
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Hypersonic Sutton-Graves stagnation heat flux, TPS ablation recession (PICA-X, Carbon-Phenolic), and deceleration G-load profiles.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          QUIET ACADEMIC FOOTER
          ========================================================================= */}
      <footer className="relative z-20 w-full border-t border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-6 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          <span>AeroQuantum · Launch Trajectory &amp; Mission Quantum Optimization</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>RK4 Flight Dynamics</span>
          <span>·</span>
          <span>QUBO &amp; QAOA (2⁹ States)</span>
          <span>·</span>
          <span>500 Mission Catalog</span>
        </div>
      </footer>
    </div>
  );
};
