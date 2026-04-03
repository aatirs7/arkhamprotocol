"use client";

import { useActiveSession } from "@/lib/hooks/use-active-session";
import { Card, CardHeader, CardTitle } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";
import { Play, SkipForward, Square, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export function SessionControls() {
  const { session, mutate } = useActiveSession();
  const [protocols, setProtocols] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/protocols")
      .then((r) => r.json())
      .then(setProtocols);
  }, []);

  async function startProtocol(protocolId: number) {
    setLoading(true);
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ protocolId }),
    });
    await mutate();
    setLoading(false);
  }

  async function advance() {
    if (!session?.id) return;
    setLoading(true);
    await fetch(`/api/sessions/${session.id}/advance`, { method: "POST" });
    await mutate();
    setLoading(false);
  }

  async function complete() {
    if (!session?.id) return;
    setLoading(true);
    await fetch(`/api/sessions/${session.id}/complete`, { method: "POST" });
    await mutate();
    setLoading(false);
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Protocol Engine</CardTitle>
        </CardHeader>
        <p className="text-text-secondary text-sm mb-4">
          No active protocol. Start one:
        </p>
        <div className="flex flex-wrap gap-2">
          {protocols.map((p) => (
            <Button
              key={p.id}
              variant="secondary"
              size="sm"
              onClick={() => startProtocol(p.id)}
              disabled={loading}
            >
              <Play className="w-3 h-3" />
              {p.name}
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  const currentStep =
    session.steps?.[session.currentStepIndex ?? 0];
  const totalSteps = session.steps?.length ?? 0;
  const progress =
    totalSteps > 0
      ? Math.round(((session.currentStepIndex ?? 0) / totalSteps) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <CardTitle>{session.protocol?.name ?? "Protocol"}</CardTitle>
        </div>
        <span className="text-sm text-text-secondary">
          Step {(session.currentStepIndex ?? 0) + 1} of {totalSteps}
        </span>
      </CardHeader>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current step */}
      {currentStep && (
        <div className="bg-background rounded-lg p-4 border border-border mb-4">
          <h4 className="text-lg font-semibold text-text-primary mb-1">
            {currentStep.title}
          </h4>
          {currentStep.description && (
            <p className="text-sm text-text-secondary">
              {currentStep.description}
            </p>
          )}
        </div>
      )}

      {/* Step indicators */}
      <div className="flex gap-1.5 mb-4">
        {(session.steps ?? []).map(
          (step: { id: number }, i: number) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-1 rounded-full",
                i < (session.currentStepIndex ?? 0)
                  ? "bg-success"
                  : i === (session.currentStepIndex ?? 0)
                    ? "bg-accent"
                    : "bg-border"
              )}
            />
          )
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={advance} disabled={loading} size="sm">
          <SkipForward className="w-3 h-3" />
          Next Step
        </Button>
        <Button onClick={complete} variant="secondary" disabled={loading} size="sm">
          <Square className="w-3 h-3" />
          Complete
        </Button>
      </div>
    </Card>
  );
}
