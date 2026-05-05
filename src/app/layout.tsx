import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryClients  from "@/providers/ReactQueryClients";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Management App",
  description: "A simple project management tool built with Next.js, Prisma and BetterAuth.",
  icons: "/dashboard-hero.svg",
  keywords: ["project management", "task management", "ethara ai project management", "next.js", "prisma", "betterauth" ],
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryClients>
        <TooltipProvider>{children}</TooltipProvider>
        </ReactQueryClients>
      </body>
    </html>
  );
}
