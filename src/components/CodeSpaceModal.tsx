/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Code,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Save,
  Terminal,
  X,
  Play,
  CheckCircle2,
  Folder,
  FileCode,
  FileJson,
  RefreshCw,
} from "lucide-react";

interface CodeFile {
  name: string;
  language: string;
  content: string;
}

interface CodeSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FILES: CodeFile[] = [
  {
    name: "trajectory_model.py",
    language: "python",
    content: `# 4th-Order Runge-Kutta Ascent Dynamics & Drag Model
import numpy as np

def rk4_step(state, dt, thrust, drag_coeff, mass):
    """
    Performs one 4th-order Runge-Kutta integration step for rocket ascent.
    State vector: [position_z, velocity_v, mass_m]
    """
    g0 = 9.80665
    def equations(s):
        z, v, m = s
        density = 1.225 * np.exp(-z / 8500.0) # Atmospheric density model
        drag = 0.5 * density * v**2 * drag_coeff * 10.0
        dz = v
        dv = (thrust - drag) / max(1.0, m) - g0
        dm = - (thrust / (311.0 * g0))
        return np.array([dz, dv, dm])

    k1 = equations(state)
    k2 = equations(state + 0.5 * dt * k1)
    k3 = equations(state + 0.5 * dt * k2)
    k4 = equations(state + dt * k3)
    
    return state + (dt / 6.0) * (k1 + 2*k2 + 2*k3 + k4)
`,
  },
  {
    name: "qaoa_optimizer.ts",
    language: "typescript",
    content: `/**
 * QAOA Quantum Optimization Circuit & Hamiltonian Statevector Simulator
 */
export interface QubitState {
  amplitudeReal: number;
  amplitudeImag: number;
}

export function simulateQAOALayer(gamma: number, beta: number, qubits: number): number {
  const hilbertDim = Math.pow(2, qubits);
  let optimalEnergy = Infinity;
  
  for (let i = 0; i < hilbertDim; i++) {
    // Evaluate cost function for binary bitstring state i
    const cost = evaluateQUBOEnergy(i);
    if (cost < optimalEnergy) {
      optimalEnergy = cost;
    }
  }
  return optimalEnergy;
}

function evaluateQUBOEnergy(bitmask: number): number {
  // Quadratic Unconstrained Binary Optimization energy calculation
  return (bitmask % 7) * 1.45 + (bitmask % 3) * 0.82;
}
`,
  },
  {
    name: "mission_config.json",
    language: "json",
    content: `{
  "mission_id": "MSN-2026-ALPHA",
  "satellite_name": "Orbital Quantum Sensor X1",
  "target_orbit": "LEO 420km Sun-Synchronous",
  "vehicle": "Falcon 9 Block 5",
  "dry_mass_kg": 22200,
  "fuel_mass_kg": 411000,
  "payload_mass_kg": 12500,
  "nominal_thrust_kn": 7607,
  "specific_impulse_s": 311,
  "optimization_target": "Minimise Fuel & Max-Q Aerodynamic Load"
}`,
  },
  {
    name: "README.md",
    language: "markdown",
    content: `# AeroQuantum Flight & Optimization Code Space

Welcome to the live research Code Space. You can inspect, edit, and run simulation scripts in JavaScript, TypeScript, Python, JSON, and Markdown.

### Quick Commands (Terminal)
- \`npm run build\` - Compile and verify project assets
- \`python trajectory_model.py\` - Run trajectory integration test
- \`pytest\` - Run optimization test suite
- \`clear\` - Clear console logs
`,
  },
];

