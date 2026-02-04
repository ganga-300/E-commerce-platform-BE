"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, ShoppingCart, User, Home, Package, Truck, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { logout } = useAuth()

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

    const runCommand = (command) => {
        setOpen(false)
        command()
    }

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-card border border-border shadow-2xl rounded-xl z-[9999] p-2 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        >
            <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                    placeholder="Type a command or search..."
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>

                <Command.Group heading="Suggestions" className="mb-2">
                    <Command.Item
                        onSelect={() => runCommand(() => router.push('/'))}
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected='true']:bg-primary data-[selected='true']:text-primary-foreground transition-colors group"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                        <span className="ml-auto text-xs tracking-widest text-muted-foreground group-data-[selected='true']:text-primary-foreground">GO</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => router.push('/cart'))}
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected='true']:bg-primary data-[selected='true']:text-primary-foreground transition-colors group"
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Cart</span>
                    </Command.Item>
                </Command.Group>

                <Command.Group heading="Account" className="mb-2">
                    <Command.Item
                        onSelect={() => runCommand(() => router.push('/profile'))}
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected='true']:bg-primary data-[selected='true']:text-primary-foreground transition-colors group"
                    >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => router.push('/orders'))}
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected='true']:bg-primary data-[selected='true']:text-primary-foreground transition-colors group"
                    >
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                    </Command.Item>
                    <Command.Item
                        onSelect={() => runCommand(() => logout())}
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[selected='true']:bg-destructive data-[selected='true']:text-destructive-foreground transition-colors group text-red-500"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </Command.Item>
                </Command.Group>

            </Command.List>

            <div className="border-t pt-2 px-2 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground">ProTip: Use <kbd className="bg-muted px-1 rounded">↓</kbd> <kbd className="bg-muted px-1 rounded">↑</kbd> to navigate</span>
                <span className="text-[10px] text-muted-foreground">ESC to close</span>
            </div>
        </Command.Dialog>
    )
}
