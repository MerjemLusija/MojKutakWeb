import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "./components/LoadingScreen";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moj Kutak - Cute Food Blog",
  description: "Dobrodošli u Moj Kutak - mjesto za slatke i slane recepte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        <nav className="header">
          {/* Logo */}
          <Link href="/">
            <div className="logo-container">
              <Image 
                src="/logo2.png" 
                alt="Moj Kutak Logo" 
                width={120} 
                height={120} 
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>

          {/* Links */}
          <div className="nav-links">
            <Link href="/" className="nav-item">Početna</Link>
            <Link href="/recepti" className="nav-item">Recepti</Link>
            <Link href="/o-meni" className="nav-item">O Meni</Link>
            <Link href="#" className="nav-item">YouTube</Link>
            <Link href="/kontakt" className="nav-item">Kontakt</Link>
          </div>
        </nav>
        
        {children}

        {/* New Footer */}
        <footer className="footer">
          <div className="logo-container" style={{justifyContent: 'center'}}>
            <Image 
              src="/logo2.png" 
              alt="Moj Kutak Logo" 
              width={180} 
              height={60} 
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="social-icons">
            <span className="social-circle">▶️</span>
            <span className="social-circle">📘</span>
            <span className="social-circle">📸</span>
            <span className="social-circle">📌</span>
            <span className="social-circle">🎵</span>
          </div>
          <p style={{ color: "var(--text-medium)", fontSize: "14px" }}>
            © {new Date().getFullYear()} Moj Kutak. Sva prava pridržana.
          </p>
        </footer>
      </body>
    </html>
  );
}
