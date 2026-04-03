"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  dueDate: string | null;
  createdAt: string | null;
}

export default function TVTasksPage() {
  const { data: tasks = [], mutate } = useSWR<Task[]>("/api/tasks", fetcher, {
    refreshInterval: 5000,
  });
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const pending = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");

  async function addTask() {
    if (!input.trim()) return;
    setSaving(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input.trim() }),
    });
    setInput("");
    await mutate();
    setSaving(false);
  }

  async function completeTask(id: number) {
    await fetch(`/api/tasks/${id}/complete`, { method: "POST" });
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

        <h1 className="text-2xl font-headline font-light text-white/90 tracking-wide mb-2">
          Tasks
        </h1>
        <div className="text-neutral-500 text-sm mb-12">
          {pending.length === 0
            ? "Nothing pending."
            : `${pending.length} ${pending.length === 1 ? "task" : "tasks"} need attention.`}
        </div>

        {/* Add task */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
          className="mb-12"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a task..."
              className="flex-1 bg-transparent border-b border-neutral-800 focus:border-cyan-400/40 text-white/90 text-sm py-3 outline-none transition-colors placeholder:text-neutral-700 tracking-wide"
            />
            <button
              type="submit"
              disabled={!input.trim() || saving}
              className="text-xs text-neutral-600 hover:text-cyan-400 transition-colors disabled:opacity-30 tracking-wider uppercase"
            >
              Add
            </button>
          </div>
        </form>

        {/* Pending tasks */}
        <div className="space-y-6 mb-16">
          {pending.map((task) => {
            const isUrgent =
              task.priority === "critical" || task.priority === "high";
            return (
              <div key={task.id} className="flex items-center gap-5 group">
                <button
                  onClick={() => completeTask(task.id)}
                  className={`w-2.5 h-2.5 rounded-full shrink-0 border transition-colors hover:bg-cyan-400/30 ${
                    isUrgent
                      ? "border-[#00e5ff]/50 bg-[#00e5ff]/10"
                      : "border-neutral-700"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm tracking-wide ${
                      isUrgent ? "text-white/90" : "text-neutral-400"
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-[10px] text-neutral-700 mt-1 truncate">
                      {task.description}
                    </div>
                  )}
                </div>
                {task.priority && (
                  <span className="text-[9px] text-neutral-700 tracking-wider uppercase">
                    {task.priority}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Completed */}
        {done.length > 0 && (
          <>
            <div className="text-neutral-700 text-[10px] tracking-widest uppercase mb-4">
              Completed ({done.length})
            </div>
            <div className="space-y-4">
              {done.slice(0, 10).map((task) => (
                <div key={task.id} className="flex items-center gap-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 shrink-0" />
                  <span className="text-sm text-neutral-700 line-through tracking-wide">
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
