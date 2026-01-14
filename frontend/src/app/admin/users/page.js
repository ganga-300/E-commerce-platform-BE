"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import { Users, Mail, Phone, Calendar, Shield, Trash2, Search, Loader2 } from "lucide-react"

export default function AdminUsers() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

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
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            setUsers(data.users || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h1 className="text-3xl font-black text-gray-900">User Management</h1>
                        <p className="text-gray-500 font-medium">Manage and monitor all platform users.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
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
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#637D37]/10 rounded-full flex items-center justify-center">
                                                    {u.profilePicture ? (
                                                        <img src={u.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <Users className="w-5 h-5 text-[#637D37]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{u.userName}</div>
                                                    <div className="text-xs text-gray-400">ID: {u.id.slice(-8).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {u.email}
                                                </div>
                                                {u.phoneNumber && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {u.phoneNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                    u.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-300" />
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
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
