"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import Navbar from "../features/shared/components/Navbar"
import Footer from "../features/shared/components/Footer"
import { CommandMenu } from "@/components/CommandMenu"
import { useAuth } from "../../contexts/AuthContext"

export default function LayoutWrapper({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading) return

        const role = user?.role?.toUpperCase()
        const isAuthPage = pathname === '/login' || pathname === '/signup'

        if (role === 'ADMIN' && !pathname.startsWith('/admin') && !isAuthPage) {
            router.replace('/admin')
        } else if (role === 'SELLER' && !pathname.startsWith('/seller') && !isAuthPage) {
            router.replace('/seller')
        }
    }, [user, loading, pathname, router])

    // Detect if we are in admin or seller dashboard area
    const isAdminArea = pathname.startsWith('/admin')
    const isSellerArea = pathname.startsWith('/seller')
    const role = user?.role?.toUpperCase()

    // Completely hide customer storefront UI for Admins and Sellers
    const isRestrictedRole = role === 'ADMIN' || role === 'SELLER'
    const hideCustomerUI = isRestrictedRole || isAdminArea || isSellerArea

    // Hide footer on login and signup pages for customers
    const hideFooter = hideCustomerUI || pathname === '/login' || pathname === '/signup'

    if (loading) return null

    return (
        <>
            {!hideCustomerUI && <Navbar />}
            {!hideCustomerUI && <CommandMenu />}
            {children}
            {!hideFooter && <Footer />}
        </>
    )
}
