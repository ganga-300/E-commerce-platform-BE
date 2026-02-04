"use client"
import { usePathname } from "next/navigation"
import Navbar from "./features/shared/components/Navbar"
import Footer from "./features/shared/components/Footer"
import { CommandMenu } from "@/components/CommandMenu"

export default function LayoutWrapper({ children }) {
    const pathname = usePathname()

    // Hide footer on login and signup pages
    const hideFooter = pathname === '/login' || pathname === '/signup'

    return (
        <>
            <Navbar />
            <CommandMenu />
            {children}
            {!hideFooter && <Footer />}
        </>
    )
}
