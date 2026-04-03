export default function TVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground cursor-none">
      {children}
    </div>
  );
}
