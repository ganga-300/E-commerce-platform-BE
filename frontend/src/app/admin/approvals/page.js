"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import {
    Users,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Clock,
    Loader2,
    ArrowLeft,
    ShieldCheck,
    Calendar,
    ArrowUpRight,
    MapPin,
    ExternalLink,
    Search,
    ChevronRight,
    Activity,
    AlertCircle
} from "lucide-react"
import Link from "next/link"
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

export default function AdminApprovalsPage() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [pendingSellers, setPendingSellers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!authLoading) {
            const userRole = user?.role?.toUpperCase();
            if (!user || userRole !== 'ADMIN') {
                router.push('/')
                return
            }
            fetchPendingSellers()
        }
    }, [user, authLoading])

    const fetchPendingSellers = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/pending-sellers`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Failed to fetch pending sellers")
            const data = await res.json()
            setPendingSellers(data)
        } catch (err) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleApproval = async (sellerId, approve) => {
        setActionLoading(sellerId)
        setMessage("")
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/approve-seller/${sellerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isApproved: approve })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || "Failed to update status")
            }

            setMessage(`Seller ${approve ? 'approved' : 'rejected'} successfully!`)
            setTimeout(() => {
                setPendingSellers(prev => prev.filter(s => s.id !== sellerId))
                setMessage("")
            }, 1000)
        } catch (err) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }

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
                        <Users className="w-6 h-6 text-[#637D37] animate-pulse" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Scanning Authorization Queue</p>
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
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header / Top Bar */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#637D37] font-black text-[10px] uppercase tracking-[0.4em]">
                        <span className="w-4 h-px bg-[#637D37]"></span> VENDOR ONBOARDING
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">
                        Seller <span className="text-[#637D37]">Approvals</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="p-6 bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[32px] shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#637D37]/10 rounded-2xl flex items-center justify-center border border-[#637D37]/10">
                            <Users className="text-[#637D37] w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#637D37] uppercase tracking-[0.2em]">Pending Queue</p>
                            <p className="text-3xl font-black tabular-nums text-gray-900">{pendingSellers.length}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Status Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-6 rounded-[32px] border flex items-center gap-4 relative z-20 ${message.includes("Error") ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${message.includes("Error") ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                            {message.includes("Error") ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <p className="font-black text-sm uppercase tracking-widest">{message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Grid */}
            {pendingSellers.length === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-2xl border border-gray-100 rounded-[48px] p-24 text-center shadow-sm relative z-10"
                >
                    <div className="bg-emerald-50/50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-inner">
                        <CheckCircle className="text-emerald-500 w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Queue Synchronized</h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto font-medium leading-relaxed italic">There are currently no active seller applications requiring authorization.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {pendingSellers.map((seller) => (
                            <motion.div
                                key={seller.id}
                                layout
                                variants={itemVariants}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                className="group bg-white/70 backdrop-blur-2xl border border-gray-100 hover:border-[#637D37]/30 rounded-[40px] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[#637D37]/5"
                            >
                                <div className="p-10">
                                    <div className="flex items-start justify-between mb-10">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-white border border-gray-100 rounded-[32px] overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-700 shadow-sm p-1">
                                                    {seller.profilePicture ? (
                                                        <img src={seller.profilePicture} alt="" className="w-full h-full object-cover rounded-[28px]" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#637D37]/5 flex items-center justify-center rounded-[28px]">
                                                            <Users className="text-[#637D37] w-10 h-10 opacity-40" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 border-4 border-white rounded-2xl flex items-center justify-center shadow-lg">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-[#637D37] transition-colors lowercase first-letter:uppercase">{seller.userName}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Pending Authorization</span>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold italic">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(seller.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                        <div className="p-6 bg-white/50 border border-gray-50 rounded-[28px] space-y-2 group/item hover:bg-white transition-all shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" /> Identity Nexus
                                            </p>
                                            <p className="text-sm font-black text-gray-900 truncate">{seller.email}</p>
                                        </div>
                                        <div className="p-6 bg-white/50 border border-gray-50 rounded-[28px] space-y-2 group/item hover:bg-white transition-all shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5" /> Comms Record
                                            </p>
                                            <p className="text-sm font-black text-gray-900">{seller.phoneNumber || "PENDING_INPUT"}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => handleApproval(seller.id, true)}
                                            disabled={actionLoading === seller.id}
                                            className="flex-[2] py-5 bg-[#637D37] text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#637D37]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {actionLoading === seller.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                            Validate Vendor
                                        </button>
                                        <button
                                            onClick={() => handleApproval(seller.id, false)}
                                            disabled={actionLoading === seller.id}
                                            className="flex-1 py-5 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-sm"
                                        >
                                            {actionLoading === seller.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                                            Decline
                                        </button>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gradient-to-r from-[#637D37] to-[#8eb151] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Footer Status */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[40px] relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-3xl flex items-center justify-center shadow-sm text-emerald-500">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Integrity</p>
                        <p className="text-sm font-bold text-gray-900">All applications subject to multi-layered verification.</p>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/admin')}
                    className="w-full md:w-auto px-10 py-5 bg-gray-900 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    Return to Intelligence Hub
                    <ChevronRight className="w-5 h-5" />
                </button>
            </motion.div>
        </motion.div>
    )
}