export const CodeSpaceModal: React.FC<CodeSpaceModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<CodeFile[]>(() => {
    try {
      const saved = localStorage.getItem("aeroquantum_codespace_files");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_FILES;
  });

  const [activeFileName, setActiveFileName] = useState<string>(DEFAULT_FILES[0].name);
  const [fileContent, setFileContent] = useState<string>(DEFAULT_FILES[0].content);
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "AeroQuantum Code Space v2.4 initialized.",
    "Type 'help' for available commands, or 'run' to execute active script.",
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find((f) => f.name === activeFileName) || files[0];

  useEffect(() => {
    if (activeFile) {
      setFileContent(activeFile.content);
    }
  }, [activeFileName]);

  useEffect(() => {
    try {
      localStorage.setItem("aeroquantum_codespace_files", JSON.stringify(files));
    } catch {
      // ignore
    }
  }, [files]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  if (!isOpen) return null;

  const handleSelectFile = (name: string) => {
    // save current content first
    setFiles((prev) =>
      prev.map((f) => (f.name === activeFileName ? { ...f, content: fileContent } : f))
    );
    setActiveFileName(name);
  };

  const handleSaveContent = () => {
    setFiles((prev) =>
      prev.map((f) => (f.name === activeFileName ? { ...f, content: fileContent } : f))
    );
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    if (files.some((f) => f.name === name)) {
      alert("A file with this name already exists.");
      return;
    }
    const ext = name.split(".").pop() || "txt";
    let lang = "plaintext";
    if (ext === "py") lang = "python";
    else if (ext === "ts" || ext === "tsx") lang = "typescript";
    else if (ext === "js" || ext === "jsx") lang = "javascript";
    else if (ext === "json") lang = "json";
    else if (ext === "md") lang = "markdown";

    const newFile: CodeFile = {
      name,
      language: lang,
      content: `# New file: ${name}\n`,
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileName(name);
    setFileContent(newFile.content);
    setNewFileName("");
    setIsCreating(false);
  };

  const handleDeleteFile = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) {
      alert("Cannot delete the last remaining file.");
      return;
    }
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const remaining = files.filter((f) => f.name !== name);
      setFiles(remaining);
      if (activeFileName === name) {
        setActiveFileName(remaining[0].name);
        setFileContent(remaining[0].content);
      }
    }
  };

  const handleRunTerminalCommand = (cmdStr: string) => {
    const cmd = cmdStr.trim();
    if (!cmd) return;

    setTerminalLogs((prev) => [...prev, `$ ${cmd}`]);

    if (cmd === "clear") {
      setTerminalLogs(["Console cleared."]);
      setTerminalInput("");
      return;
    }

    if (cmd === "help") {
      setTerminalLogs((prev) => [
        ...prev,
        "Available commands:",
        "  run           - Execute active code file simulation",
        "  npm run build - Verify TypeScript compilation",
        "  pytest        - Run optimization verification suite",
        "  ls            - List workspace files",
        "  clear         - Clear terminal screen",
      ]);
      setTerminalInput("");
      return;
    }

    if (cmd === "ls") {
      setTerminalLogs((prev) => [...prev, files.map((f) => f.name).join("  ")]);
      setTerminalInput("");
      return;
    }

    if (cmd === "run") {
      setTerminalLogs((prev) => [
        ...prev,
        `Executing '${activeFileName}'...`,
        `[SUCCESS] Simulation completed successfully. Exit code 0.`,
      ]);
      setTerminalInput("");
      return;
    }

    if (cmd === "npm run build") {
      setTerminalLogs((prev) => [
        ...prev,
        "Running tsc --noEmit and vite build...",
        "transforming...",
        "✓ built in 1.4s",
        "[SUCCESS] Build verified cleanly.",
      ]);
      setTerminalInput("");
      return;
    }

    if (cmd === "pytest") {
      setTerminalLogs((prev) => [
        ...prev,
        "============================= test session starts ==============================",
        "platform linux -- Python 3.11.4, pytest-7.3.1, pluggy-1.0.0",
        "rootdir: /app/applet",
        "collected 6 items",
        "tests/test_optimization.py ..... [ 83%]",
        "tests/test_physics.py . [100%]",
        "============================== 6 passed in 0.42s ===============================",
      ]);
      setTerminalInput("");
      return;
    }

    // Default response
    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `Command executed: '${cmd}'. Output nominal.`,
      ]);
    }, 200);

    setTerminalInput("");
  };

  const getFileIcon = (lang: string) => {
    if (lang === "python") return <FileCode className="w-4 h-4 text-emerald-400" />;
    if (lang === "typescript" || lang === "javascript") return <FileCode className="w-4 h-4 text-cyan-400" />;
    if (lang === "json") return <FileJson className="w-4 h-4 text-amber-400" />;
    return <FileText className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className={`w-full max-w-7xl h-[92vh] bg-slate-900 border border-slate-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-300 ease-out ${isOpen ? "translate-y-0 sm:scale-100" : "translate-y-full sm:scale-95"}`}>
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Code Space Development Environment</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 bg-cyan-950 border border-cyan-800">
                  Step 3 Extension
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive IDE with file explorer, syntax editing, and simulated terminal console.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveContent}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save File</span>
            </button>
            {isSavedToast && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close Code Space"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split Area: File Explorer & Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: File Explorer */}
          <div className="w-64 bg-slate-950/90 border-r border-slate-800 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 uppercase tracking-wider font-bold">
                <Folder className="w-3.5 h-3.5 text-cyan-400" />
                <span>Files</span>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-800 text-xs flex items-center gap-1 cursor-pointer"
                title="New File"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">New</span>
              </button>
            </div>

            {isCreating && (
              <form onSubmit={handleCreateFile} className="p-2 border-b border-slate-800 bg-slate-900">
                <input
                  type="text"
                  placeholder="filename.py / ts / json"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                  className="w-full px-2.5 py-1 text-xs rounded bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <div className="flex items-center justify-end gap-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-0.5 text-[10px] font-mono bg-cyan-600 text-white rounded font-bold hover:bg-cyan-500"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {files.map((file) => {
                const isActive = file.name === activeFileName;
                return (
                  <div
                    key={file.name}
                    onClick={() => handleSelectFile(file.name)}
                    className={`group px-3 py-2 rounded-lg flex items-center justify-between text-xs font-mono cursor-pointer transition-colors ${
                      isActive
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getFileIcon(file.language)}
                      <span className="truncate">{file.name}</span>
                    </div>
                    {files.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteFile(file.name, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center/Right: Code Editor & Terminal */}
          flex-1 flex flex-col overflow-hidden bg-slate-900
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Top Bar */}
            <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">Editing:</span>
                <span className="text-white">{activeFile.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                  {activeFile.language}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>UTF-8</span>
                <span>Spaces: 2</span>
              </div>
            </div>

            {/* Code Textarea Editor */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Line numbers gutter */}
              <div className="w-12 py-4 bg-slate-950/40 border-r border-slate-800/80 text-right pr-3 font-mono text-xs text-slate-600 select-none overflow-hidden">
                {fileContent.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                spellCheck={false}
                className="flex-1 p-4 bg-slate-900 text-slate-200 font-mono text-xs tracking-wide leading-relaxed resize-none focus:outline-none overflow-auto"
                style={{ tabSize: 2 }}
              />
            </div>

            {/* Bottom Terminal Panel */}
            <div className="h-48 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0">
              <div className="px-4 py-1.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Interactive Terminal &amp; Console</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Type 'help' or 'run'</span>
                  <button
                    onClick={() => setTerminalLogs(["Console cleared."])}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Terminal Log Output */}
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
                {terminalLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith("$")
                        ? "text-cyan-400 font-bold"
                        : log.includes("SUCCESS") || log.includes("passed")
                        ? "text-emerald-400"
                        : log.includes("error") || log.includes("FAILED")
                        ? "text-rose-400"
                        : "text-slate-300"
                    }
                  >
                    {log}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunTerminalCommand(terminalInput);
                }}
                className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
              >
                <span className="text-cyan-400 font-mono text-xs font-bold">›</span>
                <input
                  type="text"
                  placeholder="Type a command (e.g., 'run', 'npm run build', 'pytest', 'help')..."
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Run</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
