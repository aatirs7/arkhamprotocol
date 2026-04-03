import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arkham",
  description: "Central command center for daily discipline and life tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
