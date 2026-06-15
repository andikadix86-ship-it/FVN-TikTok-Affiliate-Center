import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FVN TikTok Affiliate Center",
  description: "Product hunting, scoring, prompts, TikTok connection, and campaign planning for TikTok affiliate beginners."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
