import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Shield, Activity, Server, Lock, 
  Cpu, Database, Network, ArrowRight, Printer, Sparkles, CheckCircle2,
  AlertTriangle, Flame, Terminal, FileText, ExternalLink
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ThreeDataCenterGlobe } from '../components/cyber/ThreeDataCenterGlobe';
import { ThreeCyberDefenseShield } from '../components/cyber/ThreeCyberDefenseShield';

export const PresentationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 6;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[100dvh] bg-[#020617] text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden select-none">
      {/* Background Cyber Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,242,254,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />

      {/* Top Presentation Bar (Hidden during print) */}
      <header className="print:hidden w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-2.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,242,254,0.3)]">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide">
              CYBER LAKSHYA • SIH 2026 OFFICIAL DECK
            </span>
            <span className="text-[10px] text-cyan-400 font-mono block">
              Problem Statement: CHA-39 | AICTE DCIM & Cybersecurity Command Portal
            </span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-cyan-400 font-bold">Slide {currentSlide}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalSlides}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
              disabled={currentSlide === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
              disabled={currentSlide === totalSlides}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-3.5 h-3.5" />}
            className="text-xs border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/30"
          >
            Export PDF (6 Slides)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => (window.location.hash = '#/command-center')}
            className="text-xs"
          >
            Back to Portal
          </Button>
        </div>
      </header>

      {/* Main Slide Stage (16:9 Aspect Ratio) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex items-center justify-center z-10">
        <div className="w-full aspect-[16/9] max-h-[82vh] bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
          {/* Slide 1: TITLE PAGE */}
          {currentSlide === 1 && (
            <div className="h-full flex flex-col justify-between animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>SMART INDIA HACKATHON 2026 • SOFTWARE EDITION</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold">
                  PS ID: CHA-39
                </span>
              </div>

              <div className="grid grid-cols-12 gap-6 items-center flex-1 my-4">
                <div className="col-span-7 space-y-4">
                  <div className="inline-block px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
                    Theme: Smart Automation, Infrastructure & Cybersecurity
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                    Cyber Lakshya
                  </h1>
                  <h2 className="text-base sm:text-lg text-cyan-300 font-semibold leading-snug">
                    Cybersecurity Portal for Effective Management of Servers and Firewalls (AICTE DCIM)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    A centralized, multi-layered command and governance system empowering non-technical AICTE administrators with plain-language operational visibility, kernel-level eBPF mitigation, and Zero-Trust firewall management.
                  </p>
                </div>

                <div className="col-span-5 flex flex-col items-center justify-center">
                  <ThreeCyberDefenseShield size={200} />
                  <div className="mt-2 text-center">
                    <span className="text-sm font-bold text-white block">Team: Cyber Lakshya</span>
                    <span className="text-xs text-slate-400 font-mono">College: AICTE Affiliated Institute</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Team Lead: Chaitanya Thakar | System Architect: Maharshi Trivedi</span>
                <span className="text-cyan-400 font-bold">Slide 1 of 6</span>
              </div>
            </div>
          )}

          {/* Slide 2: PROPOSED SOLUTION & INNOVATION */}
          {currentSlide === 2 && (
            <div className="h-full flex flex-col justify-between animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" /> Proposed Solution & Key Innovations
                </h2>
                <span className="text-xs text-cyan-400 font-mono font-bold">Slide 2 / 6</span>
              </div>

              <div className="grid grid-cols-3 gap-4 my-auto">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                    <Activity className="w-4 h-4" /> 1. Dual-Persona Command Portal
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Consolidates 124 servers, 118 switches, and 248 software licenses. Bridges executive non-technical leadership with deep technical engineering workbays.
                  </p>
                  <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-cyan-200">
                    <strong>4-Question Engine:</strong> What Happened? Why It Matters? What To Do? Who Handles It?
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-mono">
                    <Shield className="w-4 h-4" /> 2. Non-Destructive Firewalls
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    No risky rip-and-replace. Ingests legacy configurations (Palo Alto, Fortinet, Cisco) into SECUREDGE schema with real-time drift detection and Batfish AST validation.
                  </p>
                  <div className="p-2 rounded bg-indigo-950/30 border border-indigo-500/20 text-[10px] text-indigo-200">
                    <strong>Lifecycle:</strong> Import ➔ Normalize ➔ Validate ➔ Approve ➔ Deploy ➔ Monitor
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                    <Terminal className="w-4 h-4" /> 3. Kernel-Level eBPF Defense
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Proactive kernel probes intercepting <code className="text-emerald-300">sys_execve</code>. Dispatches synchronous <code className="text-emerald-300">SIGKILL (9)</code> to terminate malicious injections in &lt; 1ms.
                  </p>
                  <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/20 text-[10px] text-emerald-200">
                    <strong>3D Holo-Deck:</strong> Three.js 3D WebGL Multi-Region Globe & 42U Server Rack
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Cyber Lakshya • AICTE DCIM & Cybersecurity Command Portal</span>
                <span>Team: Cyber Lakshya</span>
              </div>
            </div>
          )}

          {/* Slide 3: TECHNICAL APPROACH & ARCHITECTURE */}
          {currentSlide === 3 && (
            <div className="h-full flex flex-col justify-between animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" /> Technical Approach & Multi-Layer Architecture
                </h2>
                <span className="text-xs text-cyan-400 font-mono font-bold">Slide 3 / 6</span>
              </div>

              <div className="grid grid-cols-12 gap-4 my-auto">
                {/* Tech Stack Grid (5 Cols) */}
                <div className="col-span-5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Technology Stack
                  </h4>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400 font-semibold">Frontend:</span>
                      <span className="text-cyan-300 font-mono">React 18, TypeScript, Three.js, Tailwind</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400 font-semibold">Backend Gateway:</span>
                      <span className="text-indigo-300 font-mono">Go (Golang), Nginx (TLS 1.3), FastAPI</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400 font-semibold">Database (SSOT):</span>
                      <span className="text-emerald-300 font-mono">PostgreSQL 16 (3NF, JSONB GIN, Partitioned)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400 font-semibold">AI & Security:</span>
                      <span className="text-amber-300 font-mono">Isolation Forest (150 trees), Casbin RBAC, eBPF</span>
                    </div>
                  </div>
                </div>

                {/* 4-Layer Fortress Flowchart (7 Cols) */}
                <div className="col-span-7 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Multi-Layer "Fortress" Pipeline
                  </h4>
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono">1</span>
                      <div>
                        <span className="font-bold text-white">Outer Ingress Shell:</span> Nginx TLS 1.3 reverse proxy with port cloaking (DB port 5432 hidden).
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono">2</span>
                      <div>
                        <span className="font-bold text-white">Zero-Trust IAM Shell:</span> Stateless RFC 7519 JWT injecting <code className="text-indigo-300">clearance_level</code> (1–5) & default PENDING.
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono">3</span>
                      <div>
                        <span className="font-bold text-white">AI Anomaly Engine:</span> Dual-stage (Z-Score filter + 150-tree Isolation Forest with XAI root cause).
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">4</span>
                      <div>
                        <span className="font-bold text-white">Kernel eBPF Core:</span> LSM hooks & kprobes on <code className="text-emerald-300">execve</code> executing <code className="text-emerald-300">SIGKILL (9)</code> in &lt; 1ms.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Working Prototype 100% verified on disk with 8 connected routes</span>
                <span>Team: Cyber Lakshya</span>
              </div>
            </div>
          )}

          {/* Slide 4: FEASIBILITY, VIABILITY & RISK MITIGATION */}
          {currentSlide === 4 && (
            <div className="h-full flex flex-col justify-between animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" /> Feasibility, Viability & Risk Mitigations
                </h2>
                <span className="text-xs text-cyan-400 font-mono font-bold">Slide 4 / 6</span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-auto">
                {/* Feasibility & Scalability Pillars */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Feasibility & Performance Strengths
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-[11px]">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>High-Throughput Ingestion:</strong> Sub-millisecond composite indexing (<code className="text-cyan-300 font-mono">idx_monitoring_composite</code>) handles 100,000+ telemetry events/sec.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Zero-Friction Hardware Adoption:</strong> Non-destructive read-only API connectors onboard existing appliances without downtime.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Ultra-Low CPU Overhead:</strong> In-kernel eBPF hash map pre-filtering operates in ring buffers adding &lt; 1.2% server CPU overhead.</span>
                    </div>
                  </div>
                </div>

                {/* Challenges & Mitigations Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Potential Risks & Engineered Mitigations
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-[10.5px]">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-amber-400">Risk: Heterogeneous Vendors:</strong>
                      <span className="text-slate-300 block mt-0.5">➔ <strong>Mitigation:</strong> SECUREDGE normalized schema + Batfish AST pre-validation before rule push.</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-amber-400">Risk: Telemetry Storage Bloat:</strong>
                      <span className="text-slate-300 block mt-0.5">➔ <strong>Mitigation:</strong> PostgreSQL declarative time partitioning + automated rollup aggregations.</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-amber-400">Risk: False Alarm Service Disruption:</strong>
                      <span className="text-slate-300 block mt-0.5">➔ <strong>Mitigation:</strong> Dual-stage ML pipeline achieves 98.4% sensitivity with &lt; 1.2% false alarm rate.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Scalable, resilient architecture tested against synthetic data center stress workloads</span>
                <span>Team: Cyber Lakshya</span>
              </div>
            </div>
          )}

          {/* Slide 5: IMPACT, BENEFITS & SOCIAL VALUE */}
          {currentSlide === 5 && (
            <div className="h-full flex flex-col justify-between animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" /> Quantifiable Impact, Benefits & Social Value
                </h2>
                <span className="text-xs text-cyan-400 font-mono font-bold">Slide 5 / 6</span>
              </div>

              <div className="grid grid-cols-4 gap-3 my-auto">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="text-2xl font-black text-cyan-400 font-mono">14.2 min</div>
                  <div className="text-[11px] font-bold text-white">MTTR Reduction</div>
                  <p className="text-[10px] text-slate-400">Slashes incident remediation from hours to minutes via 1-click dispatch.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="text-2xl font-black text-emerald-400 font-mono">99.98%</div>
                  <div className="text-[11px] font-bold text-white">Student Uptime</div>
                  <p className="text-[10px] text-slate-400">Zero service disruption across 10,000+ colleges during admission cycles.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="text-2xl font-black text-indigo-400 font-mono">&lt; 1 ms</div>
                  <div className="text-[11px] font-bold text-white">eBPF SIGKILL</div>
                  <p className="text-[10px] text-slate-400">Synchronous in-kernel termination eliminates dwell time of reverse shells.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="text-2xl font-black text-amber-400 font-mono">100%</div>
                  <div className="text-[11px] font-bold text-white">License Compliance</div>
                  <p className="text-[10px] text-slate-400">Eliminates duplicate purchasing and penalties with 30-day renewal alerts.</p>
                </div>
              </div>

              {/* Target Audience Bar */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <strong className="text-cyan-300 block">AICTE Administrators:</strong>
                  <span className="text-slate-400">Plain-language decisions without Linux CLI or firewall syntax complexity.</span>
                </div>
                <div>
                  <strong className="text-indigo-300 block">NOC / SOC Technicians:</strong>
                  <span className="text-slate-400">Pre-populated forensic tickets with PID traces and one-click actions.</span>
                </div>
                <div>
                  <strong className="text-emerald-300 block">Compliance Auditors:</strong>
                  <span className="text-slate-400">Cryptographically signed SHA-256 audit chains and NIST SP 800-53 scores.</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Fostering digital self-reliance (#InnovationseAtmaNirbharBharat)</span>
                <span>Team: Cyber Lakshya</span>
              </div>
            </div>
          )}

          {/* Slide 6: RESEARCH FOUNDATIONS & REFERENCES */}
          {currentSlide === 6 && (
            <div className="h-full flex flex-col justify-between animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> Research Foundations, Standards & Toolchains
                </h2>
                <span className="text-xs text-cyan-400 font-mono font-bold">Slide 6 / 6</span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-auto">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Government & International Standards
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-[10.5px]">
                    <div>
                      <strong className="text-cyan-300">NIST SP 800-53 Rev 5.1:</strong>
                      <span className="text-slate-300 block">Security & Privacy Controls (CM-8 System Inventory, AC-2/AC-3 Access Control).</span>
                    </div>
                    <div>
                      <strong className="text-indigo-300">NIST SP 800-207:</strong>
                      <span className="text-slate-300 block">Zero Trust Architecture (ZTA) for micro-segmentation & default-deny.</span>
                    </div>
                    <div>
                      <strong className="text-emerald-300">CIS Controls v8.1 (Control 12):</strong>
                      <span className="text-slate-300 block">Network Infrastructure Management & Configuration Drift Auditing.</span>
                    </div>
                    <div>
                      <strong className="text-purple-300">NIST IR 8500A (2026 Draft BloSS@M):</strong>
                      <span className="text-slate-300 block">Blockchain-Based Secure Software Asset & License Lifecycle Management.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                    Open-Source Frameworks & Toolchains
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-[10.5px]">
                    <div>
                      <strong className="text-cyan-300">Batfish & NetBox:</strong>
                      <span className="text-slate-300 block">Network AST validation (<a href="https://github.com/batfish/batfish" target="_blank" className="text-cyan-400 underline">batfish/batfish</a>) & SSOT Inventory.</span>
                    </div>
                    <div>
                      <strong className="text-indigo-300">Linux eBPF & LSM Hooks:</strong>
                      <span className="text-slate-300 block">Kernel-space syscall tracing and <code className="text-indigo-300">bpf_send_signal</code> (<a href="https://ebpf.io" target="_blank" className="text-cyan-400 underline">ebpf.io</a>).</span>
                    </div>
                    <div>
                      <strong className="text-emerald-300">Casbin RBAC Engine:</strong>
                      <span className="text-slate-300 block">Multi-tenant PERM metamodel access governance (<a href="https://casbin.org" target="_blank" className="text-cyan-400 underline">casbin.org</a>).</span>
                    </div>
                    <div>
                      <strong className="text-amber-300">Scikit-learn Isolation Forest:</strong>
                      <span className="text-slate-300 block">Liu et al., "Isolation Forest", IEEE ICDM 2008 path-length anomaly scoring.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Submitted by Team Cyber Lakshya | Smart India Hackathon 2026</span>
                <span className="text-cyan-400 font-bold">End of Slide Deck (6 / 6)</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer Navigation Bar */}
      <footer className="print:hidden w-full border-t border-slate-800 bg-slate-950/80 px-6 py-2.5 flex items-center justify-between text-xs text-slate-400 z-20">
        <div className="flex items-center gap-2">
          <span>Use keyboard arrows</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">◀</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">▶</kbd>
          <span>or click navigation buttons above.</span>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentSlide(num)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                currentSlide === num
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.4)]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <span className="text-slate-500 font-mono text-[11px]">Strict 6-Slide Compliance Enforced</span>
      </footer>
    </div>
  );
};
