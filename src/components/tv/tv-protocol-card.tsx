"use client";

import type { ActiveSessionData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Play, CheckCircle2 } from "lucide-react";

interface Props {
  session: ActiveSessionData | null;
}

export function TVProtocolCard({ session }: Props) {
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted">
        <Play className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-2xl">No active protocol</p>
        <p className="text-lg mt-2 opacity-60">Start one from desktop or Alexa</p>
      </div>
    );
  }

  const progress =
    session.totalSteps > 0
      ? Math.round((session.currentStepIndex / session.totalSteps) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full p-2">
      {/* Protocol name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        <h2 className="text-2xl font-semibold text-accent tracking-wide uppercase">
          {session.protocolName}
        </h2>
      </div>

      {/* Current step */}
      <div className="flex-1 flex flex-col justify-center">
        {session.currentStep ? (
          <>
            <p className="text-text-secondary text-lg mb-2">
              Step {session.currentStepIndex + 1} of {session.totalSteps}
            </p>
            <h3 className="text-5xl font-bold text-text-primary leading-tight mb-4">
              {session.currentStep.title}
            </h3>
            {session.currentStep.description && (
              <p className="text-xl text-text-secondary max-w-lg">
                {session.currentStep.description}
              </p>
            )}
          </>
        ) : (
          <div className="flex items-center gap-4 text-success">
            <CheckCircle2 className="w-12 h-12" />
            <h3 className="text-4xl font-bold">Protocol Complete</h3>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-auto">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              session.status === "completed" ? "bg-success" : "bg-accent"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 mt-4">
          {session.steps.map((step, i) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-colors duration-300",
                i < session.currentStepIndex
                  ? "bg-success"
                  : i === session.currentStepIndex
                    ? "bg-accent"
                    : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
