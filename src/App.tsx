/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import rawMissions from "./data/missions.json";
import { Mission, HistoryEntry } from "./types";
import { SinglePageNavbar } from "./components/SinglePageNavbar";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { MethodologySection } from "./components/MethodologySection";
import { FooterSection } from "./components/FooterSection";
import { MissionSelector } from "./components/MissionSelector";
import { MissionParameters } from "./components/MissionParameters";
import { TrajectorySimulationView } from "./components/TrajectorySimulationView";
import { ClassicalOptimizationView } from "./components/ClassicalOptimizationView";
import { QUBOView } from "./components/QUBOView";
import { QAOAView } from "./components/QAOAView";
import { ComparisonView } from "./components/ComparisonView";
import { FinalPlanView } from "./components/FinalPlanView";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { SensitivityAnalysisView } from "./components/SensitivityAnalysisView";
import { QuantumFidelityView } from "./components/QuantumFidelityView";
import { MissionInputView } from "./components/MissionInputView";
import { QuantumErrorCorrectionView } from "./components/QuantumErrorCorrectionView";
import { AtmosphericReentryView } from "./components/AtmosphericReentryView";
import { MissionHistoryModal } from "./components/MissionHistoryModal";
import { MissionLogbookSidebar } from "./components/MissionLogbookSidebar";
import { GeminiChatbotSidebar } from "./components/GeminiChatbotSidebar";
import { CodeSpaceModal } from "./components/CodeSpaceModal";
import { runClassicalOptimization, runQAOASimulation } from "./lib/optimization";
import {
  getMissionHistory,
  saveMissionToHistory,
  removeHistoryEntry,
  clearMissionHistory,
  updateHistoryEntryNotes,
} from "./lib/history";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import {
  Rocket,
  Sliders,
  Activity,
  Flame,
  Cpu,
  Grid,
  Atom,
  ShieldCheck,
  ShieldAlert,
  GitCompare,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Clock,
  CloudRain,
  Fuel,
  BarChart3,
  History,
  BookOpen,
  Code,
} from "lucide-react";

type PlanningTab = "catalog" | "parameters" | "trajectory" | "reentry";
type QuantumTab = "classical" | "qubo" | "qaoa" | "fidelity" | "qec";
type ResultsTab = "comparison" | "plan" | "sensitivity";

const OBSERVED_SECTION_IDS = [
  "home",
  "about",
  "mission-planning",
  "launch-parameters",
  "quantum-optimization",
  "results-analysis",
  "dashboard",
  "methodology",
  "contact",
];

