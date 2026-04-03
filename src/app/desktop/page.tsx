import { DesktopNav } from "@/components/layout/desktop-nav";
import { DesktopDashboard } from "@/components/desktop/desktop-dashboard";

export default function DesktopPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopNav />
      <DesktopDashboard />
    </div>
  );
}
