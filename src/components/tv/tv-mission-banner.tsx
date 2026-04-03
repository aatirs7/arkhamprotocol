"use client";

import { Target, BookOpen, CheckSquare } from "lucide-react";

interface Props {
  stats: {
    tasksCompleted: number;
    prayersCompleted: number;
    totalPrayers: number;
  };
}

export function TVMissionBanner({ stats }: Props) {
  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3">
        <CheckSquare className="w-5 h-5 text-accent" />
        <span className="text-lg text-text-secondary">
          <span className="text-text-primary font-bold">{stats.tasksCompleted}</span> tasks done
        </span>
      </div>
      <div className="flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-success" />
        <span className="text-lg text-text-secondary">
          <span className="text-text-primary font-bold">{stats.prayersCompleted}</span>/{stats.totalPrayers} prayers
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Target className="w-5 h-5 text-warning" />
        <span className="text-lg text-text-secondary">Stay disciplined</span>
      </div>
    </div>
  );
}
