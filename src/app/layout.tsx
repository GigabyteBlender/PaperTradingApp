import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BalanceProvider } from "@/contexts/BalanceContext";
import ClientLayout from "../components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <head>
        <title>StockTrainer - Trading Simulator</title>
        <meta name="description" content="Learn stock trading with our comprehensive simulator" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <BalanceProvider>
          <ClientLayout>{children}</ClientLayout>
        </BalanceProvider>
      </body>
    </html>
  );
}