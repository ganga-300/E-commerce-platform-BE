"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import {
    Users,
    Mail,
    Phone,
    Calendar,
    Shield,
    Trash2,
    Search,
    Loader2,
    X,
    MapPin,
    ShoppingBag,
    Star,
    Package,
    ArrowUpRight,
    Filter,
    Activity,
    UserCheck,
    UserMinus,
    ExternalLink
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

export default function AdminUsers() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [error, setError] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)

    useEffect(() => {
        if (!authLoading) {
            const userRole = user?.role?.toUpperCase();
            if (!user || userRole !== 'ADMIN') {
                router.push('/')
                return
            }
            fetchUsers()
        }
    }, [user, authLoading])

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users?cb=${Date.now()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Failed to sync platform intelligence")
            const data = await res.json()
            setUsers(data.users || [])
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserDetails = async (userId) => {
        setModalLoading(true)
        setIsModalOpen(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            setSelectedUser(data)
        } catch (err) {
            console.error(err)
        } finally {
            setModalLoading(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <Users className="w-6 h-6 text-[#637D37] animate-pulse" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Scanning Platform Identities</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
            <div className="text-center p-12 bg-white rounded-[40px] border border-red-100 shadow-xl max-w-md">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <X className="text-red-500 w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Sync Error</h2>
                <p className="text-gray-500 mb-8 font-medium">{error}</p>
                <button
                    onClick={fetchUsers}
                    className="w-full py-4 bg-[#637D37] text-white rounded-2xl font-black shadow-lg shadow-[#637D37]/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Retry Connection
                </button>
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
                        <span className="w-4 h-px bg-[#637D37]"></span> IDENTITY REPOSITORY
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">
                        User <span className="text-[#637D37]">Registry</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#637D37] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, email or ID..."
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
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-50/50">
                                <th className="px-6 py-6 pb-8">Identity Vector</th>
                                <th className="px-6 py-6 pb-8">Nexus Details</th>
                                <th className="px-6 py-6 pb-8">Privilege</th>
                                <th className="px-6 py-6 pb-8">Auth State</th>
                                <th className="px-6 py-6 pb-8">Operational Index</th>
                                <th className="px-6 py-6 pb-8 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td onClick={() => fetchUserDetails(u.id)} className="px-6 py-6 whitespace-nowrap cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-[#637D37]/5 border border-[#637D37]/10 overflow-hidden shadow-inner group-hover:border-[#637D37]/30 transition-all">
                                                    {u.profilePicture ? (
                                                        <img src={u.profilePicture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#637D37] font-black text-xs">
                                                            {u.userName.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white shadow-sm ${u.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900 group-hover:text-[#637D37] transition-colors">{u.userName}</div>
                                                <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">UID-{u.id.slice(-8).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-600">
                                                <Mail className="w-3.5 h-3.5 text-gray-300" />
                                                {u.email}
                                            </div>
                                            {u.phoneNumber && (
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                                                    <Phone className="w-3.5 h-3.5 text-gray-300" />
                                                    {u.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                            u.role === 'SELLER' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-gray-50 text-gray-500 border-gray-100'
                                            }`}>
                                            {u.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${u.isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {u.isApproved ? <UserCheck className="w-3 h-3" /> : <Activity className="w-3 h-3 animate-pulse" />}
                                            {u.isApproved ? 'Verified' : 'Pending'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-xs font-black text-gray-900">{u._count?.orders || 0} Transactions</div>
                                            {u.role === 'SELLER' && (
                                                <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                                                    {u._count?.products || 0} Assets Deployed
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => fetchUserDetails(u.id)}
                                                className="w-10 h-10 bg-white border border-gray-100 rounded-[14px] inline-flex items-center justify-center text-gray-400 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm"
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-[14px] inline-flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                                                <UserMinus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-lg font-black text-gray-900 mb-2">No results found</p>
                            <p className="text-sm font-medium text-gray-400">Try adjusting your search for broader results.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Detailed Intelligence Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[48px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 relative z-10 flex flex-col"
                        >
                            {modalLoading ? (
                                <div className="p-32 flex flex-col items-center gap-6">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-12 h-12 border-2 border-gray-100 border-t-[#637D37] rounded-full"
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Deciphering Secure Profile</p>
                                </div>
                            ) : selectedUser ? (
                                <>
                                    {/* Modal Header */}
                                    <div className="p-10 pb-6 flex items-start justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-[32px] bg-white border border-gray-100 p-1 shadow-lg ring-8 ring-gray-50/50">
                                                <div className="w-full h-full rounded-[28px] bg-[#637D37]/10 flex items-center justify-center overflow-hidden">
                                                    {selectedUser.profilePicture ? (
                                                        <img src={selectedUser.profilePicture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Users className="w-10 h-10 text-[#637D37]" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedUser.userName}</h2>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-[#637D37]/5 text-[#637D37] text-[9px] font-black rounded-full uppercase tracking-widest border border-[#637D37]/10">{selectedUser.role}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 tracking-tight">{selectedUser.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 transition-all border border-transparent hover:border-gray-200"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Modal Scrollable Body */}
                                    <div className="flex-1 overflow-y-auto p-10 pt-4 space-y-10">
                                        {/* Dynamic Performance Matrix */}
                                        <div className="grid grid-cols-3 gap-6">
                                            <PerformanceMetric label="Transactions" value={selectedUser._count?.orders || 0} icon={<ShoppingBag className="w-4 h-4" />} />
                                            <PerformanceMetric label="Inventory" value={selectedUser._count?.products || 0} icon={<Package className="w-4 h-4" />} />
                                            <PerformanceMetric label="Reviews" value={selectedUser._count?.reviews || 0} icon={<Star className="w-4 h-4" />} />
                                        </div>

                                        {/* Contact Schema */}
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#637D37]" /> Nexus Contact Coordinates
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[32px] group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#637D37] transition-colors">
                                                            <Mail className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated Email</p>
                                                            <p className="text-sm font-black text-gray-900 truncate">{selectedUser.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[32px] group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#637D37] transition-colors">
                                                            <Phone className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Encrypted Mobile</p>
                                                            <p className="text-sm font-black text-gray-900">{selectedUser.phoneNumber || "PENDING_INPUT"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery Vectors (Addresses) */}
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Geographical Logistics Points
                                            </h3>
                                            {selectedUser.addresses?.length > 0 ? (
                                                <div className="space-y-4">
                                                    {selectedUser.addresses.map(addr => (
                                                        <div key={addr.id} className="p-8 bg-white border border-gray-100 rounded-[40px] relative overflow-hidden group hover:border-blue-500/20 transition-all shadow-sm">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="flex items-start gap-6 relative z-10">
                                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500 border border-gray-100 group-hover:bg-blue-50 transition-colors">
                                                                    <MapPin className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 space-y-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{addr.title}</span>
                                                                        {addr.isDefault && <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Primary Destination</span>}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-black text-gray-900 mb-1">{addr.name}</p>
                                                                        <p className="text-xs font-bold text-gray-400 italic leading-relaxed">{addr.address}, {addr.city}, {addr.state} - {addr.zip}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-12 border-2 border-dashed border-gray-200 rounded-[40px] text-center">
                                                    <p className="text-sm font-black text-gray-300 italic">No logistics vectors defined.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Modal Sticky Footer */}
                                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center gap-4">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-5 bg-gray-900 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            De-synchronize Session
                                        </button>
                                        <button className="w-16 h-16 bg-white border border-gray-200 rounded-[28px] flex items-center justify-center text-gray-400 hover:text-[#637D37] hover:border-[#637D37]/20 transition-all shadow-sm">
                                            <ExternalLink className="w-6 h-6" />
                                        </button>
                                    </div>
                                </>
                            ) : null}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function PerformanceMetric({ label, value, icon }) {
    return (
        <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-[32px] text-center group hover:bg-white hover:border-[#637D37]/20 hover:shadow-xl hover:shadow-[#637D37]/5 transition-all duration-500">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:text-[#637D37] shadow-sm transition-colors border border-gray-50 group-hover:border-[#637D37]/10">
                {icon}
            </div>
            <div className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums mb-1">{value}</div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#637D37] transition-colors">{label}</div>
        </div>
    )
}
