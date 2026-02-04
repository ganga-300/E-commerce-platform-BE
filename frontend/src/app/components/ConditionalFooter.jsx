"use client"
import { usePathname } from "next/navigation"
import Footer from "../features/shared/components/Footer"

export default function ConditionalFooter() {
    const pathname = usePathname()

    // Hide footer on login and signup pages
    const hideFooter = pathname === '/login' || pathname === '/signup'

    if (hideFooter) return null

    return <Footer />
}
