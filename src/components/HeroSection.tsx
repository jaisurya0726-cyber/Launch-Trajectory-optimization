import React from "react";
import { Mission } from "../types";
import { ArrowRight, Compass, Play, Atom, Activity, Orbit } from "lucide-react";

interface HeroSectionProps {
  activeMission: Mission;
  missionCount: number;
  onExploreProject: () => void;
  onStartOptimization: () => void;
  onRunAll: () => void;
  isSimulating: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeMission,
  missionCount,
  onExploreProject,
  onStartOptimization,
  onRunAll,
  isSimulating,
}) => {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-slate-800/80 bg-[#040814]"
    >
      {/* Space-Themed Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src="/src/assets/images/hero_orbital_launch_1795097762262.jpg"
          alt="Orbital launch vehicle ascending into low Earth orbit alongside a scientific satellite"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040814] via-[#040814]/88 to-[#040814]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-transparent to-[#040814]/65" />
      </div>

      {/* Subtle Orbital Geometry Overlay */}
      <svg
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none hidden lg:block"
        viewBox="0 0 600 500"
        fill="none"
      >
        <circle cx="480" cy="420" r="320" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="480" cy="420" r="240" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 6" />
        <path d="M 120 460 Q 260 180 560 95" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 4" />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Focal Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
              <span>Aerospace Flight Dynamics</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>QUBO &amp; QAOA Quantum Computing</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-purple-300">9-Qubit Statevector Engine</span>
            </div>

            <div className="space-y-4">
              <h1
                className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.1]"
                style={{ textWrap: "balance" }}
              >
                Launch Trajectory &amp; Mission Quantum Optimization
              </h1>
              <p className="text-lg sm:text-xl font-medium text-cyan-300 leading-snug max-w-2xl">
                Optimizing the Future of Space Exploration Through Quantum Computing.
              </p>
              <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed max-w-2xl">
                An academic aerospace simulation and quantum optimization platform combining
                4th-order Runge-Kutta (RK4) ascent dynamics, atmospheric re-entry aerothermal modeling,
                combinatorial classical baselines, and Qiskit-compatible 9-qubit QAOA Ising Hamiltonians
                to evaluate launch windows, trajectory profiles, fuel efficiency, and mission safety.
              </p>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onStartOptimization}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Start Optimization</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreProject}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Project</span>
              </button>

              <button
                onClick={onRunAll}
                disabled={isSimulating}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 hover:text-white font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current text-purple-300" />
                <span>{isSimulating ? "Running Pipeline..." : "Run Active Mission"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Glassmorphism Mission Telemetry Overview Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <div className="text-xs font-mono text-cyan-400">Active Loaded Mission</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {activeMission.mission_id} — {activeMission.satellite_name}
                  </div>
                </div>
                <Orbit className="w-5 h-5 text-cyan-400 shrink-0" />
              </div>

              {/* Clean Orbital Schematic */}
              <div className="h-36 w-full rounded-lg bg-[#050915]/90 border border-slate-800/80 p-2 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 320 130" role="img" aria-label="Orbital ascent trajectory schematic">
                  <line x1="16" y1="68" x2="304" y2="68" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="160" y1="10" x2="160" y2="122" stroke="#1e293b" strokeDasharray="3 3" />
                  <circle cx="160" cy="68" r="28" fill="#081326" stroke="#0ea5e9" strokeWidth="1.5" />
                  <ellipse cx="160" cy="68" rx="28" ry="10" fill="none" stroke="#38bdf8" strokeOpacity="0.4" strokeDasharray="2 2" />
                  <text x="160" y="71" fill="#7dd3fc" fontSize="8" fontFamily="monospace" textAnchor="middle">EARTH</text>
                  <ellipse cx="160" cy="68" rx="108" ry="44" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />
                  <path d="M 68 106 Q 108 26 238 35" fill="none" stroke="#22d3ee" strokeWidth="2" />
                  <circle cx="68" cy="106" r="3.5" fill="#f59e0b" />
                  <text x="58" y="120" fill="#94a3b8" fontSize="8" fontFamily="monospace">T+0 Pad</text>
                  <circle cx="122" cy="54" r="3.5" fill="#a855f7" />
                  <text x="122" y="44" fill="#c084fc" fontSize="8" fontFamily="monospace" textAnchor="middle">Max-Q</text>
                  <circle cx="238" cy="35" r="4" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" />
                  <text x="246" y="33" fill="#22d3ee" fontSize="8" fontFamily="monospace">
                    {activeMission.target_orbit} {activeMission.altitude} km
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono tabular-nums">
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-slate-400 text-[11px] font-sans">Launch Vehicle</div>
                  <div className="text-white font-semibold mt-0.5 truncate">{activeMission.rocket}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-slate-400 text-[11px] font-sans">Required Δv</div>
                  <div className="text-cyan-400 font-semibold mt-0.5">{activeMission.delta_v} km/s</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-slate-400 text-[11px] font-sans">Payload Mass</div>
                  <div className="text-white font-semibold mt-0.5">{activeMission.payload_mass.toLocaleString()} kg</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-slate-400 text-[11px] font-sans">Safety Status</div>
                  <div
                    className={`font-semibold mt-0.5 truncate ${
                      activeMission.safety_status.includes("HIGH")
                        ? "text-rose-400"
                        : activeMission.safety_status.includes("MODERATE")
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {activeMission.safety_status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Capabilities Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/70">
          <div className="glass-panel rounded-xl p-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Validated Mission Catalog</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">
              {missionCount} <span className="text-xs font-normal text-slate-400">profiles</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Reference &amp; physics-calibrated missions</div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Quantum Register Space</span>
              <Atom className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-purple-300 mt-1 tabular-nums">
              9 Qubits <span className="text-xs font-normal text-slate-400">(512 states)</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Ising Hamiltonian QAOA statevector</div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Ascent Integrator</span>
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
              RK4 <span className="text-xs font-normal text-slate-400">Δt = 2.0 s</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Gravity turn, drag &amp; Max-Q dynamics</div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Combinatorial Search</span>
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
              3 × 3 × 3 <span className="text-xs font-normal text-slate-400">configs</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Windows, trajectories &amp; throttle modes</div>
          </div>
        </div>
      </div>
    </section>
  );
};
