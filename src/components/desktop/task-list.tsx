"use client";

import { useTasks } from "@/lib/hooks/use-tasks";
import { Card, CardHeader, CardTitle } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Modal } from "@/components/shared/modal";
import { Plus, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function TaskList() {
  const { tasks, mutate } = useTasks();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  async function addTask() {
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), priority }),
    });
    setTitle("");
    setPriority("medium");
    setShowAdd(false);
    await mutate();
    setLoading(false);
  }

  async function completeTask(id: number) {
    await fetch(`/api/tasks/${id}/complete`, { method: "POST" });
    await mutate();
  }

  async function deleteTask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await mutate();
  }

  const pending = tasks.filter(
    (t: { status: string }) => t.status !== "done"
  );
  const done = tasks.filter(
    (t: { status: string }) => t.status === "done"
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-3 h-3" />
            Add Task
          </Button>
        </CardHeader>

        {pending.length === 0 && done.length === 0 ? (
          <p className="text-text-secondary text-sm py-4 text-center">
            No tasks yet. Add one to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {pending.map(
              (task: {
                id: number;
                title: string;
                priority: string;
                status: string;
              }) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-background rounded-lg border border-border group"
                >
                  <button
                    onClick={() => completeTask(task.id)}
                    className="w-5 h-5 rounded border border-border hover:border-success hover:bg-success/10 transition-colors shrink-0"
                  />
                  <span className="flex-1 text-sm text-text-primary truncate">
                    {task.title}
                  </span>
                  <StatusBadge status={task.priority ?? "medium"} />
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            )}

            {done.length > 0 && (
              <details className="mt-3">
                <summary className="text-xs text-muted cursor-pointer hover:text-text-secondary">
                  {done.length} completed
                </summary>
                <div className="space-y-1 mt-2">
                  {done.slice(0, 10).map(
                    (task: { id: number; title: string }) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      >
                        <Check className="w-4 h-4 text-success shrink-0" />
                        <span className="text-sm text-muted line-through truncate">
                          {task.title}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </details>
            )}
          </div>
        )}
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Task">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Title"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary">Priority</label>
            <div className="flex gap-2">
              {["low", "medium", "high", "critical"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm capitalize border transition-colors",
                    priority === p
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-secondary hover:border-accent/50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || loading}>
              Add Task
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
