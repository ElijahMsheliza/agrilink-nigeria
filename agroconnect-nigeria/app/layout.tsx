import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "../components/providers/client-providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroConnect Nigeria - Connecting Nigerian Farmers with Buyers",
  description: "Nigeria's premier agricultural marketplace connecting farmers with buyers. Buy and sell rice, maize, cassava, yam, plantain, cocoa, and palm oil across Nigeria.",
  keywords: "Nigeria, agriculture, farming, marketplace, crops, farmers, buyers, rice, maize, cassava, yam, plantain, cocoa, palm oil",
  authors: [{ name: "AgroConnect Nigeria" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "AgroConnect Nigeria - Agricultural Marketplace",
    description: "Connect with Nigerian farmers and buyers. Trade agricultural products across Nigeria.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