function MainApp() {
  const { isDark } = useTheme();

  const missions: Mission[] = useMemo(() => {
    return (rawMissions as any[]).map((r) => ({
      mission_id: String(r.mission_id),
      satellite_name: String(r.satellite_name),
      data_type: r.data_type as "Reference" | "Synthetic",
      launch_date: String(r.launch_date),
      launch_time: String(r.launch_time),
      launch_site: String(r.launch_site),
      rocket: String(r.rocket),
      rocket_mass: Number(r.rocket_mass),
      fuel_mass: Number(r.fuel_mass),
      payload_capacity: Number(r.payload_capacity),
      thrust: Number(r.thrust),
      specific_impulse: Number(r.specific_impulse),
      payload_mass: Number(r.payload_mass),
      payload_volume: Number(r.payload_volume || 0),
      target_orbit: String(r.target_orbit),
      altitude: Number(r.altitude),
      inclination: Number(r.inclination),
      delta_v: Number(r.delta_v),
      flight_time: Number(r.flight_time),
      fuel_consumption: Number(r.fuel_consumption),
      weather_temperature: Number(r.weather_temperature),
      wind_speed: Number(r.wind_speed),
      rain: Number(r.rain),
      humidity: Number(r.humidity),
      safety_status: String(r.safety_status),
      launch_window_start: String(r.launch_window_start),
      launch_window_end: String(r.launch_window_end),
      launch_window_duration: Number(r.launch_window_duration),
      launch_cost: Number(r.launch_cost),
      risk_score: Number(r.risk_score),
      mission_priority: Number(r.mission_priority),
      trajectory_type: String(r.trajectory_type),
      cross_section_area: Number(r.cross_section_area || 10.0),
      drag_coefficient: Number(r.drag_coefficient || 0.32),
      fuel_margin: Number(r.fuel_margin || 0.05),
      payload_fraction: Number(r.payload_fraction || 0.02),
      thrust_to_weight_ratio: Number(r.thrust_to_weight_ratio || 1.3),
      mission_efficiency: Number(r.mission_efficiency || 100.0),
    }));
  }, []);

  const [selectedMission, setSelectedMission] = useState<Mission>(missions[0] || ({} as Mission));
  const [activeSection, setActiveSection] = useState<string>("home");
  const [planningTab, setPlanningTab] = useState<PlanningTab>("catalog");
  const [quantumTab, setQuantumTab] = useState<QuantumTab>("qaoa");
  const [resultsTab, setResultsTab] = useState<ResultsTab>("comparison");

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isCodeSpaceOpen, setIsCodeSpaceOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isLogbookOpen, setIsLogbookOpen] = useState<boolean>(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState<boolean>(false);

  // Load persisted history from localStorage
  useEffect(() => {
    const loaded = getMissionHistory();
    setHistory(loaded);
  }, []);

  // Live classical & QAOA summary for the Results & Analysis overview ribbon
  const liveOptimizationSummary = useMemo(() => {
    const classical = runClassicalOptimization(selectedMission);
    const qaoa = runQAOASimulation(selectedMission, 1, 1024);
    return { classical, qaoa };
  }, [selectedMission]);

  // Map current section to numeric index for Gemini context compatibility
  const activeTabIndex = useMemo(() => {
    switch (activeSection) {
      case "mission-planning":
        return planningTab === "catalog" ? 0 : planningTab === "parameters" ? 1 : planningTab === "trajectory" ? 2 : 13;
      case "launch-parameters":
        return 11;
      case "quantum-optimization":
        return quantumTab === "classical" ? 3 : quantumTab === "qubo" ? 4 : quantumTab === "qaoa" ? 5 : quantumTab === "fidelity" ? 10 : 12;
      case "results-analysis":
        return resultsTab === "comparison" ? 6 : resultsTab === "plan" ? 7 : 9;
      case "dashboard":
        return 8;
      default:
        return 0;
    }
  }, [activeSection, planningTab, quantumTab, resultsTab]);

  // Smooth scroll helper with URL anchor sync
  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
      if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, "", `#${sectionId}`);
      }
    }
  }, []);

  // Scroll to direct URL anchor on initial load if present
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && OBSERVED_SECTION_IDS.includes(hash)) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSection(hash);
        }
      }, 80);
    }
  }, []);

  // Scroll-spy using IntersectionObserver to highlight active navbar item
  useEffect(() => {
    const elements = OBSERVED_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const topId = visible[0].target.id;
          // Highlight Contact when viewing methodology or contact at bottom
          setActiveSection(topId === "methodology" ? "contact" : topId);
        }
      },
      {
        rootMargin: "-18% 0px -65% 0px",
        threshold: [0.05, 0.2, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const notesCount = useMemo(() => {
    return history.filter((h) => Boolean(h.notes && h.notes.trim().length > 0)).length;
  }, [history]);

  const handleSaveLogbookNote = (id: string, note: string, tags: string[]) => {
    const updated = updateHistoryEntryNotes(id, note, tags);
    setHistory(updated);
  };

  const persistCurrentRun = useCallback((m: Mission) => {
    const classical = runClassicalOptimization(m);
    const qaoa = runQAOASimulation(m, 1, 1024);
    const updated = saveMissionToHistory(m, classical, qaoa);
    setHistory(updated);
  }, []);

  const handleRunAll = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      persistCurrentRun(selectedMission);
      setResultsTab("comparison");
      scrollToSection("results-analysis");
    }, 350);
  };

  const handleJumpToSectionAndSubTab = (sectionId: string, subTab?: string) => {
    if (sectionId === "mission-planning" && subTab) {
      setPlanningTab(subTab as PlanningTab);
    } else if (sectionId === "quantum-optimization" && subTab) {
      setQuantumTab(subTab as QuantumTab);
    } else if (sectionId === "results-analysis" && subTab) {
      setResultsTab(subTab as ResultsTab);
    }
    scrollToSection(sectionId);
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setSelectedMission(entry.mission);
    setIsHistoryModalOpen(false);
    setResultsTab("comparison");
    scrollToSection("results-analysis");
  };

  const handleRemoveHistoryEntry = (id: string) => {
    const updated = removeHistoryEntry(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearMissionHistory();
    setHistory([]);
  };

  const { classical: liveClassical, qaoa: liveQaoa } = liveOptimizationSummary;
  const fuelEfficiencyPct = selectedMission.fuel_mass > 0
    ? Math.max(0, Math.min(100, ((selectedMission.fuel_mass - liveClassical.optimized.fuel_consumption_kg) / selectedMission.fuel_mass) * 100 + 85))
    : 92;

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-[#040814] text-slate-200" : "bg-[#f8fafc] text-slate-800"
      } flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200`}
    >
      {/* =====================================================================
          SECTION 1: STICKY SINGLE-PAGE NAVIGATION BAR
          ===================================================================== */}
      <SinglePageNavbar
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
        activeMission={selectedMission}
        historyCount={history.length}
        notesCount={notesCount}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenLogbook={() => setIsLogbookOpen(true)}
        isGeminiChatOpen={isGeminiChatOpen}
        onToggleGeminiChat={() => setIsGeminiChatOpen((prev) => !prev)}
        onOpenCodeSpace={() => setIsCodeSpaceOpen(true)}
      />

      <main className="flex-1 w-full">
        {/* ===================================================================
            SECTION 2: HERO / LANDING SECTION
            =================================================================== */}
        <HeroSection
          activeMission={selectedMission}
          missionCount={missions.length}
          onExploreProject={() => scrollToSection("about")}
          onStartOptimization={() => scrollToSection("launch-parameters")}
          onRunAll={handleRunAll}
          isSimulating={isSimulating}
        />

        {/* ===================================================================
            SECTION 3: ABOUT THE PROJECT
            =================================================================== */}
        <AboutSection />

        {/* ===================================================================
            SECTION 4: MISSION PLANNING
            =================================================================== */}
        <section
          id="mission-planning"
          className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#040814] space-grid-bg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="text-xs font-mono text-cyan-400">02 · Mission Planning</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Orbital Catalog, Vehicle Allocation &amp; Flight Dynamics
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Select a launch profile from the 500-mission dataset, inspect launch windows,
                  propellant margins, payload allocation, surface weather safety, 3D/2D RK4 ascent
                  trajectories, and atmospheric re-entry thermal loads.
                </p>
              </div>

              {/* Active Mission Quick Readout */}
              <div className="glass-panel rounded-xl px-4 py-3 text-xs font-mono shrink-0">
                <div className="text-slate-400">Active Mission Context</div>
                <div className="text-white font-semibold mt-0.5">
                  {selectedMission.mission_id} · {selectedMission.satellite_name}
                </div>
                <div className="text-cyan-400 mt-0.5">
                  {selectedMission.rocket} · {selectedMission.target_orbit} ({selectedMission.altitude} km)
                </div>
              </div>
            </div>

            {/* Key Mission Planning Dimensions Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Launch Window</span>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                  {selectedMission.launch_window_start}–{selectedMission.launch_window_end}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {selectedMission.launch_window_duration} min UTC
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Rocket &amp; TWR</span>
                  <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="font-mono font-semibold text-white mt-1 truncate">
                  {selectedMission.rocket}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                  TWR {selectedMission.thrust_to_weight_ratio.toFixed(2)} · Isp {selectedMission.specific_impulse}s
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Payload Allocation</span>
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                  {selectedMission.payload_mass.toLocaleString()} kg
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                  Cap: {selectedMission.payload_capacity.toLocaleString()} kg
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Orbit &amp; Altitude</span>
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                  {selectedMission.target_orbit} · {selectedMission.altitude} km
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                  Incl. {selectedMission.inclination}° · Δv {selectedMission.delta_v} km/s
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Fuel &amp; Weather</span>
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="font-mono font-semibold text-white mt-1 tabular-nums">
                  {selectedMission.wind_speed} m/s · {selectedMission.weather_temperature}°C
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                  Margin {(selectedMission.fuel_margin * 100).toFixed(1)}% · Rain {selectedMission.rain}mm
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Safety &amp; Risk</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div
                  className={`font-mono font-semibold mt-1 tabular-nums ${
                    selectedMission.risk_score > 60
                      ? "text-rose-400"
                      : selectedMission.risk_score > 30
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {selectedMission.risk_score} / 100
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {selectedMission.safety_status}
                </div>
              </div>
            </div>

            {/* Interactive Module Selector for Mission Planning */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 w-fit">
              <button
                onClick={() => setPlanningTab("catalog")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  planningTab === "catalog"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Mission Catalog (500)</span>
              </button>
              <button
                onClick={() => setPlanningTab("parameters")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  planningTab === "parameters"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Vehicle Specs &amp; Risk</span>
              </button>
              <button
                onClick={() => setPlanningTab("trajectory")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  planningTab === "trajectory"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Ascent Trajectory (3D &amp; RK4)</span>
              </button>
              <button
                onClick={() => setIsCodeSpaceOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                title="Open Code Space IDE beside Step 3"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Code Space</span>
              </button>
              <button
                onClick={() => setPlanningTab("reentry")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  planningTab === "reentry"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Atmospheric Re-entry</span>
              </button>
            </div>

            {/* Active Mission Planning Workspace */}
            <div>
              {planningTab === "catalog" && (
                <MissionSelector
                  missions={missions}
                  selectedMission={selectedMission}
                  onSelectMission={(m) => setSelectedMission(m)}
                  onProceed={() => setPlanningTab("parameters")}
                  onOpenCustomInput={() => scrollToSection("launch-parameters")}
                  hidePipelineOverview={true}
                />
              )}

              {planningTab === "parameters" && (
                <MissionParameters
                  mission={selectedMission}
                  onProceedToTrajectory={() => setPlanningTab("trajectory")}
                />
              )}

              {planningTab === "trajectory" && (
                <TrajectorySimulationView
                  mission={selectedMission}
                  onProceedToClassical={() => {
                    setQuantumTab("classical");
                    scrollToSection("quantum-optimization");
                  }}
                  onProceedToSensitivity={() => {
                    setResultsTab("sensitivity");
                    scrollToSection("results-analysis");
                  }}
                  onProceedToReentry={() => setPlanningTab("reentry")}
                />
              )}

              {planningTab === "reentry" && (
                <AtmosphericReentryView
                  mission={selectedMission}
                  onProceedToAscent={() => setPlanningTab("trajectory")}
                  onProceedToPlan={() => {
                    persistCurrentRun(selectedMission);
                    setResultsTab("plan");
                    scrollToSection("results-analysis");
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 5: LAUNCH PARAMETERS (CUSTOM INPUT & SOLVER)
            =================================================================== */}
        <section
          id="launch-parameters"
          className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#060b18]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono text-cyan-400">03 · Launch Parameters</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Interactive Mission Configuration &amp; Constraint Validation
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Configure rocket mass, fuel mass, thrust, specific impulse, payload mass, target
                altitude, Delta-V, weather conditions, safety constraints, launch cost, mission
                risk, and priority. Execute live classical, QUBO, and QAOA optimization directly
                from your custom specifications.
              </p>
            </div>

            <MissionInputView
              initialMission={selectedMission}
              onApplyMission={(m) => {
                setSelectedMission(m);
                persistCurrentRun(m);
              }}
              onProceedToComparison={() => {
                persistCurrentRun(selectedMission);
                setResultsTab("comparison");
                scrollToSection("results-analysis");
              }}
              onProceedToPlan={() => {
                persistCurrentRun(selectedMission);
                setResultsTab("plan");
                scrollToSection("results-analysis");
              }}
            />
          </div>
        </section>

        {/* ===================================================================
            SECTION 6: QUANTUM OPTIMIZATION WORKFLOW & SIMULATORS
            =================================================================== */}
        <section
          id="quantum-optimization"
          className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#040814] space-grid-bg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono text-purple-300">04 · Quantum Optimization</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                QUBO Ising Formulation &amp; 9-Qubit QAOA Quantum Circuit Engine
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Inspect the complete hybrid classical-quantum optimization pipeline—from discrete
                binary decision encoding and quadratic constraint penalties to parameterized QAOA
                circuits, 512-state statevector evolution, fidelity metrics, and QEC noise modeling.
              </p>
            </div>

            {/* Interactive 6-Stage Quantum Workflow Diagram */}
            <div className="glass-panel rounded-xl p-4 sm:p-5">
              <div className="text-xs font-mono text-slate-400 mb-3">
                End-to-End Quantum Optimization Pipeline (Click any stage to inspect)
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => scrollToSection("launch-parameters")}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  1. User Input
                </button>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => scrollToSection("launch-parameters")}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  2. Data Preprocessing
                </button>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => setQuantumTab("classical")}
                  className={`px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    quantumTab === "classical"
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200"
                  }`}
                >
                  3. Classical Optimization
                </button>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => setQuantumTab("qubo")}
                  className={`px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    quantumTab === "qubo"
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200"
                  }`}
                >
                  4. QUBO Formulation
                </button>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => setQuantumTab("qaoa")}
                  className={`px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    quantumTab === "qaoa"
                      ? "bg-purple-500 text-white border-purple-400 font-bold"
                      : "bg-purple-950/60 hover:bg-purple-900/70 border-purple-700/60 text-purple-200"
                  }`}
                >
                  5. QAOA Circuit
                </button>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <button
                  onClick={() => {
                    setResultsTab("comparison");
                    scrollToSection("results-analysis");
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-700/60 text-emerald-300 transition-colors cursor-pointer"
                >
                  6. Optimization Results
                </button>
              </div>
            </div>

            {/* Concise Technical Explanation Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-1.5">
                <div className="font-mono text-cyan-400 font-semibold">Binary Variables &amp; Objective</div>
                <p className="text-slate-300 leading-relaxed">
                  9 binary qubits encode Launch Window (x₁–x₃), Trajectory (x₄–x₆), and Propellant
                  Mode (x₇–x₉) to minimize weighted fuel, cost, risk, and Δv objectives.
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-1.5">
                <div className="font-mono text-amber-400 font-semibold">Constraint Penalties &amp; QUBO</div>
                <p className="text-slate-300 leading-relaxed">
                  Quadratic one-hot penalties P·(∑xᵢ − 1)² are embedded in the symmetric 9×9 QUBO
                  matrix Cost(x) = xᵀQx to penalize invalid multi-selection bitstrings.
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-1.5">
                <div className="font-mono text-purple-300 font-semibold">Quantum Circuit &amp; QAOA</div>
                <p className="text-slate-300 leading-relaxed">
                  Qiskit-compatible Ising mapping H_C = ∑hᵢZᵢ + ∑JᵢⱼZᵢZⱼ drives p alternating layers
                  of phase separator (γ) and transverse X-mixer (β) rotations.
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-1.5">
                <div className="font-mono text-emerald-400 font-semibold">Measurement &amp; Decoding</div>
                <p className="text-slate-300 leading-relaxed">
                  Projective sampling over 2⁹ = 512 states extracts the lowest-energy feasible
                  bitstring, decoded directly into operational launch timing and flight profiles.
                </p>
              </div>
            </div>

            {/* Interactive Quantum Engine Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 w-fit">
              <button
                onClick={() => setQuantumTab("classical")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  quantumTab === "classical"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Classical Baseline</span>
              </button>
              <button
                onClick={() => setQuantumTab("qubo")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  quantumTab === "qubo"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>QUBO Matrix</span>
              </button>
              <button
                onClick={() => setQuantumTab("qaoa")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  quantumTab === "qaoa"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>QAOA Simulator</span>
              </button>
              <button
                onClick={() => setQuantumTab("fidelity")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  quantumTab === "fidelity"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quantum Fidelity</span>
              </button>
              <button
                onClick={() => setQuantumTab("qec")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  quantumTab === "qec"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>QEC &amp; Noise Sim</span>
              </button>
            </div>

            {/* Active Quantum Module */}
            <div>
              {quantumTab === "classical" && (
                <ClassicalOptimizationView
                  mission={selectedMission}
                  onProceedToQUBO={() => setQuantumTab("qubo")}
                />
              )}

              {quantumTab === "qubo" && (
                <QUBOView
                  mission={selectedMission}
                  onProceedToQAOA={() => setQuantumTab("qaoa")}
                />
              )}

              {quantumTab === "qaoa" && (
                <QAOAView
                  mission={selectedMission}
                  onProceedToComparison={() => {
                    persistCurrentRun(selectedMission);
                    setResultsTab("comparison");
                    scrollToSection("results-analysis");
                  }}
                  onProceedToFidelity={() => {
                    persistCurrentRun(selectedMission);
                    setQuantumTab("fidelity");
                  }}
                  onProceedToQEC={() => {
                    persistCurrentRun(selectedMission);
                    setQuantumTab("qec");
                  }}
                />
              )}

              {quantumTab === "fidelity" && (
                <QuantumFidelityView
                  mission={selectedMission}
                  onProceedToComparison={() => {
                    persistCurrentRun(selectedMission);
                    setResultsTab("comparison");
                    scrollToSection("results-analysis");
                  }}
                  onProceedToQAOA={() => setQuantumTab("qaoa")}
                  onProceedToQEC={() => setQuantumTab("qec")}
                />
              )}

              {quantumTab === "qec" && (
                <QuantumErrorCorrectionView
                  mission={selectedMission}
                  onProceedToQAOA={() => setQuantumTab("qaoa")}
                  onProceedToFidelity={() => setQuantumTab("fidelity")}
                  onProceedToComparison={() => {
                    persistCurrentRun(selectedMission);
                    setResultsTab("comparison");
                    scrollToSection("results-analysis");
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 7: RESULTS & ANALYSIS
            =================================================================== */}
        <section
          id="results-analysis"
          className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#060b18]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono text-cyan-400">05 · Results &amp; Analysis</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Classical vs. Quantum Benchmarks, Mission Plan &amp; Sensitivity
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Review the selected optimal launch configuration, propellant efficiency, estimated
                cost, risk reduction, Pareto comparisons, dispersion sensitivity sweeps, and export
                complete CSV or PDF mission dossiers.
              </p>
            </div>

            {/* Executive Optimization Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono tabular-nums">
              <div className="glass-panel rounded-xl p-3.5 col-span-2 md:col-span-1 lg:col-span-2">
                <div className="text-[11px] font-sans text-slate-400">Selected Launch Configuration</div>
                <div className="text-xs font-semibold text-cyan-300 mt-1 leading-snug">
                  {liveClassical.selected_configuration.window_name} ·{" "}
                  {liveClassical.selected_configuration.trajectory_name} ·{" "}
                  {liveClassical.selected_configuration.mode_name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  QAOA Bitstring: <span className="text-purple-300">{liveQaoa.best_candidate.bitstring}</span>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-[11px] font-sans text-slate-400 flex items-center justify-between">
                  <span>Fuel Efficiency</span>
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {fuelEfficiencyPct.toFixed(1)}%
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {liveClassical.optimized.fuel_consumption_kg.toLocaleString()} kg burn
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-[11px] font-sans text-slate-400">Est. Launch Cost</div>
                <div className="text-lg font-bold text-white mt-1">
                  ${liveClassical.optimized.launch_cost_musd.toFixed(2)}M
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Payload: {selectedMission.payload_mass.toLocaleString()} kg
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-[11px] font-sans text-slate-400">Mission Risk</div>
                <div className="text-lg font-bold text-amber-400 mt-1">
                  {liveClassical.optimized.risk_score.toFixed(1)}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  QAOA: {liveQaoa.decoded_plan.risk_score.toFixed(1)}/100
                </div>
              </div>

              <div className="glass-panel rounded-xl p-3.5">
                <div className="text-[11px] font-sans text-slate-400">Objective Score</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">
                  {liveClassical.optimized.objective_value.toFixed(2)}
                </div>
                <div className="text-[11px] text-purple-300 mt-0.5">
                  QAOA: {liveQaoa.decoded_plan.objective_value.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Interactive Results Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 w-fit">
              <button
                onClick={() => setResultsTab("comparison")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  resultsTab === "comparison"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Classical vs. Quantum Comparison</span>
              </button>
              <button
                onClick={() => setResultsTab("plan")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  resultsTab === "plan"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Final Mission Plan &amp; Exports</span>
              </button>
              <button
                onClick={() => setResultsTab("sensitivity")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  resultsTab === "sensitivity"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>D3 Sensitivity &amp; Monte Carlo</span>
              </button>
            </div>

            {/* Active Results Sub-Module */}
            <div>
              {resultsTab === "comparison" && (
                <ComparisonView
                  mission={selectedMission}
                  onProceedToPlan={() => setResultsTab("plan")}
                  history={history}
                  allMissions={missions}
                  onOpenLogbook={() => setIsLogbookOpen(true)}
                  onSelectMission={(m) => setSelectedMission(m)}
                  onSaveCurrentToHistory={persistCurrentRun}
                />
              )}

              {resultsTab === "plan" && <FinalPlanView mission={selectedMission} />}

              {resultsTab === "sensitivity" && (
                <SensitivityAnalysisView
                  mission={selectedMission}
                  onUpdateMission={(updated) => setSelectedMission(updated)}
                  onProceedToOptimization={() => {
                    setQuantumTab("classical");
                    scrollToSection("quantum-optimization");
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 8: RESEARCH ANALYTICS DASHBOARD
            =================================================================== */}
        <section
          id="dashboard"
          className="py-16 lg:py-20 border-b border-slate-800/80 bg-[#040814]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="text-xs font-mono text-cyan-400">06 · Analytics Dashboard</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Mission Telemetry Trends, Cost Scaling &amp; Run History
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Track cost-per-kilogram scaling, classical versus quantum convergence across saved
                  iterations, propellant conservation trends, and export filtered analytics reports.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Saved Runs ({history.length})</span>
                </button>
                <button
                  onClick={() => setIsLogbookOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mission Logbook ({notesCount})</span>
                </button>
                <button
                  onClick={() => {
                    persistCurrentRun(selectedMission);
                    setResultsTab("plan");
                    scrollToSection("results-analysis");
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Save Snapshot &amp; Export</span>
                </button>
              </div>
            </div>

            <AnalyticsDashboard
              history={history}
              allMissions={missions}
              onSelectMission={(m) => {
                setSelectedMission(m);
                setResultsTab("comparison");
                scrollToSection("results-analysis");
              }}
              onOpenHistory={() => setIsHistoryModalOpen(true)}
            />
          </div>
        </section>

        {/* ===================================================================
            SECTION 9: METHODOLOGY
            =================================================================== */}
        <MethodologySection onJumpToSection={handleJumpToSectionAndSubTab} />
      </main>

      {/* =====================================================================
          SECTION 10: CONTACT & FOOTER
          ===================================================================== */}
      <FooterSection
        historyCount={history.length}
        onNavigateSection={scrollToSection}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
      />

      {/* Persistent Modals & Drawers */}
      <MissionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelectEntry={handleSelectHistoryEntry}
        onRemoveEntry={handleRemoveHistoryEntry}
        onClearHistory={handleClearHistory}
        onNavigateToAnalytics={() => scrollToSection("dashboard")}
        onOpenLogbook={() => setIsLogbookOpen(true)}
      />

      <MissionLogbookSidebar
        isOpen={isLogbookOpen}
        onClose={() => setIsLogbookOpen(false)}
        history={history}
        onSaveNote={handleSaveLogbookNote}
        onSelectMission={handleSelectHistoryEntry}
      />

      <GeminiChatbotSidebar
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        activeMission={selectedMission}
        activeTab={activeTabIndex}
      />

      <CodeSpaceModal
        isOpen={isCodeSpaceOpen}
        onClose={() => setIsCodeSpaceOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
