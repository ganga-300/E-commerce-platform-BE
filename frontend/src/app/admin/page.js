"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import {
    TrendingUp,
    Users,
    Package,
    DollarSign,
    Loader2,
    ArrowUpRight,
    ShoppingBag,
    Calendar,
    Clock,
    ShieldCheck,
    ArrowRight,
    Search,
    Bell,
    ChevronRight,
    LayoutDashboard,
    XCircle,
    LogOut
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    const { user, token, logout, loading: authLoading } = useAuth()
    const router = useRouter()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!authLoading) {
            const userRole = user?.role?.toUpperCase();
            if (!user || userRole !== 'ADMIN') {
                router.push('/')
                return
            }
            fetchDashboardData()
        }
    }, [user, authLoading, router])

    const fetchDashboardData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/stats`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                let errorMsg = `Server error (${res.status})`;
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) {
                    errorMsg = "Critical fetch error";
                }
                throw new Error(errorMsg);
            }

            const dashboardData = await res.json();
            setData(dashboardData)
        } catch (err) {
            console.error("Dashboard Fetch Error:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#637D37]/20 border-t-[#637D37] rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
                <div className="text-center p-12 bg-white rounded-[40px] border border-red-100 shadow-xl max-w-md animate-in zoom-in">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <XCircle className="text-red-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">System Error</h2>
                    <p className="text-gray-500 mb-8 font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-[#637D37] text-white rounded-2xl font-black shadow-lg shadow-[#637D37]/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Re-initialize Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const { stats, recentOrders, topProducts } = data

    return (
        <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans">
            {/* Soft Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#637D37]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative max-w-[1600px] mx-auto px-6 py-10 lg:py-16">
                {/* Header Area */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#637D37] font-black text-xs uppercase tracking-[0.3em]">
                            <LayoutDashboard className="w-4 h-4" /> Management Console
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900">
                            Admin Overview
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search analytics..."
                                className="pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 transition-all w-80 shadow-sm"
                            />
                        </div>
                        <button className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all relative shadow-sm">
                            <Bell className="w-5 h-5 text-gray-400" />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-[#637D37] rounded-full border-2 border-white"></div>
                        </button>
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-2 p-3 bg-white border border-red-50 rounded-2xl hover:bg-red-50 text-red-500 transition-all shadow-sm font-bold text-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Log Out</span>
                        </button>
                    </div>
                </header>

                {/* Notification Banner - Premium Light Version */}
                {data.stats.pendingSellers > 0 && (
                    <div className="mb-12 bg-white rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#637D37]/5 border border-[#637D37]/10 animate-in zoom-in duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#637D37]/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="bg-[#637D37]/10 p-5 rounded-[24px] border border-[#637D37]/10">
                                <ShieldCheck className="w-8 h-8 text-[#637D37] animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 mb-1">Seller Applications Pending</h2>
                                <p className="text-gray-500 font-medium text-lg">
                                    You have <span className="text-[#637D37] font-black">{data.stats.pendingSellers} incoming vendors</span> awaiting your authorization.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/admin/approvals')}
                            className="w-full md:w-auto px-10 py-4 bg-[#637D37] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#637D37]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group relative z-10"
                        >
                            Review Applications
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <StatsCard
                        icon={<DollarSign className="w-6 h-6" />}
                        title="Aggregated Revenue"
                        value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                        trend="+12.5%"
                        color="green"
                    />
                    <StatsCard
                        icon={<ShoppingBag className="w-6 h-6" />}
                        title="Transaction Volume"
                        value={stats?.totalOrders || 0}
                        trend="+8.2%"
                        color="blue"
                    />
                    <StatsCard
                        icon={<Users className="w-6 h-6" />}
                        title="Platform Membership"
                        value={stats?.totalUsers || 0}
                        trend="+15.3%"
                        color="purple"
                    />
                    <StatsCard
                        icon={<Package className="w-6 h-6" />}
                        title="Active Inventory"
                        value={stats?.totalProducts || 0}
                        trend="+4.7%"
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Recent Orders - Light Premium Box */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="p-8 lg:p-10 flex justify-between items-center border-b border-gray-50">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-1">Recent Activity</h2>
                                <p className="text-sm font-medium text-gray-400 italic">Latest platform transactions.</p>
                            </div>
                            <button className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-xs font-black text-gray-500 transition-all">
                                View Full Log
                            </button>
                        </div>
                        <div className="overflow-x-auto p-4 lg:p-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="px-6 py-4">Reference</th>
                                        <th className="px-6 py-4">Identity</th>
                                        <th className="px-6 py-4">Value</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map(order => (
                                            <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className="text-sm font-black text-gray-300 group-hover:text-[#637D37] transition-colors">#{order.id.slice(-6).toUpperCase()}</span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#637D37]/10 rounded-xl flex items-center justify-center text-[#637D37] font-black text-xs border border-[#637D37]/10">
                                                            {order.user.userName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-gray-900">{order.user.userName}</div>
                                                            <div className="text-[10px] text-gray-400 font-medium">{order.user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className="text-sm font-black text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-right">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-20 text-center text-gray-400 font-bold italic">No logging data available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white rounded-[40px] border border-gray-100 p-8 lg:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <div className="mb-10 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Prime Assets</h2>
                            <TrendingUp className="text-[#637D37] w-5 h-5" />
                        </div>
                        <div className="space-y-8">
                            {topProducts.length > 0 ? (
                                topProducts.map((product, index) => (
                                    <div key={product.id} className="group flex items-center gap-5 relative">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center font-black text-xl text-gray-200 group-hover:text-[#637D37] group-hover:bg-[#637D37]/5 transition-all duration-500">
                                                {index + 1}
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#637D37] rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-black text-gray-900 group-hover:text-[#637D37] transition-colors truncate">{product.name}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{product.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-[#637D37]">{product.totalSold}</p>
                                            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Units Sold</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-400 font-bold italic">No performance benchmarks yet.</div>
                            )}
                        </div>
                        <button className="w-full mt-12 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl text-xs font-black text-gray-400 hover:text-gray-900 transition-all flex items-center justify-center gap-2 group">
                            Full Analytics Report
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-from-top { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slide-in-from-bottom { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes zoom-in { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .animate-in {
                    animation: var(--animation-name) duration ease-out;
                }
                .fade-in { --animation-name: fade-in; }
                .slide-in-from-top-4 { --animation-name: slide-in-from-top; }
                .slide-in-from-bottom-4 { --animation-name: slide-in-from-bottom; }
                .slide-in-from-bottom-8 { --animation-name: slide-in-from-bottom; }
                .zoom-in { --animation-name: zoom-in; }
                
                .delay-200 { animation-delay: 200ms; }
                .fill-mode-both { animation-fill-mode: both; }
            `}</style>
        </div>
    )
}

function StatsCard({ icon, title, value, trend, color }) {
    const colorMap = {
        green: "text-[#637D37] bg-[#637D37]/10 border-[#637D37]/10",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
    }

    return (
        <div className="group relative p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-[#637D37]/20 transition-all duration-500 overflow-hidden">
            <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl border ${colorMap[color]} group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                {trend && (
                    <span className="flex items-center text-[10px] font-black text-[#637D37] bg-[#637D37]/10 px-3 py-1.5 rounded-full border border-[#637D37]/10">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {trend}
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
                <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{value}</p>
            </div>
        </div>
    )
}

const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
        case 'delivered':
        case 'completed':
            return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'pending':
        case 'processing':
            return 'bg-amber-50 text-amber-600 border-amber-100'
        case 'shipped':
            return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'cancelled':
            return 'bg-red-50 text-red-600 border-red-100'
        default:
            return 'bg-gray-50 text-gray-400 border-gray-100'
    }
}
