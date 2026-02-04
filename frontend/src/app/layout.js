import { Outfit, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { CartProvider } from '../contexts/CartContext.js';
import { AuthProvider } from '../contexts/AuthContext.js';
import { ToastProvider } from '../contexts/ToastContext.js';
import { WishlistProvider } from '../contexts/WishlistContext.js';
import { Toaster } from 'sonner';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: 'StudyStuff | Fine Stationery Artisans',
  description: 'A curated collection of premium instruments for the discerning professional.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable} ${cormorant.variable} antialiased font-body`}>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
                <Toaster position="bottom-right" richColors />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
