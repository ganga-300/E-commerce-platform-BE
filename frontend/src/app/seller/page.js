"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { PlusCircle, Loader2, Upload, Edit2, Trash2, X, Clock, ShieldCheck, Mail } from "lucide-react"
import Script from "next/script"

export default function SellerDashboard() {
    const { user, token, loading: authLoading } = useAuth()
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

    const handleEdit = (product) => {
        setEditingProduct(product)
        setName(product.name)
        setDescription(product.description)
        setPrice(product.price.toString())
        setStock(product.stock.toString())
        setSku(product.sku)
        setFamily(product.family || "")
        setImageUrl(product.imageUrl)
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
                    imageUrl
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

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                {imageUrl ? (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl("")}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition"
                                        >
                                            <PlusCircle className="w-4 h-4 rotate-45" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleUpload}
                                        className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#637D37] transition"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-medium">Click to upload from device</span>
                                    </button>
                                )}
                                <p className="text-xs text-gray-400">Supports JPG, PNG up to 5MB</p>
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
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-800">{p.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{p.sku}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#637D37]">₹{p.price}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{p.stock}</td>
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
