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
  authors: [{ name: "Mobeen Khan", url: "https://developermobeen7.vercel.app" }],
  creator: "Mobeen Khan",
  publisher: "Mobeen Khan",
  applicationName: "Project Management System",
  openGraph: {
    title: "Project Management System",
    description: "Project Management System for Ethara AI",
    images: "/dashboard-hero.png",
  },

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
