export function TVFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-16 py-8 flex justify-center items-center">
      <div className="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity duration-700">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[8px] font-label text-neutral-500 tracking-[0.8em] uppercase">
          Tactical Node Active
        </span>
      </div>
    </footer>
  );
}
