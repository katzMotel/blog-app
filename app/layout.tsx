import type { Metadata } from "next";
import { Cookie, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import CookieBanner from "@/components/CookieBanner";
import Home from "./page";
import HomePage from "@/components/HomePage";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Application",
  description: "My personal blog application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        
        <AuthProvider>
        <NavBar />
          {children}
          <CookieBanner />
          <Footer />
        </AuthProvider>
       
          
      </body>
    </html>
  );
}
