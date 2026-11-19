import React from "react";
import { ScientificDisclaimer } from "./ScientificDisclaimer";
import { Compass, Target, AlertTriangle, Atom, Grid } from "lucide-react";

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      index: "01",
      title: "What Launch Trajectory Optimization Means",
      icon: Compass,
      accent: "text-cyan-400",
      body:
        "Launch trajectory optimization determines the ascent pitch profile, burn duration, and staging timeline that guide a rocket from the pad to target orbital insertion (LEO, SSO, MEO, GTO, GEO, or Lunar Transfer) while minimizing propellant mass, gravity drag, aerodynamic Max-Q stress, and thermal loads.",
    },
    {
      index: "02",
      title: "Why Mission Planning Is Critical",
      icon: Target,
      accent: "text-emerald-400",
      body:
        "Every kilogram of excess propellant directly reduces usable satellite payload capacity and raises launch expenditure ($M USD). Precise mission planning coordinates launch window timing, vehicle thrust-to-weight ratio (TWR), specific impulse (Isp), and atmospheric weather boundaries to maintain safe flight margins.",
    },
    {
      index: "03",
      title: "Challenges in Traditional Launch Optimization",
      icon: AlertTriangle,
      accent: "text-amber-400",
      body:
        "Spaceflight mission design couples continuous nonlinear flight dynamics (Tsiolkovsky mass depletion and RK4 equations of motion) with discrete combinatorial choices—launch windows, trajectory families, and propellant throttle reserves. As decision variables scale across multi-mission manifests, classical search spaces grow exponentially.",
    },
    {
      index: "04",
      title: "How Quantum Computing Improves Optimization",
      icon: Atom,
      accent: "text-purple-400",
      body:
        "Quantum computing encodes discrete configuration combinations into quantum superposition states across n qubits (2ⁿ simultaneous basis states). Through constructive and destructive interference driven by problem and mixer Hamiltonians, variational quantum algorithms amplify low-cost, constraint-satisfying mission states.",
    },
    {
      index: "05",
      title: "The Role of QUBO and QAOA",
      icon: Grid,
      accent: "text-cyan-300",
      body:
        "Discrete mission choices are formulated as a 9-variable Quadratic Unconstrained Binary Optimization (QUBO) matrix Cost(x) = xᵀQx with quadratic one-hot constraint penalties. Mapping binary variables xᵢ = (1 − Zᵢ)/2 produces an Ising Hamiltonian solved via the Quantum Approximate Optimization Algorithm (QAOA) and benchmarked directly against deterministic classical optimization.",
    },
  ];

  return (
    <section id="about" className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#060b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono text-cyan-400">01 · About the Project</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Bridging Orbital Flight Mechanics and Quantum Combinatorial Optimization
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              This academic research platform investigates how hybrid classical-quantum optimization
              can solve multi-objective spacecraft mission planning. By uniting physical ascent
              simulation with QUBO Ising formulation and QAOA statevector execution, engineers can
              evaluate trade-offs between fuel efficiency, cost, risk, and orbital accuracy in one
              transparent workspace.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/9]">
              <img
                src="/src/assets/images/quantum_orbital_processor_1795097760277.jpg"
                alt="Cryogenic quantum computing processor core with orbital coordinate pathways"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040814]/90 via-transparent to-transparent flex items-end p-4">
                <div className="text-xs font-mono text-slate-200">
                  9-Qubit Ising Cost Hamiltonian · Qiskit-Compatible QAOA Statevector
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Explanatory Cards (Asymmetric Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            const spanClass = idx === 4 ? "md:col-span-2 lg:col-span-2" : "";
            return (
              <article
                key={item.index}
                className={`glass-panel rounded-xl p-5 flex flex-col justify-between space-y-3 ${spanClass}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">{item.index}.</span>
                    <Icon className={`w-4 h-4 ${item.accent}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Academic Simulation Disclaimer */}
        <ScientificDisclaimer />
      </div>
    </section>
  );
};
