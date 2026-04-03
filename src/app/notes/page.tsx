"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Note {
  id: number;
  content: string;
  date: string;
  createdAt: string;
}

export default function NotesPage() {
  const today = new Date().toISOString().split("T")[0];
  const { data: notes = [], mutate } = useSWR<Note[]>(
    `/api/notes?date=${today}`,
    fetcher,
    { refreshInterval: 5000 }
  );
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function addNote() {
    if (!input.trim()) return;
    setSaving(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
    });
    setInput("");
    await mutate();
    setSaving(false);
  }

  async function removeNote(id: number) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    await mutate();
  }

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] font-body">
      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-neutral-600 text-[10px] font-label tracking-[0.5em] uppercase mb-2">
              Arkham Command Center
            </div>
            <h1 className="text-2xl font-headline font-light text-white/90 tracking-wide">
              Today&apos;s Thoughts
            </h1>
            <div className="text-neutral-600 text-sm mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <Link
            href="/tv"
            className="text-neutral-700 text-xs tracking-wider hover:text-cyan-400 transition-colors"
          >
            ← Back
          </Link>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNote();
          }}
          className="mb-16"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 bg-transparent border-b border-neutral-800 focus:border-cyan-400/40 text-white/90 text-sm py-3 outline-none transition-colors placeholder:text-neutral-700 font-body tracking-wide"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || saving}
              className="text-xs text-neutral-600 hover:text-cyan-400 transition-colors disabled:opacity-30 tracking-wider uppercase"
            >
              Save
            </button>
          </div>
        </form>

        {/* Notes list */}
        {notes.length === 0 ? (
          <div className="text-neutral-700 text-sm tracking-wide">
            No thoughts captured today. Speak or type to begin.
          </div>
        ) : (
          <div className="space-y-8">
            {notes.map((note) => (
              <div key={note.id} className="group flex gap-6 items-start">
                <div className="text-neutral-700 text-[10px] font-label tracking-wider mt-1.5 shrink-0 w-16">
                  {formatTime(note.createdAt)}
                </div>
                <div className="flex-1 text-sm text-neutral-300 leading-relaxed tracking-wide">
                  {note.content}
                </div>
                <button
                  onClick={() => removeNote(note.id)}
                  className="text-neutral-800 hover:text-red-400/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quiet count */}
        {notes.length > 0 && (
          <div className="mt-16 text-neutral-800 text-[10px] font-label tracking-widest">
            {notes.length} {notes.length === 1 ? "thought" : "thoughts"} today
          </div>
        )}
      </div>
    </div>
  );
}
