"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Shield,
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  Zap,
  Tv,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/protocols", label: "Protocols", icon: Zap },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 bg-surface border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-accent" />
          <span className="text-lg font-bold tracking-widest uppercase text-text-primary">
            Arkham
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* TV mode link */}
      <div className="p-3 border-t border-border">
        <Link
          href="/tv"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 transition-colors"
        >
          <Tv className="w-4 h-4" />
          TV Mode
        </Link>
      </div>
    </nav>
  );
}
