"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Protocol {
  id: number;
  name: string;
  description: string | null;
}

interface Session {
  id: number;
  protocolId: number;
  status: string;
  currentStepIndex: number;
  protocol?: { name: string };
  steps?: { id: number; title: string }[];
}

export default function TVProtocolsPage() {
  const { data: protocols = [] } = useSWR<Protocol[]>(
    "/api/protocols",
    fetcher,
    { refreshInterval: 5000 }
  );
  const { data: activeSession, mutate } = useSWR<Session | null>(
    "/api/sessions/active",
    fetcher,
    { refreshInterval: 5000 }
  );

  async function startProtocol(protocolId: number) {
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ protocolId }),
    });
    await mutate();
  }

  async function advanceStep() {
    if (!activeSession) return;
    await fetch(`/api/sessions/${activeSession.id}/advance`, {
      method: "POST",
    });
    await mutate();
  }

  async function completeSession() {
    if (!activeSession) return;
    await fetch(`/api/sessions/${activeSession.id}/complete`, {
      method: "POST",
    });
    await mutate();
  }

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] font-body select-none">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-4">
          <div className="text-neutral-600 text-[10px] font-label tracking-[0.5em] uppercase">
            Arkham Command Center
          </div>
          <Link
            href="/tv"
            className="text-neutral-700 text-xs tracking-wider hover:text-cyan-400 transition-colors"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-2xl font-headline font-light text-white/90 tracking-wide mb-12">
          Protocols
        </h1>

        {/* Active session */}
        {activeSession && (
          <div className="mb-16">
            <div className="text-[#00e5ff] text-sm tracking-wide mb-4">
              Active: {activeSession.protocol?.name ?? "Protocol"}
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {(activeSession.steps ?? []).map(
                (step: { id: number; title: string }, i: number) => {
                  const isCurrent =
                    i === (activeSession.currentStepIndex ?? 0);
                  const isDone = i < (activeSession.currentStepIndex ?? 0);
                  return (
                    <div key={step.id} className="flex items-center gap-4">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDone
                            ? "bg-cyan-400/30"
                            : isCurrent
                              ? "bg-[#00e5ff]"
                              : "bg-neutral-800"
                        }`}
                      />
                      <span
                        className={`text-sm tracking-wide ${
                          isDone
                            ? "text-neutral-600"
                            : isCurrent
                              ? "text-[#00e5ff]"
                              : "text-neutral-700"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex gap-6">
              <button
                onClick={advanceStep}
                className="text-xs text-neutral-500 hover:text-cyan-400 transition-colors tracking-wider uppercase"
              >
                Next Step →
              </button>
              <button
                onClick={completeSession}
                className="text-xs text-neutral-700 hover:text-neutral-400 transition-colors tracking-wider uppercase"
              >
                Complete
              </button>
            </div>
          </div>
        )}

        {/* Protocol list */}
        <div className="space-y-8">
          {protocols.map((protocol) => {
            const isRunning = activeSession?.protocolId === protocol.id;
            return (
              <div key={protocol.id} className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="text-sm text-white/80 tracking-wide mb-1">
                    {protocol.name}
                  </div>
                  {protocol.description && (
                    <div className="text-[10px] text-neutral-600 tracking-wide">
                      {protocol.description}
                    </div>
                  )}
                </div>
                {isRunning ? (
                  <span className="text-[10px] text-[#00e5ff]/60 tracking-wider uppercase">
                    Running
                  </span>
                ) : (
                  <button
                    onClick={() => startProtocol(protocol.id)}
                    disabled={!!activeSession}
                    className="text-[10px] text-neutral-700 hover:text-cyan-400 transition-colors tracking-wider uppercase disabled:opacity-30"
                  >
                    Start
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
