"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import {
    Package,
    Calendar,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ArrowRight,
    ShoppingBag,
    Search
} from "lucide-react"
import { toast } from "sonner"

export default function MyOrders() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
            return
        }

        const fetchOrders = async () => {
            if (!user) return

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/orders/user/${user.id}`)
                if (!res.ok) throw new Error('Failed to fetch orders')
                const data = await res.json()
                setOrders(data)
            } catch (err) {
                toast.error("Failed to load order history")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user, authLoading, router])

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'text-green-600 bg-green-100/50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            case 'processing': return 'text-blue-600 bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            case 'shipped': return 'text-purple-600 bg-purple-100/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
            case 'cancelled': return 'text-red-600 bg-red-100/50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            default: return 'text-yellow-600 bg-yellow-100/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return <CheckCircle className="w-4 h-4" />
            case 'processing': return <Clock className="w-4 h-4" />
            case 'shipped': return <Truck className="w-4 h-4" />
            case 'cancelled': return <XCircle className="w-4 h-4" />
            default: return <Package className="w-4 h-4" />
        }
    }

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems.some(item => item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground flex items-center gap-3">
                            <ShoppingBag className="w-8 h-8 text-primary" />
                            My Orders
                        </h1>
                        <p className="text-muted-foreground mt-2">Track and manage your recent purchases</p>
                    </div>

                    <div className="relative max-w-md w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search orders or products..."
                            className="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border p-16 text-center"
                    >
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-8">
                            {searchTerm ? "Try adjusting your search terms." : "Looks like you haven't placed any orders yet."}
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
                        >
                            Start Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {filteredOrders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-card rounded-2xl shadow-sm hover:shadow-md border border-border overflow-hidden transition-all duration-300"
                                >
                                    <div className="p-6 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-background rounded-full border border-border flex items-center justify-center font-bold text-xs text-muted-foreground shadow-sm">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</p>
                                                <p className="font-mono text-foreground font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="hidden sm:block">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Date Placed</p>
                                                <p className="text-foreground font-medium flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                                                <p className="text-primary font-black text-lg">
                                                    ₹{order.totalAmount || order.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {order.orderItems?.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors group/item">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-16 w-16 bg-white rounded-xl border border-border flex-shrink-0 relative overflow-hidden">
                                                            <Image
                                                                src={item.product?.imageUrl || "/placeholder.jpg"}
                                                                alt={item.product?.name || "Product"}
                                                                fill
                                                                className="object-cover"
                                                                onError={(e) => { e.target.src = "/placeholder.jpg" }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-foreground group-hover/item:text-primary transition-colors">
                                                                {item.product?.name || "Product Name"}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-foreground">
                                                        ₹{item.price * item.quantity}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-border flex justify-end">
                                            <button
                                                onClick={() => router.push(`/orders/${order.id}`)}
                                                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                                            >
                                                View Order Details <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
