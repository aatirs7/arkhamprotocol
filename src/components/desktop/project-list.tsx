"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardTitle } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Modal } from "@/components/shared/modal";
import { Plus, Trash2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ProjectList() {
  const { data: projects = [], mutate } = useSWR("/api/projects", fetcher, {
    refreshInterval: 5000,
  });
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function addProject() {
    if (!name.trim()) return;
    setLoading(true);
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || undefined,
      }),
    });
    setName("");
    setDescription("");
    setShowAdd(false);
    await mutate();
    setLoading(false);
  }

  async function deleteProject(id: number) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await mutate();
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await mutate();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-3 h-3" />
            Add Project
          </Button>
        </CardHeader>

        {projects.length === 0 ? (
          <p className="text-text-secondary text-sm py-4 text-center">
            No projects yet.
          </p>
        ) : (
          <div className="space-y-2">
            {projects.map(
              (project: {
                id: number;
                name: string;
                description: string | null;
                status: string;
                progress: number;
              }) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 px-3 py-3 bg-background rounded-lg border border-border group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-text-primary truncate">
                        {project.name}
                      </span>
                      <StatusBadge status={project.status ?? "active"} />
                    </div>
                    {project.description && (
                      <p className="text-xs text-muted truncate">
                        {project.description}
                      </p>
                    )}
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-border rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${project.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                  <select
                    value={project.status ?? "active"}
                    onChange={(e) =>
                      updateStatus(project.id, e.target.value)
                    }
                    className="text-xs bg-background border border-border rounded px-2 py-1 text-text-secondary"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </Card>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Project"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProject();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Name"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Input
            label="Description"
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || loading}>
              Add Project
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
