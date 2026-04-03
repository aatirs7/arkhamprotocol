"use client";

import type { ProjectData } from "@/lib/types";

interface Props {
  projects: ProjectData[];
}

export function TVProjectTracker({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="text-neutral-600 text-sm font-body tracking-wide">
          No active projects.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* No header — the system just shows you what's happening */}
      <div className="space-y-10">
        {projects.map((project) => {
          const progress = project.progress ?? 0;

          return (
            <div key={project.id} className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-body text-white/80 tracking-wide">
                  {project.name}
                </span>
                <span className="text-[10px] text-neutral-600 font-label tracking-wider">
                  {progress}%
                </span>
              </div>

              {/* Progress — single pixel, structural */}
              <div className="h-px w-full bg-neutral-900">
                <div
                  className="h-full bg-[#00e5ff]/40 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {project.description && (
                <div className="text-[10px] text-neutral-700 font-label tracking-wide">
                  {project.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
