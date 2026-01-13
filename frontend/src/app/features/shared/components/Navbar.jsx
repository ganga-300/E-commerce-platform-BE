

"use client"

import React from 'react';
import Link from 'next/link';
import { FiShoppingCart } from "react-icons/fi"
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
    <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="flex items-center space-x-12">
        <Link href="/">
          <h1 style={{ fontFamily: 'TTRamillas' }} className="text-3xl font-bold text-black cursor-pointer">
            Study<span style={{ color: '#637D37' }}>Stuff</span>
          </h1>
        </Link>

        <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?query=${e.target.search.value}`); }} className="relative w-full max-w-sm mx-auto">
          <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-4 w-4 text-gray-400"
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
            className="pl-10 pr-4 py-2 h-10 w-full rounded-xl bg-gray-50 border-none text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:bg-white transition-all"
          />
        </form>
      </div>

      <div className="flex items-center space-x-8">
        <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-[#637D37] transition-colors">
          About
        </Link>

        <div className="relative">
          <button
            onClick={handleCartClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-sm transition-all
              ${totalItems > 0 ? 'bg-[#637D37] shadow-lg shadow-[#637D37]/20' : 'bg-gray-400'}`}
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
              <Link href="/orders" className="text-sm font-semibold text-gray-600 hover:text-[#637D37] transition-colors">
                Orders
              </Link>
              {user?.role?.toUpperCase() === "SELLER" && (
                <Link href="/seller" className="text-sm font-semibold text-gray-600 hover:text-[#637D37] transition-colors">
                  Dashboard
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
