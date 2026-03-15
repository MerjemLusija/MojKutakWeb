import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Moj Kutak - Kulinarski Blog & YouTube Kanal",
  description:
    "Dobrodošli u Moj Kutak — mjesto gdje kuhanje postaje radost. Recepti iz srca, puni okusa i ljubavi.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bs">
      <body>
        {/* ─── Loading Screen ─── */}
        <LoadingScreen />

        {/* ─── STICKY PILL NAVBAR ─── */}
        <Header />

        {/* ─── PAGE CONTENT ─── */}
        {children}

        {/* ─── FOOTER ─── */}
        <Footer />
      </body>
    </html>
  );
}
