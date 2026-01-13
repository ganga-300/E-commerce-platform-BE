"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { Package, Calendar, ChevronRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react"

export default function MyOrders() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user, authLoading, router])

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'text-green-600 bg-green-50 border-green-200'
            case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200'
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
        }
    }

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle className="w-5 h-5" />
            case 'processing': return <Truck className="w-5 h-5" />
            case 'cancelled': return <XCircle className="w-5 h-5" />
            default: return <Clock className="w-5 h-5" />
        }
    }

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#637D37]"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Package className="w-8 h-8 text-[#637D37]" />
                    My Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Looks like you haven&apos;t placed any orders yet.</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-[#637D37] hover:bg-[#52682d] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500 font-medium">Order ID</p>
                                        <p className="font-mono text-gray-900 font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> Date
                                        </p>
                                        <p className="text-gray-900 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                            <Truck className="w-4 h-4" /> Ship to
                                        </p>
                                        <p className="text-gray-900 font-medium truncate max-w-[200px]">
                                            {order.shippingAddress || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                                        <p className="text-[#637D37] font-bold text-lg">
                                            ₹{order.totalAmount || order.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
                                    <div className="space-y-4">
                                        {order.orderItems?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                                                        <Package className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{item.product?.name || "Product Name"}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
