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
    ArrowRight,
    MapPin,
    ExternalLink,
    Search
} from "lucide-react"
import Link from "next/link"

export default function AdminApprovalsPage() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [pendingSellers, setPendingSellers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== "ADMIN") {
                router.push("/")
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

    if (authLoading || !user || user.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#637D37]/20 border-t-[#637D37] rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans">
            {/* Soft Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#637D37]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
                {/* Header */}
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-full text-sm font-bold text-gray-400 hover:text-[#637D37] transition-all group shadow-sm">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-gray-900">
                                Seller Approvals
                            </h1>
                            <p className="text-xl text-gray-400 font-medium max-w-xl">
                                Verify and authorize pending vendor applications for your premium marketplace.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#637D37]/10 rounded-2xl flex items-center justify-center border border-[#637D37]/10">
                                <Users className="text-[#637D37] w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#637D37] uppercase tracking-[0.2em]">Queue Status</p>
                                <p className="text-3xl font-black tabular-nums text-gray-900">{pendingSellers.length}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Status Message */}
                {message && (
                    <div className={`mb-12 p-6 rounded-[32px] border flex items-center gap-4 animate-in zoom-in duration-300 shadow-sm ${message.includes("Error") ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${message.includes("Error") ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                            {message.includes("Error") ? <XCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <p className="font-bold text-lg">{message}</p>
                    </div>
                )}

                {/* Main Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <div className="w-12 h-12 border-4 border-[#637D37]/20 border-t-[#637D37] rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-bold animate-pulse">Fetching Verified Records...</p>
                    </div>
                ) : pendingSellers.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-[40px] p-20 text-center shadow-sm animate-in zoom-in duration-1000">
                        <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                            <CheckCircle className="text-emerald-500 w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">You're All Caught Up</h2>
                        <p className="text-gray-400 text-lg max-w-md mx-auto font-medium">There are currently no seller applications requiring your attention. The queue is empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {pendingSellers.map((seller, idx) => (
                            <div
                                key={seller.id}
                                style={{ animationDelay: `${idx * 150}ms` }}
                                className="group bg-white border border-gray-100 hover:border-[#637D37]/30 rounded-[32px] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-[#637D37]/5 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                            >
                                <div className="p-8 lg:p-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-20 h-20 bg-gray-50 border border-gray-100 rounded-[24px] overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                {seller.profilePicture ? (
                                                    <img src={seller.profilePicture} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#637D37]/5 flex items-center justify-center">
                                                        <Users className="text-[#637D37] w-8 h-8 opacity-40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-[#637D37] transition-colors">{seller.userName}</h3>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100 w-fit shadow-sm">
                                                    <Clock className="w-3 h-3" /> Application Pending
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed Up</p>
                                            <div className="flex items-center justify-end gap-1.5 text-gray-500 font-bold text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(seller.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1 group/item hover:bg-white transition-all shadow-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Mail className="w-3 h-3" /> Email Address
                                            </p>
                                            <p className="text-sm font-bold text-gray-700 truncate">{seller.email}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1 group/item hover:bg-white transition-all shadow-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Phone className="w-3 h-3" /> Contact Number
                                            </p>
                                            <p className="text-sm font-bold text-gray-700">{seller.phoneNumber || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => handleApproval(seller.id, true)}
                                            disabled={actionLoading === seller.id}
                                            className="flex-[2] py-4 bg-[#637D37] hover:bg-[#52682d] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#637D37]/20 hover:shadow-[#637D37]/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {actionLoading === seller.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                            Authorize Seller
                                        </button>
                                        <button
                                            onClick={() => handleApproval(seller.id, false)}
                                            disabled={actionLoading === seller.id}
                                            className="flex-1 py-4 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 border border-gray-100 hover:border-red-100 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            {actionLoading === seller.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                            Decline
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Accent */}
                                <div className="h-1.5 w-full bg-[#637D37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-from-top { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slide-in-from-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .animate-in {
                    animation: var(--animation-name) duration ease-out;
                }
                .fade-in { --animation-name: fade-in; }
                .slide-in-from-top-8 { --animation-name: slide-in-from-top; }
                .slide-in-from-bottom-8 { --animation-name: slide-in-from-bottom; }
                .zoom-in { --animation-name: zoom-in; }
                
                .fill-mode-both { animation-fill-mode: both; }
            `}</style>
        </div>
    )
}
