import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FVN Affiliate Center",
  description: "FVN Affiliate Center is a creator commerce dashboard for affiliate product research, content planning, campaign management, and publishing workflow.",
  applicationName: "FVN Affiliate Center",
  openGraph: {
    title: "FVN Affiliate Center",
    description: "FVN Affiliate Center is a creator commerce dashboard for affiliate product research, content planning, campaign management, and publishing workflow."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
