import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LiveStreamPlayer from "./components/LiveStreamPlayer";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bourbon Budz - Premium Bourbon Podcast",
  description: "Join us for in-depth bourbon reviews, distillery visits, and conversations with industry experts. Your guide to the world of premium bourbon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <LiveStreamPlayer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
