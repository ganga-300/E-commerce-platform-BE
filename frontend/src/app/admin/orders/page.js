"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
    ShoppingBag,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Loader2,
    ArrowUpRight,
    Filter,
    Activity,
    CreditCard,
    ChevronRight,
    Calendar,
    ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/orders?cb=${Date.now()}`, {
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
        <div className="min-h-screen flex items-center justify-center bg-transparent p-20">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-[3px] border-[#637D37]/10 border-t-[#637D37] rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-[#637D37] animate-pulse" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Retrieving Transaction Ledger</p>
            </div>
        </div>
    )

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-transparent p-6 lg:p-10 space-y-10"
        >
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#637D37]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header / Top Bar */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#637D37] font-black text-[10px] uppercase tracking-[0.4em]">
                        <span className="w-4 h-px bg-[#637D37]"></span> LOGISTICS OVERSIGHT
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">
                        Order <span className="text-[#637D37]">Flow</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#637D37] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[28px] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#637D37]/10 focus:border-[#637D37]/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="w-14 h-14 bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[24px] flex items-center justify-center text-gray-400 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Main Data Floor */}
            <motion.div
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-2xl border border-gray-100 rounded-[40px] overflow-hidden shadow-sm relative z-10"
            >
                <div className="overflow-x-auto p-2 lg:p-6">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-50/50">
                                <th className="px-6 py-6 pb-8">Order Signature</th>
                                <th className="px-6 py-6 pb-8">Consignee Identity</th>
                                <th className="px-6 py-6 pb-8">Settlement Value</th>
                                <th className="px-6 py-6 pb-8">Delivery Lifecycle</th>
                                <th className="px-6 py-6 pb-8">Time Stamp</th>
                                <th className="px-6 py-6 pb-8 text-right">Nexus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredOrders.map(o => (
                                <tr key={o.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-white group-hover:border-[#637D37]/20 transition-all">
                                                <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-[#637D37]" />
                                            </div>
                                            <div className="font-black text-gray-900 font-mono text-xs tracking-wider">
                                                #{o.id.slice(-8).toUpperCase()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900 group-hover:text-[#637D37] transition-colors">{o.user.userName}</span>
                                            <span className="text-[10px] font-bold text-gray-400 tracking-tight">{o.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="text-lg font-black text-gray-900 tracking-tighter tabular-nums">₹{o.totalAmount.toLocaleString()}</div>
                                        <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Pre-calculated</div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            o.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                o.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {o.status === 'DELIVERED' && <CheckCircle className="w-3.5 h-3.5" />}
                                            {o.status === 'SHIPPED' && <Truck className="w-3.5 h-3.5" />}
                                            {o.status === 'CANCELLED' && <XCircle className="w-3.5 h-3.5" />}
                                            {['PENDING', 'PROCESSING'].includes(o.status) && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                                            {o.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-xs font-black text-gray-600">
                                            <Calendar className="w-3.5 h-3.5 text-gray-300" />
                                            {new Date(o.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap text-right">
                                        <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl inline-flex items-center justify-center text-gray-400 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="py-32 text-center">
                            <div className="w-24 h-24 bg-gray-50/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                                <ShoppingBag className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">No Transactions Detected</h3>
                            <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">The requested transaction parameters returned no matching entities.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Pagination / Footer Info */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[40px]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Throughput</p>
                        <p className="text-sm font-bold text-gray-900">Total processed volume: {orders.length} transaction vectors.</p>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/admin')}
                    className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    Return to Intelligence Hub
                    <ChevronRight className="w-4 h-4" />
                </button>
            </motion.div>
        </motion.div>
    )
}
