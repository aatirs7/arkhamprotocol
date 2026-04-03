import { DesktopNav } from "@/components/layout/desktop-nav";
import { SessionControls } from "@/components/desktop/session-controls";

export default function ProtocolsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DesktopNav />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-6">
            Protocols
          </h1>
          <SessionControls />
        </div>
      </div>
    </div>
  );
}
