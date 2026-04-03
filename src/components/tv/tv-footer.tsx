import Link from "next/link";

export function TVFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-16 py-6 flex justify-between items-center">
      <Link
        href="/tv/fajr-protocol"
        className="text-[9px] font-label text-neutral-800 tracking-[0.4em] uppercase hover:text-[#00e5ff]/50 transition-colors duration-500"
      >
        Fajr Protocol
      </Link>

      <div className="flex items-center gap-3 opacity-15">
        <span className="w-1 h-1 rounded-full bg-[#00e5ff] animate-pulse" />
        <span className="text-[8px] font-label text-neutral-600 tracking-[0.6em] uppercase">
          Arkham Online
        </span>
      </div>

      <Link
        href="/desktop"
        className="text-[9px] font-label text-neutral-800 tracking-[0.4em] uppercase hover:text-neutral-600 transition-colors duration-500"
      >
        Desktop
      </Link>
    </footer>
  );
}
