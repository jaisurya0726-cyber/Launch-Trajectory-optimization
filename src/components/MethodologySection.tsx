import React from "react";
import {
  Database,
  Sliders,
  Cpu,
  Grid,
  Atom,
  Activity,
  Scale,
  CheckCircle2,
} from "lucide-react";

interface MethodologySectionProps {
  onJumpToSection: (sectionId: string, subTab?: string) => void;
}

const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "Data Collection",
    icon: Database,
    targetSection: "mission-planning",
    summary:
      "Compile 500 validated launch mission profiles spanning reference orbital flights (ISRO, NASA, ESA, commercial launchers) and physics-calibrated synthetic profiles across LEO, SSO, MEO, GTO, GEO, and Lunar Transfer orbits.",
    detail: "data/launch_missions.csv · 36 aerospace & weather telemetry features",
  },
  {
    step: "02",
    title: "Data Preprocessing",
    icon: Sliders,
    targetSection: "launch-parameters",
    summary:
      "Validate physical boundaries, normalize multi-scale features (mass, thrust, Isp, wind, precipitation, risk), and derive Tsiolkovsky propellant margins, liftoff TWR, and ISA atmospheric density profiles.",
    detail: "preprocessing/ · Tsiolkovsky & ISA calibration",
  },
  {
    step: "03",
    title: "Classical Baseline",
    icon: Cpu,
    targetSection: "quantum-optimization",
    subTab: "classical",
    summary:
      "Evaluate all 27 discrete mission configurations (3 launch windows × 3 ascent profiles × 3 throttle modes) using a deterministic weighted multi-objective cost function to establish exact ground-truth benchmarks.",
    detail: "models/classical_optimizer.py · Deterministic exact solver",
  },
  {
    step: "04",
    title: "QUBO Formulation",
    icon: Grid,
    targetSection: "quantum-optimization",
    subTab: "qubo",
    summary:
      "Encode the 9 binary decision variables x₁…x₉ into a symmetric 9×9 QUBO matrix Q with quadratic one-hot penalty terms (P = 120) guaranteeing exactly one window, one trajectory, and one throttle mode.",
    detail: "models/qubo_formulation.py · Cost(x) = xᵀQx",
  },
  {
    step: "05",
    title: "QAOA Implementation",
    icon: Atom,
    targetSection: "quantum-optimization",
    subTab: "qaoa",
    summary:
      "Transform the QUBO cost matrix via xᵢ = (1 − Zᵢ)/2 into an Ising spin Hamiltonian H_C and construct the parameterized p-layer QAOA circuit alternating cost unitary e^(-iγH_C) and mixer unitary e^(-iβH_B).",
    detail: "models/qaoa_solver.py · Qiskit-compatible Ising ansatz",
  },
  {
    step: "06",
    title: "Quantum Simulation",
    icon: Activity,
    targetSection: "quantum-optimization",
    subTab: "fidelity",
    summary:
      "Evolve the 9-qubit quantum statevector across all 2⁹ = 512 basis eigenstates, perform projective shot sampling (256–2048 shots), and assess NISQ gate decoherence, state fidelity, and Surface/Steane QEC recovery.",
    detail: "512-state statevector · Bloch sphere & noise modeling",
  },
  {
    step: "07",
    title: "Performance Comparison",
    icon: Scale,
    targetSection: "results-analysis",
    summary:
      "Benchmark classical versus quantum solutions transparently across multi-objective score, fuel consumption (kg), launch cost ($M), composite risk score, constraint feasibility, and execution latency.",
    detail: "evaluation/ · Side-by-side & historical overlay",
  },
  {
    step: "08",
    title: "Final Mission Optimization",
    icon: CheckCircle2,
    targetSection: "results-analysis",
    subTab: "plan",
    summary:
      "Verify the winning configuration via 4th-order Runge-Kutta ascent integration and Sutton-Graves re-entry aerothermal modeling, producing an operational flight burn timeline and downloadable CSV/PDF dossier.",
    detail: "simulation/trajectory_rk4.py · PDF & CSV export engine",
  },
];

export const MethodologySection: React.FC<MethodologySectionProps> = ({ onJumpToSection }) => {
  return (
    <section id="methodology" className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#060b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-mono text-purple-300">07 · Research Methodology</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Eight-Stage Scientific &amp; Quantum Optimization Pipeline
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every computation in the platform follows a reproducible academic pipeline linking
            numerical rocket physics with discrete QUBO/QAOA quantum optimization.
          </p>
        </div>

        {/* 8-Step Methodology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {METHODOLOGY_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => onJumpToSection(item.targetSection, item.subTab)}
                className="text-left glass-panel rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-cyan-500/40 transition-colors cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Step {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 truncate">
                  {item.detail}
                </div>
              </button>
            );
          })}
        </div>

        {/* Core Mathematical Equations Reference Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-2">
            <div className="text-xs font-mono text-cyan-400">
              Tsiolkovsky Propellant &amp; RK4 Ascent Dynamics
            </div>
            <div className="font-mono text-xs text-slate-200 bg-slate-900/80 border border-slate-800 rounded-lg p-3 overflow-x-auto">
              Δv = I_sp · g₀ · ln((m_dry + m_fuel + m_payload) / (m_dry + m_payload))
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-900/80 border border-slate-800 rounded-lg p-3 overflow-x-auto">
              dv/dt = (T(t) − ½ρ(h)v²C_D A) / m(t) − g(h) sin(γ)
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-2">
            <div className="text-xs font-mono text-purple-300">
              QUBO Cost &amp; QAOA Parameterized Quantum Evolution
            </div>
            <div className="font-mono text-xs text-slate-200 bg-slate-900/80 border border-slate-800 rounded-lg p-3 overflow-x-auto">
              min E(x) = xᵀ Q x + P·[(∑x₁..₃−1)² + (∑x₄..₆−1)² + (∑x₇..₉−1)²]
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-900/80 border border-slate-800 rounded-lg p-3 overflow-x-auto">
              |ψ(γ, β)⟩ = ∏_(l=1..p) exp(−iβ_l H_B) exp(−iγ_l H_C) |+⟩^(⊗9)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
