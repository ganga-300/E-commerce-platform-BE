"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { PlusCircle, Loader2 } from "lucide-react"

export default function SellerDashboard() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [products, setProducts] = useState([])
    const [fetching, setFetching] = useState(true)

    const fetchMyProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`)
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || "Could not load products")
            }
            const data = await res.json()
            setProducts(data)
        } catch (err) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        fetchMyProducts()
    }, [])

    // Form State
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [sku, setSku] = useState("")
    const [family, setFamily] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    useEffect(() => {
        if (!authLoading) {
            const userRole = user?.role?.toUpperCase();

            if (!user) {
                router.push("/login")
            } else if (userRole !== "SELLER") {
                router.push("/")
            }
        }
    }, [user, authLoading, router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    description,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    sku,
                    family,
                    imageUrl
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to create product")
            }

            setMessage("Product created successfully!")
            // Reset form
            setName("")
            setDescription("")
            setPrice("")
            setStock("")
            setSku("")
            setFamily("")
            setImageUrl("")
            fetchMyProducts() // Refresh list

        } catch (err) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const userRole = user?.role?.toUpperCase();
    if (authLoading || !user || userRole !== "SELLER") return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#637D37]"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <PlusCircle className="w-8 h-8 text-[#637D37]" />
                    Add New Product
                </h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {message && (
                        <div className={`p-4 rounded-lg mb-6 ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Unique ID)</label>
                                <input
                                    type="text"
                                    required
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category / Family</label>
                                <input
                                    type="text"
                                    required
                                    value={family}
                                    onChange={(e) => setFamily(e.target.value)}
                                    placeholder="e.g., Stationery"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                required
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#637D37] hover:bg-[#52682d] text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-[#637D37]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Create Product"}
                        </button>
                    </form>
                </div>
            </div>

            {/* My Listings */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Listings</h2>
                {fetching ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-[#637D37]" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300 text-gray-500">
                        No products listed yet. Add your first product above!
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">SKU</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Price</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">{p.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{p.sku}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#637D37]">₹{p.price}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{p.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
