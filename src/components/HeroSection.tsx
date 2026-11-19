import React, { useMemo, useRef, useState } from "react";
import { Mission } from "../types";
import { ArrowRight, Compass, Play, Atom, Activity, Orbit } from "lucide-react";

type SatelliteId = "primary" | "relay" | "tracker";

interface SatelliteTelemetry {
  id: SatelliteId;
  name: string;
  role: string;
  altitudeKm: number;
  speedKms: number;
  deltaVKms: number;
  inclinationDeg: number;
  periodMin: number;
  accent: "cyan" | "purple" | "amber";
}

const EARTH_MU_KM3_S2 = 398600.4418;
const EARTH_RADIUS_KM = 6371;

const computeOrbitalSpeedKms = (altitudeKm: number) =>
  Math.sqrt(EARTH_MU_KM3_S2 / (EARTH_RADIUS_KM + Math.max(120, altitudeKm)));

const computeOrbitalPeriodMin = (altitudeKm: number) => {
  const radius = EARTH_RADIUS_KM + Math.max(120, altitudeKm);
  return (2 * Math.PI * Math.sqrt((radius * radius * radius) / EARTH_MU_KM3_S2)) / 60;
};

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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const schematicRef = useRef<HTMLDivElement | null>(null);
  const [hoveredSat, setHoveredSat] = useState<{
    id: SatelliteId;
    xPct: number;
    yPct: number;
  } | null>(null);

  const satelliteTelemetry = useMemo<Record<SatelliteId, SatelliteTelemetry>>(() => {
    const primaryAlt = activeMission.altitude;
    const relayAlt = Math.round(activeMission.altitude * 1.35 + 280);
    const trackerAlt = Math.max(220, Math.round(activeMission.altitude * 0.65));

    return {
      primary: {
        id: "primary",
        name: activeMission.satellite_name,
        role: `Primary Payload · ${activeMission.target_orbit}`,
        altitudeKm: primaryAlt,
        speedKms: computeOrbitalSpeedKms(primaryAlt),
        deltaVKms: activeMission.delta_v,
        inclinationDeg: activeMission.inclination,
        periodMin: computeOrbitalPeriodMin(primaryAlt),
        accent: "cyan",
      },
      relay: {
        id: "relay",
        name: `${activeMission.mission_id} Quantum Relay`,
        role: "QAOA Telemetry Node",
        altitudeKm: relayAlt,
        speedKms: computeOrbitalSpeedKms(relayAlt),
        deltaVKms: activeMission.delta_v,
        inclinationDeg: Math.min(98.6, Number((activeMission.inclination + 14.5).toFixed(1))),
        periodMin: computeOrbitalPeriodMin(relayAlt),
        accent: "purple",
      },
      tracker: {
        id: "tracker",
        name: `${activeMission.mission_id} Ascent Tracker`,
        role: `${activeMission.rocket} Monitor`,
        altitudeKm: trackerAlt,
        speedKms: computeOrbitalSpeedKms(trackerAlt),
        deltaVKms: activeMission.delta_v,
        inclinationDeg: Math.max(5, Number((activeMission.inclination - 6.2).toFixed(1))),
        periodMin: computeOrbitalPeriodMin(trackerAlt),
        accent: "amber",
      },
    };
  }, [activeMission]);

  const handleSatelliteActivate = (id: SatelliteId, target: SVGGElement) => {
    svgRef.current?.pauseAnimations?.();
    const containerRect = schematicRef.current?.getBoundingClientRect();
    const satRect = target.getBoundingClientRect();

    if (containerRect && containerRect.width > 0 && containerRect.height > 0) {
      const centerX = satRect.left + satRect.width / 2 - containerRect.left;
      const centerY = satRect.top + satRect.height / 2 - containerRect.top;
      setHoveredSat({
        id,
        xPct: (centerX / containerRect.width) * 100,
        yPct: (centerY / containerRect.height) * 100,
      });
    } else {
      setHoveredSat({ id, xPct: 50, yPct: 40 });
    }
  };

  const handleSatelliteDeactivate = () => {
    setHoveredSat(null);
    svgRef.current?.unpauseAnimations?.();
  };

  const activeTooltipData = hoveredSat ? satelliteTelemetry[hoveredSat.id] : null;

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

              {/* Interactive Orbital Schematic */}
              <div
                ref={schematicRef}
                onMouseLeave={handleSatelliteDeactivate}
                className="relative h-36 w-full rounded-lg bg-[#050915]/90 border border-slate-800/80 p-2 flex items-center justify-center overflow-visible"
              >
                <svg
                  ref={svgRef}
                  className="w-full h-full"
                  viewBox="0 0 320 130"
                  role="img"
                  aria-label="Interactive Earth orbital map with hoverable satellites"
                >
                  <defs>
                    <radialGradient id="heroEarthOcean" cx="38%" cy="32%" r="68%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="40%" stopColor="#0284c7" />
                      <stop offset="78%" stopColor="#0c4a6e" />
                      <stop offset="100%" stopColor="#04182b" />
                    </radialGradient>
                    <radialGradient id="heroEarthAtmo" cx="50%" cy="50%" r="50%">
                      <stop offset="72%" stopColor="#38bdf8" stopOpacity="0" />
                      <stop offset="90%" stopColor="#38bdf8" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heroEarthShadow" cx="32%" cy="30%" r="72%">
                      <stop offset="55%" stopColor="#020617" stopOpacity="0" />
                      <stop offset="85%" stopColor="#020617" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0.82" />
                    </radialGradient>
                    <clipPath id="heroEarthClip">
                      <circle cx="160" cy="65" r="27.5" />
                    </clipPath>
                    <filter id="heroSatGlow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="1.6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="heroOrbitGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="1.4" result="orbitBlur" />
                      <feMerge>
                        <feMergeNode in="orbitBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Deep Space Starfield */}
                  <g fill="#cbd5e1" opacity="0.55">
                    <circle cx="24" cy="18" r="0.9" />
                    <circle cx="52" cy="108" r="0.8" />
                    <circle cx="76" cy="24" r="1.1" fill="#7dd3fc" />
                    <circle cx="112" cy="14" r="0.7" />
                    <circle cx="218" cy="15" r="0.9" />
                    <circle cx="256" cy="28" r="1.1" fill="#c084fc" />
                    <circle cx="294" cy="48" r="0.8" />
                    <circle cx="282" cy="104" r="1" fill="#7dd3fc" />
                    <circle cx="38" cy="76" r="0.7" />
                    <circle cx="198" cy="116" r="0.8" />
                    <circle cx="122" cy="118" r="0.9" />
                    <circle cx="298" cy="18" r="0.7" />
                  </g>

                  {/* Back Orbital Arcs (Behind Earth) — Soft Glow + Animated Dashed Trajectory */}
                  <g transform="translate(160, 65) rotate(-14)">
                    <path
                      d="M 110 0 A 110 35 0 1 0 -110 0"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.2"
                      strokeOpacity="0.16"
                      filter="url(#heroOrbitGlow)"
                    />
                    <path
                      d="M 110 0 A 110 35 0 1 0 -110 0"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1"
                      strokeOpacity="0.38"
                      strokeDasharray="6 5"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-22"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                  <g transform="translate(160, 65) rotate(22)">
                    <path
                      d="M 86 0 A 86 40 0 1 0 -86 0"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                      strokeOpacity="0.15"
                      filter="url(#heroOrbitGlow)"
                    />
                    <path
                      d="M 86 0 A 86 40 0 1 0 -86 0"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="1"
                      strokeOpacity="0.35"
                      strokeDasharray="5 5"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-20"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                  <g transform="translate(160, 65) rotate(8)">
                    <path
                      d="M 60 0 A 60 18 0 1 0 -60 0"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.8"
                      strokeOpacity="0.14"
                      filter="url(#heroOrbitGlow)"
                    />
                    <path
                      d="M 60 0 A 60 18 0 1 0 -60 0"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="0.9"
                      strokeOpacity="0.32"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-16"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>

                  {/* Earth Outer Atmospheric Glow */}
                  <circle cx="160" cy="65" r="35" fill="url(#heroEarthAtmo)" />

                  {/* Earth Sphere */}
                  <circle cx="160" cy="65" r="28" fill="url(#heroEarthOcean)" />

                  {/* Slowly Rotating Continents & Cloud Bands Clipped to Earth */}
                  <g clipPath="url(#heroEarthClip)">
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        from="-56 0"
                        to="0 0"
                        dur="26s"
                        repeatCount="indefinite"
                      />
                      {/* Tile 1 */}
                      <g fill="#10b981" fillOpacity="0.72">
                        <path d="M 136 46 Q 145 43 151 50 Q 154 57 148 63 Q 142 66 138 61 Z" />
                        <path d="M 146 66 Q 152 68 153 76 Q 150 84 145 82 Q 142 75 146 66 Z" />
                        <path d="M 164 47 Q 174 44 182 51 Q 185 59 178 64 Q 170 63 166 56 Z" />
                        <path d="M 167 62 Q 175 64 176 74 Q 172 82 167 78 Q 164 70 167 62 Z" />
                      </g>
                      {/* Tile 2 (Seamless Loop Copy +56px) */}
                      <g transform="translate(56, 0)" fill="#10b981" fillOpacity="0.72">
                        <path d="M 136 46 Q 145 43 151 50 Q 154 57 148 63 Q 142 66 138 61 Z" />
                        <path d="M 146 66 Q 152 68 153 76 Q 150 84 145 82 Q 142 75 146 66 Z" />
                        <path d="M 164 47 Q 174 44 182 51 Q 185 59 178 64 Q 170 63 166 56 Z" />
                        <path d="M 167 62 Q 175 64 176 74 Q 172 82 167 78 Q 164 70 167 62 Z" />
                      </g>
                    </g>

                    {/* Wispy Atmospheric Clouds */}
                    <g opacity="0.38" stroke="#e0f2fe" strokeLinecap="round" fill="none">
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        from="-56 0"
                        to="0 0"
                        dur="19s"
                        repeatCount="indefinite"
                      />
                      <path d="M 134 54 Q 146 51 158 55" strokeWidth="1.6" />
                      <path d="M 160 72 Q 172 70 184 74" strokeWidth="1.4" />
                      <path d="M 144 43 Q 156 41 168 44" strokeWidth="1.2" />
                      <g transform="translate(56, 0)">
                        <path d="M 134 54 Q 146 51 158 55" strokeWidth="1.6" />
                        <path d="M 160 72 Q 172 70 184 74" strokeWidth="1.4" />
                        <path d="M 144 43 Q 156 41 168 44" strokeWidth="1.2" />
                      </g>
                    </g>

                    {/* Subtle Day/Night Terminator Shading */}
                    <circle cx="160" cy="65" r="28" fill="url(#heroEarthShadow)" />
                  </g>

                  {/* Crisp Atmospheric Rim */}
                  <circle
                    cx="160"
                    cy="65"
                    r="28"
                    fill="none"
                    stroke="#7dd3fc"
                    strokeWidth="1"
                    strokeOpacity="0.65"
                  />

                  {/* Front Orbital Arcs (In Front of Earth) — Glowing Halo + Flowing Dashed Trajectories */}
                  <g transform="translate(160, 65) rotate(-14)">
                    <path
                      d="M -110 0 A 110 35 0 1 0 110 0"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.8"
                      strokeOpacity="0.28"
                      filter="url(#heroOrbitGlow)"
                    />
                    <path
                      d="M -110 0 A 110 35 0 1 0 110 0"
                      fill="none"
                      stroke="#67e8f9"
                      strokeWidth="1.25"
                      strokeOpacity="0.86"
                      strokeDasharray="6 5"
                      strokeLinecap="round"
                      filter="url(#heroOrbitGlow)"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-22"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Primary Mission Satellite (LEO / Target Orbit) */}
                    <g
                      filter="url(#heroSatGlow)"
                      className="cursor-pointer outline-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${satelliteTelemetry.primary.name}: Altitude ${satelliteTelemetry.primary.altitudeKm} km, Speed ${satelliteTelemetry.primary.speedKms.toFixed(2)} km/s`}
                      onMouseEnter={(e) => handleSatelliteActivate("primary", e.currentTarget)}
                      onMouseLeave={handleSatelliteDeactivate}
                      onFocus={(e) => handleSatelliteActivate("primary", e.currentTarget)}
                      onBlur={handleSatelliteDeactivate}
                    >
                      <animateMotion
                        dur="11s"
                        repeatCount="indefinite"
                        path="M 110 0 A 110 35 0 1 0 -110 0 A 110 35 0 1 0 110 0"
                      />
                      {/* Generous invisible hit area for effortless hovering */}
                      <circle cx="0" cy="0" r="14" fill="transparent" />
                      {hoveredSat?.id === "primary" && (
                        <circle
                          cx="0"
                          cy="0"
                          r="12"
                          fill="#22d3ee"
                          fillOpacity="0.14"
                          stroke="#67e8f9"
                          strokeWidth="1"
                          strokeDasharray="3 2"
                        />
                      )}
                      {/* Twin Solar Panels */}
                      <rect x="-10" y="-2.2" width="6.5" height="4.4" rx="0.6" fill="#0ea5e9" stroke="#bae6fd" strokeWidth="0.6" />
                      <rect x="3.5" y="-2.2" width="6.5" height="4.4" rx="0.6" fill="#0ea5e9" stroke="#bae6fd" strokeWidth="0.6" />
                      {/* Satellite Bus */}
                      <rect x="-2.6" y="-2.8" width="5.2" height="5.6" rx="1" fill="#f8fafc" stroke="#22d3ee" strokeWidth="0.8" />
                      {/* Beacon */}
                      <circle cx="0" cy="-4.3" r="1.1" fill="#22d3ee" />
                    </g>
                  </g>

                  <g transform="translate(160, 65) rotate(22)">
                    <path
                      d="M -86 0 A 86 40 0 1 0 86 0"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                      strokeOpacity="0.26"
                      filter="url(#heroOrbitGlow)"
                    />
                    <path
                      d="M -86 0 A 86 40 0 1 0 86 0"
                      fill="none"
                      stroke="#d8b4fe"
                      strokeWidth="1.15"
                      strokeOpacity="0.82"
                      strokeDasharray="5 5"
                      strokeLinecap="round"
                      filter="url(#heroOrbitGlow)"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-20"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Secondary Quantum Relay Satellite */}
                    <g
                      filter="url(#heroSatGlow)"
                      className="cursor-pointer outline-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${satelliteTelemetry.relay.name}: Altitude ${satelliteTelemetry.relay.altitudeKm} km, Speed ${satelliteTelemetry.relay.speedKms.toFixed(2)} km/s`}
                      onMouseEnter={(e) => handleSatelliteActivate("relay", e.currentTarget)}
                      onMouseLeave={handleSatelliteDeactivate}
                      onFocus={(e) => handleSatelliteActivate("relay", e.currentTarget)}
                      onBlur={handleSatelliteDeactivate}
                    >
                      <animateMotion
                        dur="15s"
                        begin="-4.5s"
                        repeatCount="indefinite"
                        path="M 86 0 A 86 40 0 1 0 -86 0 A 86 40 0 1 0 86 0"
                      />
                      <circle cx="0" cy="0" r="14" fill="transparent" />
                      {hoveredSat?.id === "relay" && (
                        <circle
                          cx="0"
                          cy="0"
                          r="11"
                          fill="#a855f7"
                          fillOpacity="0.16"
                          stroke="#d8b4fe"
                          strokeWidth="1"
                          strokeDasharray="3 2"
                        />
                      )}
                      <rect x="-8.5" y="-1.8" width="5.5" height="3.6" rx="0.5" fill="#7c3aed" stroke="#e9d5ff" strokeWidth="0.5" />
                      <rect x="3" y="-1.8" width="5.5" height="3.6" rx="0.5" fill="#7c3aed" stroke="#e9d5ff" strokeWidth="0.5" />
                      <rect x="-2.2" y="-2.2" width="4.4" height="4.4" rx="0.8" fill="#f5f3ff" stroke="#c084fc" strokeWidth="0.7" />
                    </g>
                  </g>

                  <g transform="translate(160, 65) rotate(8)">
                    <path
                      d="M -60 0 A 60 18 0 1 0 60 0"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.2"
                      strokeOpacity="0.24"
                      filter="url(#heroOrbitGlow)"
                    />
                    <path
                      d="M -60 0 A 60 18 0 1 0 60 0"
                      fill="none"
                      stroke="#fcd34d"
                      strokeWidth="1.05"
                      strokeOpacity="0.78"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                      filter="url(#heroOrbitGlow)"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-16"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Fast Inner Telemetry Satellite (Occludes Behind Earth) */}
                    <g
                      className="cursor-pointer outline-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${satelliteTelemetry.tracker.name}: Altitude ${satelliteTelemetry.tracker.altitudeKm} km, Speed ${satelliteTelemetry.tracker.speedKms.toFixed(2)} km/s`}
                      onMouseEnter={(e) => handleSatelliteActivate("tracker", e.currentTarget)}
                      onMouseLeave={handleSatelliteDeactivate}
                      onFocus={(e) => handleSatelliteActivate("tracker", e.currentTarget)}
                      onBlur={handleSatelliteDeactivate}
                    >
                      <animateMotion
                        dur="7.5s"
                        begin="-2s"
                        repeatCount="indefinite"
                        path="M 60 0 A 60 18 0 1 0 -60 0 A 60 18 0 1 0 60 0"
                      />
                      <animate
                        attributeName="opacity"
                        values="1;1;0;0;1;1"
                        keyTimes="0;0.16;0.20;0.30;0.34;1"
                        dur="7.5s"
                        begin="-2s"
                        repeatCount="indefinite"
                      />
                      <circle cx="0" cy="0" r="13" fill="transparent" />
                      {hoveredSat?.id === "tracker" && (
                        <circle
                          cx="0"
                          cy="0"
                          r="10"
                          fill="#f59e0b"
                          fillOpacity="0.16"
                          stroke="#fcd34d"
                          strokeWidth="1"
                          strokeDasharray="3 2"
                        />
                      )}
                      <rect x="-6.5" y="-1.4" width="4" height="2.8" rx="0.4" fill="#d97706" stroke="#fde68a" strokeWidth="0.45" />
                      <rect x="2.5" y="-1.4" width="4" height="2.8" rx="0.4" fill="#d97706" stroke="#fde68a" strokeWidth="0.45" />
                      <circle cx="0" cy="0" r="2.1" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.7" />
                    </g>
                  </g>

                  {/* Active Orbit Telemetry Tag */}
                  <text x="10" y="121" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">
                    {hoveredSat ? "ORBIT LOCKED · TELEMETRY" : "HOVER SAT FOR METRICS"}
                  </text>
                  <text x="310" y="121" fill="#22d3ee" fontSize="7.5" fontFamily="monospace" textAnchor="end">
                    {activeMission.target_orbit} {activeMission.altitude} km
                  </text>
                </svg>

                {/* Hover Telemetry Tooltip Tied to activeMission */}
                {hoveredSat && activeTooltipData && (
                  <div
                    role="tooltip"
                    style={{
                      left: `${Math.min(Math.max(hoveredSat.xPct, 24), 76)}%`,
                      top:
                        hoveredSat.yPct > 45
                          ? `${Math.max(hoveredSat.yPct - 14, 4)}%`
                          : `${Math.min(hoveredSat.yPct + 16, 94)}%`,
                      transform:
                        hoveredSat.yPct > 45
                          ? "translate(-50%, -100%)"
                          : "translate(-50%, 0)",
                    }}
                    className={`pointer-events-none absolute z-30 w-56 rounded-lg bg-[#050b1c]/95 backdrop-blur-md px-3 py-2.5 shadow-2xl border transition-opacity duration-150 ${
                      activeTooltipData.accent === "cyan"
                        ? "border-cyan-400/50"
                        : activeTooltipData.accent === "purple"
                        ? "border-purple-400/50"
                        : "border-amber-400/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">
                          {activeTooltipData.name}
                        </div>
                        <div
                          className={`text-[10px] font-mono truncate ${
                            activeTooltipData.accent === "cyan"
                              ? "text-cyan-300"
                              : activeTooltipData.accent === "purple"
                              ? "text-purple-300"
                              : "text-amber-300"
                          }`}
                        >
                          {activeTooltipData.role}
                        </div>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          activeTooltipData.accent === "cyan"
                            ? "bg-cyan-400"
                            : activeTooltipData.accent === "purple"
                            ? "bg-purple-400"
                            : "bg-amber-400"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono tabular-nums">
                      <div>
                        <span className="text-slate-400 block text-[9px] font-sans">Altitude</span>
                        <span className="text-white font-semibold">
                          {activeTooltipData.altitudeKm.toLocaleString()} km
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] font-sans">Orbital Speed</span>
                        <span className="text-cyan-300 font-semibold">
                          {activeTooltipData.speedKms.toFixed(2)} km/s
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] font-sans">Mission Δv</span>
                        <span className="text-slate-200 font-semibold">
                          {activeTooltipData.deltaVKms.toFixed(2)} km/s
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] font-sans">Incl. / Period</span>
                        <span className="text-slate-200 font-semibold">
                          {activeTooltipData.inclinationDeg}° · {Math.round(activeTooltipData.periodMin)}m
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
