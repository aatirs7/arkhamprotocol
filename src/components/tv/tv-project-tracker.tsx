"use client";

import type { ProjectData } from "@/lib/types";
import { MaterialIcon } from "./material-icon";

interface Props {
  projects: ProjectData[];
}

export function TVProjectTracker({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-12 opacity-40">
          <h2 className="font-headline text-xs font-bold tracking-[0.4em] text-white uppercase">
            PROJECTS
          </h2>
          <MaterialIcon name="account_tree" className="text-cyan-400 text-sm" />
        </div>
        <div className="text-neutral-700 text-[10px] tracking-widest uppercase">
          No active projects
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-12 opacity-40">
        <h2 className="font-headline text-xs font-bold tracking-[0.4em] text-white uppercase">
          PROJECTS
        </h2>
        <MaterialIcon name="account_tree" className="text-cyan-400 text-sm" />
      </div>

      <div className="space-y-16">
        {projects.map((project) => (
          <div key={project.id} className="space-y-3">
            <div className="flex justify-between items-end">
              <h3 className="text-xs font-headline font-bold text-white tracking-widest uppercase">
                {project.name}
              </h3>
              <span className="text-[9px] text-cyan-400/60 font-label tracking-[0.2em]">
                {project.progress ?? 0}%
              </span>
            </div>
            <div className="h-[1px] w-full bg-neutral-900">
              <div
                className="h-full bg-cyan-400/50"
                style={{ width: `${project.progress ?? 0}%` }}
              />
            </div>
            <div className="text-neutral-600 text-[9px] font-label uppercase tracking-widest italic opacity-60">
              {project.description ?? project.status ?? "In Progress"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
