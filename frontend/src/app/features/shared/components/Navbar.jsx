

"use client"

import React from 'react';
import Link from 'next/link';
import { FiShoppingCart } from "react-icons/fi"
import { Heart } from "lucide-react"
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MegaMenu from './MegaMenu';

function Navbar() {
  const { totalItems, clearCart } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    clearCart();
  };

  const handleCartClick = () => {
    if (user) {
      router.push('/cart');
    } else {
      router.push('/login');
    }
  };
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">

      <div className="flex items-center space-x-12">
        <Link href="/">
          <h1 className="text-3xl font-heading font-bold text-foreground cursor-pointer tracking-tight">
            Study<span className="text-primary">Stuff</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <MegaMenu />
          <Link href="/about" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?query=${e.target.search.value}`); }} className="relative w-full max-w-sm hidden lg:block">
          <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-4 w-4 text-muted-foreground"
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
            className="pl-10 pr-4 py-2 h-10 w-full rounded-xl bg-muted border-none text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
          />
        </form>
      </div>

      <div className="flex items-center space-x-6">
        <Link href="/wishlist" className="text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 group">
          <Heart className="w-5 h-5 group-hover:fill-destructive transition-colors" />
        </Link>

        <div className="relative">
          <button
            onClick={handleCartClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-primary-foreground font-bold text-sm transition-all hover:scale-105 active:scale-95
              ${totalItems > 0 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}
          >
            <FiShoppingCart className="text-lg" />
            <span>Cart ({totalItems})</span>
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 font-medium">Account</span>
              <span className="text-sm text-gray-800 font-bold">Hi, {user.userName}</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm font-semibold text-gray-600 hover:text-[#637D37] transition-colors">
                Profile
              </Link>
              <Link href="/orders" className="text-sm font-semibold text-gray-600 hover:text-[#637D37] transition-colors">
                Orders
              </Link>
              {user?.role?.toUpperCase() === "SELLER" && (
                <Link href="/seller" className="text-sm font-semibold text-gray-600 hover:text-[#637D37] transition-colors">
                  Seller Dashboard
                </Link>
              )}
              {user?.role?.toUpperCase() === "ADMIN" && (
                <Link href="/admin" className="text-sm font-semibold text-[#637D37] font-bold hover:scale-105 transition-all">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-6 py-2 text-sm font-bold text-gray-700 hover:text-[#637D37] transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 text-sm font-bold text-white bg-black rounded-xl hover:bg-[#637D37] transition-all">
                Join
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
