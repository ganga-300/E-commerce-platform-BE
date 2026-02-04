"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import {
    ArrowLeft,
    Package,
    Calendar,
    MapPin,
    CreditCard,
    CheckCircle,
    Truck,
    Clock,
    Download
} from "lucide-react"
import { toast } from "sonner"

export default function OrderDetailsPage() {
    const { id } = useParams()
    const { user, token } = useAuth()
    const router = useRouter()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id || !token) return
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/orders/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (!res.ok) throw new Error("Order not found")
                const data = await res.json()
                setOrder(data)
            } catch (err) {
                toast.error("Failed to load order")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (user) {
            fetchOrder()
        }
    }, [id, user, token])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <h1 className="text-2xl font-bold">Order not found</h1>
            <button onClick={() => router.back()} className="text-primary hover:underline">Go Back</button>
        </div>
    )

    const steps = [
        { status: 'Pending', label: 'Order Placed', icon: Clock },
        { status: 'Processing', label: 'Processing', icon: Package },
        { status: 'Shipped', label: 'Shipped', icon: Truck },
        { status: 'Delivered', label: 'Delivered', icon: CheckCircle },
    ]

    const getCurrentStep = () => {
        const status = order.status || 'Pending'
        const index = steps.findIndex(s => s.status.toLowerCase() === status.toLowerCase())
        return index === -1 ? 0 : index
    }

    const currentStepIndex = getCurrentStep()

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Order #{order.id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    {/* Placeholder for Invoice Download */}
                    <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4" />
                        Invoice
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items & Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Timeline */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-8">Order Status</h2>
                            <div className="relative flex justify-between">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-[#637D37] -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                ></div>

                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex
                                    const Icon = step.icon
                                    return (
                                        <div key={index} className="flex flex-col items-center bg-white px-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-[#637D37] border-[#637D37] text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`mt-2 text-xs font-bold ${isCompleted ? 'text-[#637D37]' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Items</h2>
                            <div className="space-y-6">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                            <Image
                                                src={item.product?.imageUrl || "/placeholder.jpg"}
                                                alt={item.product?.name || "Product"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">{item.product?.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">Quantity: {item.quantity}</p>
                                            <p className="font-bold text-[#637D37]">₹{item.price * item.quantity}</p>
                                        </div>
                                        {/* Review Button Placeholder */}
                                        <button className="self-center px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                            Write Review
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Address & Payment */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                Shipping Address
                            </h2>
                            <div className="text-gray-600 space-y-1">
                                <p className="font-semibold text-gray-900">User Name (TODO)</p>
                                {/* Order model typically stores flattened address or relational. Service showed fields: shippingAddress, city, state, zip, phoneNumber */}
                                <p>{order.shippingAddress}</p>
                                <p>{order.city}, {order.state} {order.zip}</p>
                                <p className="mt-2 text-sm text-gray-500">Phone: {order.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                Payment Info
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-semibold">Razorpay / Online</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Transaction ID</span>
                                    <span className="font-mono text-xs text-gray-700">{order.razorpayPaymentId || "N/A"}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-900">Total Paid</span>
                                    <span className="font-black text-2xl text-[#637D37]">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
