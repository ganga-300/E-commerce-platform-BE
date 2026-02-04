"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingBag,
    ShieldCheck,
    Settings,
    ChevronRight,
    Search,
    LogOut,
    Menu,
    X,
    TrendingUp
} from "lucide-react"
import { useAuth } from "../../../contexts/AuthContext"

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Accounts", href: "/admin/users", icon: Users },
    { label: "Inventory", href: "/admin/products", icon: Package },
    { label: "Transactions", href: "/admin/orders", icon: ShoppingBag },
    { label: "Approvals", href: "/admin/approvals", icon: ShieldCheck },
]

export default function IntelligenceSidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[90] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen ? 0 : -300,
                    width: 280
                }}
                className={`fixed top-0 left-0 h-screen bg-white/70 backdrop-blur-2xl border-r border-gray-100/50 z-[100] lg:!translate-x-0 overflow-hidden flex flex-col`}
            >
                {/* Brand Logo Section */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#637D37] rounded-2xl flex items-center justify-center shadow-lg shadow-[#637D37]/20">
                            <TrendingUp className="text-white w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-gray-900 tracking-tighter leading-none">STATIONERY</span>
                            <span className="text-[10px] font-black text-[#637D37] uppercase tracking-[0.3em]">INTELLIGENCE</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <div className="mb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management Horizon</div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#637D37]/10 text-[#637D37]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 w-1 h-6 bg-[#637D37] rounded-r-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className={`text-sm font-black transition-all duration-300 ${isActive ? 'tracking-normal' : 'tracking-tight group-hover:tracking-normal'}`}>
                                        {item.label}
                                    </span>
                                    <ChevronRight className={`ml-auto w-4 h-4 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Section (Premium Footer) */}
                <div className="p-4 mt-auto">
                    <div className="group relative bg-[#637D37]/5 rounded-[32px] p-4 border border-[#637D37]/10 overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-[14px] bg-white p-0.5 shadow-sm">
                                <div className="w-full h-full rounded-[12px] bg-[#637D37]/10 flex items-center justify-center font-black text-xs text-[#637D37]">
                                    {user?.userName?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tighter">{user?.userName}</p>
                                <p className="text-[10px] font-bold text-[#637D37] uppercase tracking-widest">{user?.role}</p>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#637D37]/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>
            </motion.aside>
        </>
    )
}
