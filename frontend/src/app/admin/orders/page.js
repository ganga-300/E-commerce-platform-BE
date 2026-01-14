"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import { ShoppingBag, Truck, CheckCircle, XCircle, Clock, Search, Loader2, ArrowRight } from "lucide-react"

export default function AdminOrders() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (!authLoading) {
            const userRole = user?.role?.toUpperCase();
            if (!user || userRole !== 'ADMIN') {
                router.push('/')
                return
            }
            fetchOrders()
        }
    }, [user, authLoading])

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/orders`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            setOrders(data.orders || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#637D37] w-12 h-12" />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
                        <p className="text-gray-500 font-medium">Track and process customer orders.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#637D37] outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map(o => (
                                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="font-bold text-gray-900 font-mono text-sm">#{o.id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div>
                                                <div className="font-bold text-gray-900">{o.user.userName}</div>
                                                <div className="text-xs text-gray-400">{o.user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="font-black text-gray-900">₹{o.totalAmount}</span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                    o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                        o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                }`}>
                                                {o.status === 'DELIVERED' && <CheckCircle className="w-3 h-3" />}
                                                {o.status === 'SHIPPED' && <Truck className="w-3 h-3" />}
                                                {o.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                                                {['PENDING', 'PROCESSING'].includes(o.status) && <Clock className="w-3 h-3" />}
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(o.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#637D37] hover:bg-[#637D37]/10 rounded-xl transition-all">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
