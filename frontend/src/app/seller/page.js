"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { PlusCircle, Loader2, Upload, Edit2, Trash2, X, Clock, ShieldCheck, Mail, TrendingUp, DollarSign, Package, LogOut, ShoppingCart, ListChecks, CheckCircle2, Truck, AlertCircle, FileDown } from "lucide-react"
import { generatePackingSlip } from "../../utils/pdfGenerator"
import Script from "next/script"

export default function SellerDashboard() {
    const { user, token, logout, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [products, setProducts] = useState([])
    const [fetching, setFetching] = useState(true)
    const [isApproved, setIsApproved] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [activeTab, setActiveTab] = useState("inventory") // inventory or orders
    const [sellerOrders, setSellerOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(false)
    const [showLowStock, setShowLowStock] = useState(false)

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/seller/analytics`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setAnalytics(data)
            }
        } catch (err) {
            console.error("Error fetching analytics:", err)
        }
    }

    const fetchMyProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products?sellerId=${user?.id}`)
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

    const fetchSellerOrders = async () => {
        setOrdersLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/seller/orders`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setSellerOrders(data)
            }
        } catch (err) {
            console.error("Error fetching orders:", err)
        } finally {
            setOrdersLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/seller/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                setMessage(`Order marked as ${status}`)
                fetchSellerOrders() // Refresh list
            } else {
                const errorData = await res.json()
                setMessage(`Error: ${errorData.message}`)
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`)
        }
    }

    const checkApprovalStatus = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setIsApproved(data.user.isApproved);
                if (data.user.isApproved) {
                    fetchMyProducts();
                    fetchAnalytics();
                }
            }
        } catch (err) {
            console.error("Error checking approval:", err);
            setIsApproved(user.isApproved); // Fallback
        }
    }

    useEffect(() => {
        if (token) {
            checkApprovalStatus()
            fetchSellerOrders()
        }
    }, [token])

    // Form State
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [sku, setSku] = useState("")
    const [family, setFamily] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [galleryImages, setGalleryImages] = useState([])

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

    const handleUpload = () => {
        if (!window.cloudinary) {
            console.error("Cloudinary script not loaded");
            alert("Upload widget is still loading... please refresh or wait a moment.");
            return;
        }

        // NOTE: For a real app, you should use your own Cloudinary Cloud Name and Upload Preset
        // You can get them for free at https://cloudinary.com/
        window.cloudinary.openUploadWidget(
            {
                cloudName: "da8wt2pys",
                uploadPreset: "btfgadxx",
                sources: ["local", "url", "camera", "google_drive"],
                multiple: false,
                cropping: true,
                defaultSource: "local"
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Error:", error);
                    alert("Upload failed. Please check your internet or try again.");
                }

                // CRITICAL UI FIX: Ensure body scroll is restored
                if (result && (result.event === "success" || result.event === "close")) {
                    document.body.style.overflow = "auto";
                    document.body.style.pointerEvents = "auto";
                }

                if (!error && result && result.event === "success") {
                    console.log("Upload Success:", result.info.secure_url);
                    setImageUrl(result.info.secure_url);
                    setMessage("Image uploaded successfully!");
                }
            }
        ).open();
    };

    const handleGalleryUpload = () => {
        if (!window.cloudinary) return;

        window.cloudinary.openUploadWidget(
            {
                cloudName: "da8wt2pys",
                uploadPreset: "btfgadxx",
                sources: ["local", "url", "camera"],
                multiple: true,
                maxFiles: 5,
                defaultSource: "local"
            },
            (error, result) => {
                if (result && (result.event === "success" || result.event === "close")) {
                    document.body.style.overflow = "auto";
                    document.body.style.pointerEvents = "auto";
                }

                if (!error && result && result.event === "success") {
                    setGalleryImages(prev => [...prev, result.info.secure_url]);
                }
            }
        ).open();
    };

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
                    imageUrl,
                    images: galleryImages
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
            setGalleryImages([])
            fetchMyProducts() // Refresh list

        } catch (err) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setName(product.name)
        setDescription(product.description)
        setPrice(product.price.toString())
        setStock(product.stock.toString())
        setSku(product.sku)
        setFamily(product.family || "")
        setImageUrl(product.imageUrl)
        setGalleryImages(product.images || [])
        setShowEditModal(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/${editingProduct.id}`, {
                method: "PUT",
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
                    imageUrl,
                    images: galleryImages
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to update product")
            }

            setMessage("Product updated successfully!")
            setShowEditModal(false)
            setEditingProduct(null)
            // Reset form
            setName("")
            setDescription("")
            setPrice("")
            setStock("")
            setSku("")
            setFamily("")
            setImageUrl("")
            setGalleryImages([])
            fetchMyProducts()

        } catch (err) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/${productToDelete.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || "Failed to delete product")
            }

            setMessage("Product deleted successfully!")
            setShowDeleteConfirm(false)
            setProductToDelete(null)
            fetchMyProducts()

        } catch (err) {
            setMessage(`Error: ${err.message}`)
        }
    }

    const userRole = user?.role?.toUpperCase();
    if (authLoading || !user || userRole !== "SELLER" || isApproved === null) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#637D37]"></div>
        </div>
    )

    if (isApproved === false) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-[#637D37] p-10 text-center text-white">
                        <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                            <Clock className="w-10 h-10 animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-black mb-2">Application Under Review</h1>
                        <p className="opacity-90 font-medium">Thank you for joining our marketplace!</p>
                    </div>
                    <div className="p-10 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">What happens next?</h2>
                            <div className="grid gap-4">
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Admin Verification</h3>
                                        <p className="text-sm text-gray-500">Our team is currently reviewing your profile and business details to ensure a safe environment for buyers.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Wait for Approval</h3>
                                        <p className="text-sm text-gray-500">Once your account is approved, you'll receive full access to list products and manage orders.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 py-4 bg-[#637D37] text-white rounded-2xl font-bold shadow-lg shadow-[#637D37]/20 hover:scale-105 transition-all"
                            >
                                Check Status Again
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="flex-1 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'shipped':
            case 'completed':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            case 'paid':
            case 'processing':
                return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'pending':
                return 'bg-amber-50 text-amber-600 border-amber-100'
            case 'cancelled':
                return 'bg-red-50 text-red-600 border-red-100'
            default:
                return 'bg-gray-50 text-gray-400 border-gray-100'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
            <div className="max-w-6xl mx-auto">
                {/* Analytics Section stays at top */}
                {analytics && (
                    <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sales Overview</h1>
                                <p className="text-gray-500 font-medium">Performance for {analytics.period.month} {analytics.period.year}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Live Data
                                </div>
                                <button
                                    onClick={() => logout()}
                                    className="px-4 py-2 bg-white text-red-500 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#637D37]/10 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:bg-[#637D37]/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4 text-[#637D37]">
                                        <div className="p-3 bg-[#637D37]/10 rounded-xl">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wider">Total Revenue</span>
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 tracking-tighter">
                                        ₹{analytics.summary.totalRevenue.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:bg-blue-100 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                                        <div className="p-3 bg-blue-50 rounded-xl">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wider">Units Sold</span>
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 tracking-tighter">
                                        {analytics.summary.totalUnits}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Performance Table */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <h2 className="text-xl font-bold text-gray-900">Product Performance</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Product</th>
                                            <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">SKU</th>
                                            <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Units Sold</th>
                                            <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {analytics.products.length > 0 ? (
                                            analytics.products.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6 font-bold text-gray-900">{product.name}</td>
                                                    <td className="px-8 py-6 text-sm font-medium text-gray-500">{product.sku}</td>
                                                    <td className="px-8 py-6 text-sm font-bold text-gray-900 text-right">{product.unitsSold}</td>
                                                    <td className="px-8 py-6 text-sm font-bold text-[#637D37] text-right">₹{product.revenue.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-12 text-center text-gray-400 font-medium italic">
                                                    No sales recorded this month yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-12 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("inventory")}
                        className={`pb-4 px-2 font-black text-sm uppercase tracking-widest transition-all relative ${activeTab === "inventory" ? "text-[#637D37]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Inventory
                        </div>
                        {activeTab === "inventory" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#637D37] rounded-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`pb-4 px-2 font-black text-sm uppercase tracking-widest transition-all relative ${activeTab === "orders" ? "text-[#637D37]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Manage Orders
                            {sellerOrders.length > 0 && (
                                <span className="bg-[#637D37] text-white text-[10px] px-2 py-0.5 rounded-full ring-2 ring-white">
                                    {sellerOrders.filter(o => o.status === 'Paid' || o.status === 'Pending').length}
                                </span>
                            )}
                        </div>
                        {activeTab === "orders" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#637D37] rounded-full"></div>}
                    </button>
                </div>

                {message && (activeTab === "inventory") && (
                    <div className={`p-4 rounded-xl mb-6 font-bold shadow-sm border ${message.includes("Error") ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
                        {message}
                    </div>
                )}

                {activeTab === "inventory" ? (
                    <div className="space-y-12">
                        <section>
                            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <PlusCircle className="w-8 h-8 text-[#637D37]" />
                                Add New Product
                            </h1>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image</label>
                                            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                                {imageUrl ? (
                                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setImageUrl("")}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition h-8 w-8 flex items-center justify-center"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleUpload}
                                                        className="flex flex-col items-center gap-3 text-gray-400 hover:text-[#637D37] transition py-8"
                                                    >
                                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-sm font-bold">Main Product Image</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Max 5)</label>
                                            <div className="grid grid-cols-3 gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 min-h-[160px]">
                                                {galleryImages.map((url, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {galleryImages.length < 5 && (
                                                    <button
                                                        type="button"
                                                        onClick={handleGalleryUpload}
                                                        className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#637D37] border-2 border-dashed border-gray-200 rounded-lg bg-white/50 hover:bg-white transition-all aspect-square"
                                                    >
                                                        <PlusCircle className="w-6 h-6" />
                                                        <span className="text-[10px] font-black uppercase tracking-wider">Add</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
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
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowLowStock(!showLowStock)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border ${showLowStock
                                            ? 'bg-red-50 border-red-200 text-red-600 shadow-sm shadow-red-100'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <AlertCircle className={`w-4 h-4 ${showLowStock ? 'animate-pulse' : ''}`} />
                                        {showLowStock ? "Showing Low Stock" : "Filter Low Stock"}
                                    </button>
                                </div>
                            </div>
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
                                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {products
                                                .filter(p => !showLowStock || p.stock < 5)
                                                .map((p) => (
                                                    <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.stock < 5 ? 'bg-red-50/30' : ''}`}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100">
                                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-gray-900">{p.name}</span>
                                                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{p.family}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono tracking-tight">{p.sku}</td>
                                                        <td className="px-6 py-4 text-sm font-black text-[#637D37]">₹{p.price}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <span className={`text-sm font-black ${p.stock < 5 ? 'text-red-600' : 'text-gray-700'}`}>
                                                                    {p.stock} units
                                                                </span>
                                                                {p.stock < 5 && (
                                                                    <span className="text-[9px] font-black text-red-500 bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-tighter w-fit">
                                                                        Critical
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <button
                                                                onClick={() => handleEdit(p)}
                                                                className="text-blue-600 hover:text-blue-800 mr-3 inline-flex items-center gap-1"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setProductToDelete(p)
                                                                    setShowDeleteConfirm(true)
                                                                }}
                                                                className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                ) : (
                    /* Orders Management Tab */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Fulfillment</h1>
                                <p className="text-gray-500 font-medium italic">Manage status transitions and customer shipping info.</p>
                            </div>
                            <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-black border border-amber-100 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Action Required: {sellerOrders.filter(o => o.status === 'Paid' || o.status === 'Pending').length}
                            </div>
                        </div>

                        {ordersLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-12 h-12 border-4 border-[#637D37]/20 border-t-[#637D37] rounded-full animate-spin"></div>
                            </div>
                        ) : sellerOrders.length === 0 ? (
                            <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <ListChecks className="text-gray-300 w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 mb-1">No orders yet</h2>
                                <p className="text-gray-400 font-medium">When customers buy your items, they'll appear here.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {sellerOrders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                                        <div className="p-8 lg:p-10">
                                            <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black text-white bg-[#637D37] px-3 py-1 rounded-full uppercase tracking-widest">
                                                            Order #{order.id.slice(-6).toUpperCase()}
                                                        </span>
                                                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                                        {order.user.userName}
                                                    </h2>
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium italic">
                                                        <Clock className="w-4 h-4" />
                                                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        onClick={() => generatePackingSlip(order)}
                                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-xs shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                                                    >
                                                        <FileDown className="w-4 h-4" />
                                                        Packing Slip
                                                    </button>
                                                    {order.status === 'Paid' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'Processing')}
                                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                            Mark Processing
                                                        </button>
                                                    )}
                                                    {order.status === 'Processing' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'Shipped')}
                                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Confirm Shipment
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-6">
                                                    <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest">Your Items in this Order</h3>
                                                    <div className="space-y-4">
                                                        {order.orderItems.map((item) => (
                                                            <div key={item.id} className="flex gap-4 items-center bg-gray-50/50 p-4 rounded-3xl border border-gray-50">
                                                                <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 p-1">
                                                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-black text-gray-900">{item.product.name}</h4>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                                                                    <p className="text-sm font-black text-[#637D37]">₹{item.price * item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest">Shipping Destination</h3>
                                                    <div className="p-6 bg-[#637D37]/5 rounded-[32px] border border-[#637D37]/10 space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-gray-900">{order.user.userName}</p>
                                                            <p className="text-xs font-medium text-gray-500 italic">{order.shippingAddress}</p>
                                                            <p className="text-xs font-medium text-gray-500 italic">{order.city}, {order.state} - {order.zip}</p>
                                                        </div>
                                                        <div className="pt-4 border-t border-[#637D37]/10 flex items-center justify-between">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</span>
                                                            <span className="text-xs font-black text-gray-900">{order.phoneNumber}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setEditingProduct(null)
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image</label>
                                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        {imageUrl ? (
                                            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setImageUrl("")}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition h-8 w-8 flex items-center justify-center"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleUpload}
                                                className="flex flex-col items-center gap-3 text-gray-400 hover:text-[#637D37] transition py-8"
                                            >
                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-6 h-6" />
                                                </div>
                                                <span className="text-sm font-bold">Main Image</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery (Max 5)</label>
                                    <div className="grid grid-cols-3 gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 min-h-[160px]">
                                        {galleryImages.map((url, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {galleryImages.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={handleGalleryUpload}
                                                className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#637D37] border-2 border-dashed border-gray-200 rounded-lg bg-white/50 hover:bg-white transition-all aspect-square"
                                            >
                                                <PlusCircle className="w-6 h-6" />
                                                <span className="text-[10px] font-black uppercase tracking-wider">Add</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-[#637D37] hover:bg-[#52682d] text-white py-3 rounded-xl font-bold disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "Update Product"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false)
                                        setEditingProduct(null)
                                    }}
                                    className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Product?</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false)
                                    setProductToDelete(null)
                                }}
                                className="flex-1 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
