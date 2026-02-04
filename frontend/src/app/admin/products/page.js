"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
    Package,
    Trash2,
    Search,
    Loader2,
    Star,
    AlertCircle,
    ArrowUpRight,
    Filter,
    Activity,
    Box,
    ExternalLink,
    ChevronRight
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

export default function AdminProducts() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [deleting, setDeleting] = useState(null)

    useEffect(() => {
        if (!authLoading) {
            const userRole = user?.role?.toUpperCase();
            if (!user || userRole !== 'ADMIN') {
                router.push('/')
                return
            }
            fetchProducts()
        }
    }, [user, authLoading])

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/products?cb=${Date.now()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            setProducts(data.products || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product? This will remove it from the platform permanently.")) return

        setDeleting(id)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/products/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(null)
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <Package className="w-6 h-6 text-[#637D37] animate-pulse" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Syncing Inventory Index</p>
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
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header / Top Bar */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#637D37] font-black text-[10px] uppercase tracking-[0.4em]">
                        <span className="w-4 h-px bg-[#637D37]"></span> ASSET MODERATION
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">
                        Inventory <span className="text-[#637D37]">Control</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#637D37] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU or brand..."
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
                                <th className="px-6 py-6 pb-8">Asset Vector</th>
                                <th className="px-6 py-6 pb-8">Origin (Vendor)</th>
                                <th className="px-6 py-6 pb-8">Valuation / Delta</th>
                                <th className="px-6 py-6 pb-8">Performance</th>
                                <th className="px-6 py-6 pb-8 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-inner flex-shrink-0 group-hover:border-[#637D37]/30 transition-all duration-500">
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                            <Package className="w-6 h-6 text-gray-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                {p.stock < 10 && (
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center">
                                                        <AlertCircle className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-black text-gray-900 group-hover:text-[#637D37] transition-colors truncate max-w-[240px] lowercase first-letter:uppercase">{p.name}</div>
                                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{p.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                                                {p.seller?.userName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900">{p.seller?.userName || "Anonymous"}</span>
                                                <span className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">{p.seller?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="text-lg font-black text-gray-900 tracking-tighter">₹{p.price.toLocaleString()}</div>
                                        <div className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest mt-1 ${p.stock < 10 ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100' : 'text-gray-400'}`}>
                                            {p.stock} Units Remaining
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span className="text-xs font-black text-gray-900">{p.averageRating?.toFixed(1) || "0.0"}</span>
                                        </div>
                                        <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">
                                            {p.reviewCount} Platform Feedbacks
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => router.push(`/product/${p.id}`)}
                                                className="w-12 h-12 bg-white border border-gray-100 rounded-2xl inline-flex items-center justify-center text-gray-400 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                disabled={deleting === p.id}
                                                className="w-12 h-12 bg-white border border-gray-100 rounded-2xl inline-flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                                            >
                                                {deleting === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="py-32 text-center">
                            <div className="w-24 h-24 bg-gray-50/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                                <Box className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Zero Assets Found</h3>
                            <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">No inventory entities match your current filtering parameters.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Pagination / Footer Info */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[40px]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#637D37]">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Integrity</p>
                        <p className="text-sm font-bold text-gray-900">Scanning {products.length} active inventory vectors.</p>
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
