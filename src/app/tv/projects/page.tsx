"use client";

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

export default function TVProjectsPage() {
  const { data: projects = [], mutate } = useSWR<Project[]>(
    "/api/projects",
    fetcher,
    { refreshInterval: 5000 }
  );
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const active = projects.filter((p) => p.status === "active");
  const other = projects.filter((p) => p.status !== "active");

  async function addProject() {
    if (!name.trim()) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: desc.trim() || undefined,
      }),
    });
    setName("");
    setDesc("");
    setShowAdd(false);
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

        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-headline font-light text-white/90 tracking-wide mb-2">
              Projects
            </h1>
            <div className="text-neutral-500 text-sm">
              {active.length} active{" "}
              {active.length === 1 ? "project" : "projects"}.
            </div>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs text-neutral-600 hover:text-cyan-400 transition-colors tracking-wider uppercase"
          >
            {showAdd ? "Cancel" : "+ New"}
          </button>
        </div>

        {/* Add project form */}
        {showAdd && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addProject();
            }}
            className="mb-12 space-y-4"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full bg-transparent border-b border-neutral-800 focus:border-cyan-400/40 text-white/90 text-sm py-3 outline-none transition-colors placeholder:text-neutral-700 tracking-wide"
              autoFocus
            />
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-transparent border-b border-neutral-800 focus:border-cyan-400/40 text-white/90 text-sm py-3 outline-none transition-colors placeholder:text-neutral-700 tracking-wide"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="text-xs text-neutral-600 hover:text-cyan-400 transition-colors disabled:opacity-30 tracking-wider uppercase"
            >
              Create
            </button>
          </form>
        )}

        {/* Active projects */}
        <div className="space-y-10 mb-16">
          {active.map((project) => (
            <Link
              key={project.id}
              href={`/tv/projects/${project.id}`}
              className="block group"
            >
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-body text-white/80 tracking-wide group-hover:text-cyan-400 transition-colors">
                  {project.name}
                </span>
                <span className="text-[10px] text-neutral-600 tracking-wider">
                  {project.progress ?? 0}%
                </span>
              </div>
              <div className="h-px w-full bg-neutral-900">
                <div
                  className="h-full bg-[#00e5ff]/40 transition-all duration-700"
                  style={{ width: `${project.progress ?? 0}%` }}
                />
              </div>
              {project.description && (
                <div className="text-[10px] text-neutral-700 mt-2 tracking-wide">
                  {project.description}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Other projects */}
        {other.length > 0 && (
          <>
            <div className="text-neutral-700 text-[10px] tracking-widest uppercase mb-4">
              Other ({other.length})
            </div>
            <div className="space-y-6">
              {other.map((project) => (
                <Link
                  key={project.id}
                  href={`/tv/projects/${project.id}`}
                  className="block group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-600 tracking-wide group-hover:text-neutral-400 transition-colors">
                      {project.name}
                    </span>
                    <span className="text-[9px] text-neutral-800 tracking-wider uppercase">
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
