"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import Navbar from "../features/shared/components/Navbar"
import Footer from "../features/shared/components/Footer"
import { CommandMenu } from "@/components/CommandMenu"
import AdminSidebar from "../admin/components/AdminSidebar"
import { useAuth } from "../../contexts/AuthContext"
import { useState } from "react"
import { Menu } from "lucide-react"

export default function LayoutWrapper({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading } = useAuth()
    const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false)

    useEffect(() => {
        // Automatically open sidebar on desktop
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setIsAdminSidebarOpen(true)
        }
    }, [])

    useEffect(() => {
        if (loading) return

        const role = user?.role?.toUpperCase()
        const isAuthPage = pathname === '/login' || pathname === '/signup'

        if (role === 'ADMIN' && !pathname.startsWith('/admin') && !isAuthPage && pathname !== '/') {
            router.replace('/admin')
        } else if (role === 'SELLER' && !pathname.startsWith('/seller') && !isAuthPage && pathname !== '/') {
            router.replace('/seller')
        }
    }, [user, loading, pathname, router])

    // Detect if we are in admin or seller dashboard area
    const isAdminArea = pathname.startsWith('/admin')
    const isSellerArea = pathname.startsWith('/seller')
    const role = user?.role?.toUpperCase()

    // Hide customer storefront UI for Admins and Sellers, EXCEPT on the home page
    const isRestrictedRole = role === 'ADMIN' || role === 'SELLER'
    const hideCustomerUI = (isRestrictedRole && pathname !== '/') || isAdminArea || isSellerArea

    // Hide footer on login and signup pages for customers
    const hideFooter = hideCustomerUI || pathname === '/login' || pathname === '/signup'

    if (loading) return null

    return (
        <>
            {!hideCustomerUI && <Navbar />}
            {!hideCustomerUI && <CommandMenu />}

            {isAdminArea ? (
                <div className="flex min-h-screen bg-gray-50/50">
                    <AdminSidebar isOpen={isAdminSidebarOpen} setIsOpen={setIsAdminSidebarOpen} />
                    <main className="flex-1 lg:ml-[280px] min-h-screen flex flex-col">
                        {/* Admin Mobile Header */}
                        <div className="lg:hidden flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
                            <button
                                onClick={() => setIsAdminSidebarOpen(true)}
                                className="p-2 bg-gray-50 rounded-xl text-gray-500"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#637D37] rounded-xl flex items-center justify-center">
                                    <span className="text-white text-[10px] font-black">S</span>
                                </div>
                                <span className="text-sm font-black text-gray-900 tracking-tighter">INTELLIGENCE</span>
                            </div>
                            <div className="w-10"></div> {/* Spacer */}
                        </div>
                        {children}
                    </main>
                </div>
            ) : (
                children
            )}

            {!hideFooter && <Footer />}
        </>
    )
}
