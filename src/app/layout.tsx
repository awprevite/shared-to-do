import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shared To Do",
  description: "Multi-user to do list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans text-base bg-[--bg-color] text-[--fg-color]">
        {children}
      </body>
    </html>
  );
}
