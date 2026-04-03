"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string | null;
  progress: number | null;
}

interface Task {
  id: number;
  title: string;
  status: string | null;
  priority: string | null;
}

export default function TVProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project } = useSWR<Project>(`/api/projects/${id}`, fetcher, {
    refreshInterval: 5000,
  });
  const { data: tasks = [], mutate: mutateTasks } = useSWR<Task[]>(
    `/api/tasks?projectId=${id}`,
    fetcher,
    { refreshInterval: 5000 }
  );
  const [progress, setProgress] = useState<string>("");

  async function updateProgress() {
    const val = parseInt(progress);
    if (isNaN(val) || val < 0 || val > 100) return;
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: val }),
    });
    setProgress("");
  }

  async function updateStatus(status: string) {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-[#e2e2e2] flex items-center justify-center">
        <span className="text-neutral-600 text-sm tracking-wider">
          Loading...
        </span>
      </div>
    );
  }

  const pending = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] font-body select-none">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-4">
          <div className="text-neutral-600 text-[10px] font-label tracking-[0.5em] uppercase">
            Arkham Command Center
          </div>
          <Link
            href="/tv/projects"
            className="text-neutral-700 text-xs tracking-wider hover:text-cyan-400 transition-colors"
          >
            ← Projects
          </Link>
        </div>

        <h1 className="text-2xl font-headline font-light text-white/90 tracking-wide mb-2">
          {project.name}
        </h1>
        {project.description && (
          <div className="text-neutral-500 text-sm mb-6">
            {project.description}
          </div>
        )}

        {/* Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-neutral-500 text-sm">Progress</span>
            <span className="text-[#00e5ff]/60 text-sm font-label">
              {project.progress ?? 0}%
            </span>
          </div>
          <div className="h-px w-full bg-neutral-900 mb-4">
            <div
              className="h-full bg-[#00e5ff]/40 transition-all duration-700"
              style={{ width: `${project.progress ?? 0}%` }}
            />
          </div>

          <div className="flex gap-4 items-center">
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="Set %"
              className="w-20 bg-transparent border-b border-neutral-800 focus:border-cyan-400/40 text-white/90 text-sm py-2 outline-none transition-colors placeholder:text-neutral-700"
            />
            <button
              onClick={updateProgress}
              className="text-xs text-neutral-600 hover:text-cyan-400 transition-colors tracking-wider uppercase"
            >
              Update
            </button>

            <div className="ml-auto flex gap-3">
              {["active", "paused", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`text-[10px] tracking-wider uppercase px-2 py-1 transition-colors ${
                    project.status === s
                      ? "text-[#00e5ff]"
                      : "text-neutral-700 hover:text-neutral-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks linked to this project */}
        <div className="text-neutral-500 text-sm mb-6">
          {pending.length === 0
            ? "No tasks linked to this project."
            : `${pending.length} pending ${pending.length === 1 ? "task" : "tasks"}.`}
        </div>

        <div className="space-y-4">
          {pending.map((task) => (
            <div key={task.id} className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              <span className="text-sm text-neutral-400 tracking-wide">
                {task.title}
              </span>
            </div>
          ))}
          {done.map((task) => (
            <div key={task.id} className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800/50" />
              <span className="text-sm text-neutral-700 line-through tracking-wide">
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
