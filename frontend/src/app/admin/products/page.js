"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import { Package, Trash2, Search, Loader2, Star, AlertCircle } from "lucide-react"

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/products`, {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#637D37] w-12 h-12" />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Product Moderation</h1>
                        <p className="text-gray-500 font-medium">Manage and moderate all listed products.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
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
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Seller</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price/Stock</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Stats</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-gray-900 truncate max-w-[200px]">{p.name}</div>
                                                    <div className="text-xs text-gray-400 font-mono">{p.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{p.seller?.userName || "Anonymous"}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{p.seller?.email}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="font-black text-[#637D37]">₹{p.price}</div>
                                            <div className={`text-xs font-bold ${p.stock < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                                                {p.stock} in stock
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-bold text-gray-900">{p.averageRating?.toFixed(1) || "0.0"}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                                                {p.reviewCount} Reviews
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                disabled={deleting === p.id}
                                                className="p-3 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                                            >
                                                {deleting === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
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
