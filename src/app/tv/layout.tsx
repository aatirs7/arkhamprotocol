export default function TVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-[#e2e2e2] cursor-none select-none font-body">
      {children}
    </div>
  );
}
