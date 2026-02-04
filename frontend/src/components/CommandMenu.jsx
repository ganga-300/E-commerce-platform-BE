"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import {
    Search,
    ShoppingCart,
    User,
    Home,
    Package,
    Truck,
    LogOut,
    Settings,
    Shield,
    ShoppingBag,
    Users,
    FileText,
    TrendingUp,
    Store
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState({ users: [], products: [], orders: [] })
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const { user, token, logout } = useAuth()

    const isAdmin = user?.role?.toUpperCase() === 'ADMIN'

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        if (!isAdmin || !query || query.length < 2) {
            setResults({ users: [], products: [], orders: [] })
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/search?query=${query}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setResults(data)
                }
            } catch (err) {
                console.error("Search error:", err)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query, isAdmin, token])

    const runCommand = (command) => {
        setOpen(false)
        command()
    }

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-3xl z-[9999] p-0 overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 animate-in zoom-in duration-200"
            overlayClassName="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[9998]"
        >
            <div className="flex items-center border-b border-gray-50 px-6 py-4" cmdk-input-wrapper="">
                <Search className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                <Command.Input
                    placeholder={isAdmin ? "Search users, products, orders or type a command..." : "Find products, categories..."}
                    value={query}
                    onValueChange={setQuery}
                    className="flex h-11 w-full rounded-md bg-transparent text-base outline-none placeholder:text-gray-400"
                />
            </div>

            <Command.List className="max-h-[450px] overflow-y-auto overflow-x-hidden p-4">
                {loading && <div className="p-4 text-center text-xs text-gray-400 animate-pulse font-medium">Searching marketplace...</div>}

                <Command.Empty className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <Search className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-black text-gray-900">No results for "{query}"</p>
                        <p className="text-xs text-gray-400 font-medium">Try searching for a different term.</p>
                    </div>
                </Command.Empty>

                {/* Admin Live Search Results */}
                {isAdmin && (
                    <>
                        {results.users.length > 0 && (
                            <Command.Group heading="Accounts Found" className="px-2 py-3">
                                {results.users.map(u => (
                                    <Command.Item
                                        key={u.id}
                                        onSelect={() => runCommand(() => router.push(`/admin/users/${u.id}`))}
                                        className="flex cursor-pointer select-none items-center rounded-2xl px-4 py-3 text-sm outline-none aria-selected:bg-[#637D37]/5 aria-selected:text-[#637D37] transition-all group gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400 group-aria-selected:bg-[#637D37]/10 group-aria-selected:text-[#637D37]">
                                            {u.userName.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 group-aria-selected:text-[#637D37]">{u.userName}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{u.email} • {u.role}</span>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {results.products.length > 0 && (
                            <Command.Group heading="Products Found" className="px-2 py-3 border-t border-gray-50">
                                {results.products.map(p => (
                                    <Command.Item
                                        key={p.id}
                                        onSelect={() => runCommand(() => router.push(`/product/${p.id}`))}
                                        className="flex cursor-pointer select-none items-center rounded-2xl px-4 py-3 text-sm outline-none aria-selected:bg-[#637D37]/5 aria-selected:text-[#637D37] transition-all group gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 bg-white p-1">
                                            <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 group-aria-selected:text-[#637D37]">{p.name}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">SKU: {p.sku}</span>
                                        </div>
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}
                    </>
                )}

                {!query && (
                    <>
                        <Command.Group heading="Quick Access" className="px-2 py-3">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/'))}
                                className="flex cursor-pointer select-none items-center rounded-2xl px-4 py-3 text-sm outline-none aria-selected:bg-[#637D37]/5 aria-selected:text-[#637D37] transition-all group gap-3"
                            >
                                <Home className="h-4 w-4 text-gray-400 group-aria-selected:text-[#637D37]" />
                                <span className="font-black text-gray-700 group-aria-selected:text-[#637D37]">Storefront Home</span>
                            </Command.Item>

                            {isAdmin ? (
                                <>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push('/admin'))}
                                        className="flex cursor-pointer select-none items-center rounded-2xl px-4 py-3 text-sm outline-none aria-selected:bg-[#637D37]/5 aria-selected:text-[#637D37] transition-all group gap-3"
                                    >
                                        <TrendingUp className="h-4 w-4 text-gray-400 group-aria-selected:text-[#637D37]" />
                                        <span className="font-black text-gray-700 group-aria-selected:text-[#637D37]">Admin Intelligence</span>
                                    </Command.Item>
                                    <Command.Item
                                        onSelect={() => runCommand(() => router.push('/admin/approvals'))}
                                        className="flex cursor-pointer select-none items-center rounded-2xl px-4 py-3 text-sm outline-none aria-selected:bg-blue-50 aria-selected:text-blue-600 transition-all group gap-3"
                                    >
                                        <Shield className="h-4 w-4 text-gray-400 group-aria-selected:text-blue-600" />
                                        <span className="font-black text-gray-700 group-aria-selected:text-blue-600">Review Seller Apps</span>
                                    </Command.Item>
                                </>
                            ) : (
                                <Command.Item
                                    onSelect={() => runCommand(() => router.push('/cart'))}
                                    className="flex cursor-pointer select-none items-center rounded-2xl px-4 py-3 text-sm outline-none aria-selected:bg-[#637D37]/5 aria-selected:text-[#637D37] transition-all group gap-3"
                                >
                                    <ShoppingCart className="h-4 w-4 text-gray-400 group-aria-selected:text-[#637D37]" />
                                    <span className="font-black text-gray-700 group-aria-selected:text-[#637D37]">View My Cart</span>
                                </Command.Item>
                            )}
                        </Command.Group>

                        <Command.Group heading="Settings & Identity" className="px-2 py-3 border-t border-gray-50">
                            <Command.Item
                                onSelect={() => runCommand(() => logout())}
                                className="flex cursor-pointer select-none items-center rounded-2xl px-4 py-3 text-sm outline-none aria-selected:bg-red-50 aria-selected:text-red-500 transition-all group gap-3 text-red-400"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="font-black">Sign Out of Platform</span>
                            </Command.Item>
                        </Command.Group>
                    </>
                )}
            </Command.List>

            <div className="bg-gray-50/50 border-t border-gray-50 px-6 py-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded-md min-w-[20px] text-center shadow-sm">Enter</kbd> to select</span>
                    <span className="flex items-center gap-1.5"><kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded-md min-w-[20px] text-center shadow-sm">Esc</kbd> to close</span>
                </div>
                <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Secure Access
                </div>
            </div>
        </Command.Dialog>
    )
}
