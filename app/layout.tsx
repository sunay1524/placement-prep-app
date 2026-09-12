import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import AuthGateTimer from "../components/AuthGateTimer";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlacePrep — Crack Your Next Placement",
  description:
    "Crowdsourced interview experiences, searchable by company and round type. Track your DSA, SQL, and aptitude prep progress.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        {/* Shows a sign-in gate after 90s for unauthenticated visitors */}
        <AuthGateTimer isLoggedIn={isLoggedIn} />
      </body>
    </html>
  );
}
