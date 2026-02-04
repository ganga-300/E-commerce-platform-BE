
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { FiShoppingCart } from "react-icons/fi"
import { Heart } from "lucide-react"
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MegaMenu from './MegaMenu';
import CartDrawer from './CartDrawer';

function Navbar() {
  const { totalItems, clearCart } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearCart();
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-md border-b border-[#1B3022]/10 shadow-sm transition-colors duration-300">

      <div className="flex items-center space-x-12">
        <Link href="/">
          <h1 className="text-3xl font-serif font-bold text-[#1B3022] cursor-pointer tracking-tight">
            Study<span className="text-[#637D37] italic">Stuff</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <MegaMenu />
          <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-[#1B3022]/80 hover:text-[#637D37] transition-colors">
            About
          </Link>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?query=${e.target.search.value}`); }} className="relative w-full max-w-sm hidden lg:block">
          <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-4 w-4 text-[#1B3022]/40"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1112.75 5.25a7.5 7.5 0 014.9 11.4z"
              />
            </svg>
          </button>
          <input
            name="search"
            type="text"
            placeholder="Search premium products..."
            className="pl-10 pr-4 py-2 h-10 w-full rounded-xl bg-[#F5F5F0] border-none text-[#1B3022] placeholder-[#1B3022]/40 focus:outline-none focus:ring-1 focus:ring-[#637D37]/20 focus:bg-white transition-all font-medium text-sm"
          />
        </form>
      </div>

      <div className="flex items-center space-x-6">
        <Link href="/wishlist" className="text-sm font-semibold text-[#1B3022] hover:text-[#637D37] transition-colors flex items-center gap-1 group">
          <Heart className="w-5 h-5 group-hover:fill-[#637D37] transition-colors" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsCartOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 border
              ${totalItems > 0
                ? 'bg-[#1B3022] text-[#FCFBF7] border-[#1B3022] shadow-[0_4px_12px_rgba(27,48,34,0.15)]'
                : 'bg-white text-[#1B3022] border-[#1B3022]/10 hover:border-[#1B3022]'}`}
          >
            <FiShoppingCart className="text-lg" />
            <span>Cart ({totalItems})</span>
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="h-8 w-[1px] bg-[#1B3022]/10"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-[#1B3022]/60 font-bold">Account</span>
              <span className="text-sm text-[#1B3022] font-bold font-serif">Hi, {user.userName}</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm font-bold text-[#1B3022]/80 hover:text-[#637D37] transition-colors">
                Profile
              </Link>
              <Link href="/orders" className="text-sm font-bold text-[#1B3022]/80 hover:text-[#637D37] transition-colors">
                Orders
              </Link>
              {user?.role?.toUpperCase() === "SELLER" && (
                <Link href="/seller" className="text-sm font-bold text-[#637D37] hover:text-[#1B3022] transition-colors">
                  Seller Dashboard
                </Link>
              )}
              {user?.role?.toUpperCase() === "ADMIN" && (
                <Link href="/admin" className="text-sm font-bold text-[#637D37] hover:scale-105 transition-all">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all uppercase tracking-wider"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-6 py-2 text-sm font-bold text-[#1B3022] hover:text-[#637D37] transition-colors uppercase tracking-widest text-[11px]">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 text-[11px] font-bold text-[#FCFBF7] bg-[#1B3022] rounded-xl hover:bg-[#637D37] transition-all uppercase tracking-widest shadow-lg shadow-[#1B3022]/20">
                Join
              </button>
            </Link>
          </div>
        )}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Navbar;
