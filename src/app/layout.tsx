import type { Metadata } from "next";
import "./globals.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multi-Agent AI Workflow Visualiser",
  description:
    "Mission Control for your AI team. Design, connect, and execute multi-agent workflows visually.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
