import React, { useState } from "react";
import { Mission } from "../types";
import {
  Rocket,
  Menu,
  X,
  History,
  BookOpen,
  Sparkles,
  Code,
} from "lucide-react";

export interface NavSectionItem {
  id: string;
  label: string;
}

export const SINGLE_PAGE_SECTIONS: NavSectionItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Project" },
  { id: "mission-planning", label: "Mission Planning" },
  { id: "launch-parameters", label: "Launch Parameters" },
  { id: "quantum-optimization", label: "Quantum Optimization" },
  { id: "results-analysis", label: "Results & Analysis" },
  { id: "dashboard", label: "Dashboard" },
  { id: "contact", label: "Contact" },
];

interface SinglePageNavbarProps {
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  activeMission: Mission;
  historyCount: number;
  notesCount: number;
  onOpenHistory: () => void;
  onOpenLogbook: () => void;
  isGeminiChatOpen: boolean;
  onToggleGeminiChat: () => void;
  onOpenCodeSpace: () => void;
}

export const SinglePageNavbar: React.FC<SinglePageNavbarProps> = ({
  activeSection,
  onNavigateSection,
  activeMission,
  historyCount,
  notesCount,
  onOpenHistory,
  onOpenLogbook,
  isGeminiChatOpen,
  onToggleGeminiChat,
  onOpenCodeSpace,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#040814]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, "home")}
          className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
        >
          <span className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Rocket className="w-4 h-4" />
          </span>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-tight whitespace-normal max-w-[160px] sm:max-w-[205px] xl:max-w-[190px] 2xl:max-w-[230px]">
            Launch Trajectory &amp; Mission Quantum Optimization
          </span>
        </a>

        {/* Zone 2: Desktop Section Navigation Links */}
        <nav
          aria-label="Primary sections"
          className="hidden xl:flex items-center gap-5 text-[13px] font-medium"
        >
          {SINGLE_PAGE_SECTIONS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  isActive
                    ? "text-cyan-400 border-cyan-400 font-semibold"
                    : "text-slate-300 border-transparent hover:text-white hover:border-slate-600"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Workspace Tools & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenHistory}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Mission Run History"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">History</span>
            <span className="font-mono text-[11px] text-cyan-400 tabular-nums">{historyCount}</span>
          </button>

          <button
            onClick={onOpenLogbook}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Engineering Mission Logbook"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Logbook</span>
            {notesCount > 0 && (
              <span className="font-mono text-[11px] text-cyan-400 tabular-nums">{notesCount}</span>
            )}
          </button>

          <button
            onClick={onOpenCodeSpace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            title="Toggle Code Space IDE"
          >
            <Code className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
            <span className="hidden md:inline">Code Space</span>
          </button>

          <button
            onClick={onToggleGeminiChat}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isGeminiChatOpen
                ? "bg-cyan-400 text-slate-950"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
            title="Chat with Gemini AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Chat with Gemini</span>
            <span className="sm:hidden">Gemini</span>
          </button>

          {/* Responsive Mobile / Tablet Drawer Trigger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer shrink-0"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#060b18]/98 backdrop-blur-lg px-4 py-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <span className="truncate">
              Active: <strong className="text-slate-200">{activeMission.mission_id}</strong> · {activeMission.rocket}
            </span>
            <span className="text-cyan-400 shrink-0">{activeMission.target_orbit}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {SINGLE_PAGE_SECTIONS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="flex sm:hidden items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHistory();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>History ({historyCount})</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogbook();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Logbook ({notesCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
