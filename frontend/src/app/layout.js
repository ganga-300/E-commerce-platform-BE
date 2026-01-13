import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./features/shared/components/Navbar";
import Footer from "./features/shared/components/Footer";
import { CartProvider } from '../contexts/CartContext.js';
import { AuthProvider } from '../contexts/AuthContext.js';
import { ToastProvider } from '../contexts/ToastContext.js';




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'StudyStuff',
  description: 'Stationery supplies made easy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
