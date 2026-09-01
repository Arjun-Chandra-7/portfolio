import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arjun Chandra — AI & Software Builder",
  description: "I Build Things That Shouldn't Exist Yet. AI, software, computer vision, automation, and experimental products.",
  openGraph: {
    title: "Arjun Chandra — AI & Software Builder",
    description: "AI, software, computer vision, automation, and experimental products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
