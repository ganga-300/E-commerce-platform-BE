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
    ArrowDownRight,
    Activity,
    Target
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-20">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-[3px] border-[#637D37]/10 border-t-[#637D37] rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-[#637D37] animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Intelligence</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
                <div className="text-center p-12 bg-white rounded-[40px] border border-red-100 shadow-xl max-w-md">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <XCircle className="text-red-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Sync Interrupted</h2>
                    <p className="text-gray-500 mb-8 font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-[#637D37] text-white rounded-2xl font-black shadow-lg shadow-[#637D37]/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        )
    }

    const { stats, recentOrders, topProducts } = data

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
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#637D37] font-black text-[10px] uppercase tracking-[0.4em]">
                        <span className="w-4 h-px bg-[#637D37]"></span> SYSTEM OVERVIEW
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">
                        Platform <span className="text-[#637D37]">Intelligence</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white/70 backdrop-blur-xl border border-gray-100 p-2 rounded-2xl flex items-center gap-4 px-4 shadow-sm">
                        <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Clock className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Global Timestamp</span>
                            <span className="text-xs font-black text-gray-900">Feb 04, 2026 • 15:43</span>
                        </div>
                    </div>
                    <button className="w-12 h-12 bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Critical Alerts Banner */}
            {data.stats.pendingSellers > 0 && (
                <motion.div
                    variants={itemVariants}
                    className="group relative bg-[#637D37] rounded-[40px] p-8 lg:p-10 overflow-hidden shadow-2xl shadow-[#637D37]/20"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8 text-white text-center md:text-left">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[28px] border border-white/20 flex items-center justify-center shadow-inner">
                                <ShieldCheck className="w-10 h-10 text-white animate-bounce" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight mb-2">Pending Authorizations</h2>
                                <p className="text-white/70 font-bold text-lg max-w-md leading-relaxed">
                                    There are <span className="text-white">{data.stats.pendingSellers} premium vendors</span> awaiting validation for marketplace inclusion.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/approvals"
                            className="w-full md:w-auto px-12 py-5 bg-white text-[#637D37] rounded-3xl font-black text-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-xl"
                        >
                            Authorize Requests
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            )}

            {/* Main Metrics Cloud */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <IntelligenceCard
                    title="Gross Volume"
                    value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                    trend="+12.5%"
                    icon={<DollarSign className="w-6 h-6" />}
                    color="green"
                    href="/admin/orders"
                />
                <IntelligenceCard
                    title="Active Entities"
                    value={stats?.totalUsers || 0}
                    trend="+8.2%"
                    icon={<Users className="w-6 h-6" />}
                    color="blue"
                    href="/admin/users"
                />
                <IntelligenceCard
                    title="Inventory Index"
                    value={stats?.totalProducts || 0}
                    trend="+15.3%"
                    icon={<Package className="w-6 h-6" />}
                    color="purple"
                    href="/admin/products"
                />
                <IntelligenceCard
                    title="Order Velocity"
                    value={stats?.totalOrders || 0}
                    trend="+4.7%"
                    icon={<ShoppingBag className="w-6 h-6" />}
                    color="orange"
                    href="/admin/orders"
                />
            </motion.div>

            {/* Performance Analytics Floor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Revenue Momentum Chart */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white/70 backdrop-blur-2xl border border-gray-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Revenue Momentum</h2>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">7-Day Financial Trajectory</p>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
                            <button className="px-6 py-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-[10px] font-black text-[#637D37] uppercase tracking-widest">Gross</button>
                            <button className="px-6 py-2.5 text-[10px] font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Profit</button>
                        </div>
                    </div>

                    <div className="h-[400px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data.salesData.map(d => ({
                                    ...d,
                                    name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
                                    val: d.revenue
                                }))}
                            >
                                <defs>
                                    <linearGradient id="momentumGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#637D37" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#637D37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                                    tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#637D37', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: '1px solid #E2E8F0',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '20px',
                                        background: 'rgba(255,255,255,0.9)',
                                        backdropBlur: '12px'
                                    }}
                                    itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                                    labelStyle={{ fontWeight: 900, marginBottom: '8px', color: '#111827' }}
                                    formatter={(v) => [`₹${v.toLocaleString()}`, 'VOLUME']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="val"
                                    stroke="#637D37"
                                    strokeWidth={6}
                                    fillOpacity={1}
                                    fill="url(#momentumGrad)"
                                    animationDuration={2000}
                                    dot={{ fill: '#637D37', strokeWidth: 4, r: 6, stroke: '#fff' }}
                                    activeDot={{ r: 10, fill: '#637D37', stroke: '#fff', strokeWidth: 4 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Assets */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/70 backdrop-blur-2xl border border-gray-100 rounded-[40px] p-10 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Prime Assets</h2>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Marketplace Leaders</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <Target className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {topProducts.map((p, idx) => (
                            <div key={p.id} className="group flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center font-black text-lg text-gray-300 group-hover:bg-[#637D37] group-hover:text-white group-hover:border-[#637D37] transition-all duration-500 shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white scale-0 group-hover:scale-100 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-gray-900 text-sm group-hover:text-[#637D37] transition-colors truncate">{p.name}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{p.sku || "PRO-IDX-04"}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-[#637D37]">{p.totalSold}</div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Units</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-12 py-5 bg-gray-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-900/10 hover:scale-[1.02] active:scale-95 transition-all">
                        Full Product Registry
                    </button>
                </motion.div>

                {/* Recent Event Feed */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-3 bg-white/70 backdrop-blur-2xl border border-gray-100 rounded-[40px] overflow-hidden shadow-sm"
                >
                    <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Intelligence Feed</h2>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Real-time Transaction Logs</p>
                        </div>
                        <button className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-600 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm uppercase tracking-widest">Export Dataset</button>
                    </div>

                    <div className="overflow-x-auto p-8">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-left">
                                    <th className="px-6 py-6 pb-10">Vector ID</th>
                                    <th className="px-6 py-6 pb-10">Identity</th>
                                    <th className="px-6 py-6 pb-10">Valuation</th>
                                    <th className="px-6 py-6 pb-10">Current Status</th>
                                    <th className="px-6 py-6 pb-10 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-8">
                                            <span className="text-sm font-black text-gray-200 group-hover:text-[#637D37] transition-colors">#{order.id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#637D37]/5 border border-[#637D37]/10 flex items-center justify-center text-[#637D37] font-black text-sm group-hover:bg-[#637D37] group-hover:text-white transition-all duration-300">
                                                    {order.user.userName.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900">{order.user.userName}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className="text-sm font-black text-gray-900 tracking-tighter">₹{order.totalAmount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className={`inline-flex px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${getStatusStyle(order.status)} shadow-sm`}>
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-right">
                                            <button
                                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                                className="w-12 h-12 bg-white border border-gray-100 rounded-2xl inline-flex items-center justify-center text-gray-400 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm"
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

function IntelligenceCard({ title, value, trend, icon, color, href }) {
    const colorMap = {
        green: "text-[#637D37] bg-[#637D37]/5 hover:bg-[#637D37]/10 border-[#637D37]/10",
        blue: "text-blue-600 bg-blue-50/50 hover:bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50/50 hover:bg-purple-50 border-purple-100",
        orange: "text-orange-600 bg-orange-50/50 hover:bg-orange-50 border-orange-100",
    }

    const iconBg = {
        green: "bg-[#637D37]/10",
        blue: "bg-blue-100",
        purple: "bg-purple-100",
        orange: "bg-orange-100",
    }

    return (
        <Link href={href} className="block group h-full">
            <div className={`relative h-full p-8 bg-white/70 backdrop-blur-2xl rounded-[40px] border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 overflow-hidden`}>
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className={`p-5 rounded-[24px] ${iconBg[color]} transition-transform duration-500 group-hover:scale-110 shadow-inner`}>
                        <div className={color.startsWith('#') ? "" : colorMap[color].split(' ')[0]}>
                            {icon}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all duration-500 ${colorMap[color].split(' hover')[0]} shadow-sm`}>
                            {trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                            {trend}
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Monitor <ChevronRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>

                <div className="space-y-1 relative z-10">
                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">{title}</h3>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{value}</p>
                </div>

                {/* Abstract Background Design */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 group-hover:bg-[#637D37]/5 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#637D37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_-4px_10px_rgba(99,125,55,0.3)]" />
            </div>
        </Link>
    )
}

const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
        case 'delivered':
        case 'completed':
            return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/30'
        case 'pending':
        case 'processing':
            return 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/30'
        case 'shipped':
            return 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/30'
        case 'cancelled':
            return 'bg-red-50 text-red-600 border-red-100 shadow-red-100/30'
        default:
            return 'bg-gray-50 text-gray-400 border-gray-100'
    }
}
