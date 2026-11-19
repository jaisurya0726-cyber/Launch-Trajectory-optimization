import React, { useState } from "react";
import { STAGES_INFO, StageInfo } from "../data/stagesInfo";
import {
  Compass,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface StagesPipelineOverviewProps {
  activeTab?: number;
  onNavigateToStage: (stageId: number) => void;
  defaultExpanded?: boolean;
}

export const StagesPipelineOverview: React.FC<StagesPipelineOverviewProps> = ({
  activeTab = 0,
  onNavigateToStage,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "ALL",
    "Setup",
    "Physics Engine",
    "Classical Optimization",
    "Quantum Computing",
    "Analysis & Export",
  ];

  const filteredStages = STAGES_INFO.filter((s) => {
    if (selectedCategory === "ALL") return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3.5">
      {/* Overview Top Header & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Mission Workflow Pipeline (All 14 Stages)
              </h2>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-cyan-400 bg-slate-950 border border-slate-800">
                14 Stages
              </span>
            </div>
            <p className="text-xs text-slate-400">
              End-to-end space launch trajectory and quantum computing workflow stages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle (Grid vs List) */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Show grid view"
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Show list view"
            >
              List
            </button>
          </div>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? "Collapse stages overview" : "Expand stages overview"}
          >
            <span>{isExpanded ? "Hide Details" : "Show All Stages"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* When collapsed, display a sleek quick summary bar */}
      {!isExpanded && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              14 stages available: <strong className="text-slate-200">Stage 01 (Selection)</strong> through{" "}
              <strong className="text-slate-200">Stage 14 (Atmospheric Re-entry)</strong>.
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="space-y-3.5 pt-0.5">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredStages.map((stage: StageInfo) => {
                const Icon = stage.icon;
                const isCurrentStage = activeTab === stage.id;

                return (
                  <div
                    key={stage.id}
                    onClick={() => onNavigateToStage(stage.id)}
                    className={`group p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrentStage
                        ? "bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/30"
                        : "bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      {/* Top line: Stage number and category */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isCurrentStage
                                ? "bg-cyan-500 text-slate-950"
                                : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                          >
                            STAGE {stage.step}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${stage.badgeColor}`}>
                            {stage.category}
                          </span>
                        </div>
                        {isCurrentStage && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Title and Icon */}
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className={`p-1.5 rounded-md shrink-0 ${
                            isCurrentStage
                              ? "bg-cyan-500 text-slate-950"
                              : "bg-slate-900 text-cyan-400 border border-slate-800"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                            {stage.name}
                          </h3>
                        </div>
                      </div>

                      {/* Concise Description */}
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {stage.simpleDescription}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-cyan-300">
                      <span>Jump to Stage</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Sequential Pipeline List View */
            <div className="space-y-2">
              {filteredStages.map((stage: StageInfo, idx: number) => {
                const Icon = stage.icon;
                const isCurrentStage = activeTab === stage.id;

                return (
                  <div
                    key={stage.id}
                    onClick={() => onNavigateToStage(stage.id)}
                    className={`group p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrentStage
                        ? "bg-cyan-950/40 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40"
                        : "bg-slate-950/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isCurrentStage
                              ? "bg-cyan-500 text-slate-950"
                              : "bg-slate-900 text-slate-400 border border-slate-800"
                          }`}
                        >
                          {stage.step}
                        </span>
                      </div>

                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isCurrentStage
                            ? "bg-cyan-500 text-slate-950"
                            : "bg-slate-900 text-cyan-400 border border-slate-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {stage.name}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${stage.badgeColor}`}>
                            {stage.category}
                          </span>
                          {isCurrentStage && (
                            <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950 px-1 rounded border border-cyan-700/60">
                              ACTIVE STAGE
                            </span>
                          )}
                        </div>

                        {/* Brief summary */}
                        <div className="text-xs text-slate-300 font-medium">
                          {stage.simpleDescription}
                        </div>
                        <div className="text-[11px] text-slate-400 hidden md:block">
                          {stage.detailedBrief}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-[10px] font-mono text-slate-500 hidden lg:inline">
                        {stage.primaryKeyMetric}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToStage(stage.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
                          isCurrentStage
                            ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                            : "bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-slate-800 hover:border-cyan-800"
                        }`}
                      >
                        <span>{isCurrentStage ? "Viewing" : "Navigate"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
