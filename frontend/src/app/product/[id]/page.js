"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
    ShoppingCart,
    ArrowLeft,
    Star,
    Truck,
    Shield,
    Package,
    Minus,
    Plus,
    Heart
} from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useToast } from "@/contexts/ToastContext"
import ReviewSection from "@/app/components/ReviewSection"

export default function ProductDetails() {
    const { id } = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const { showToast } = useToast()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [localQty, setLocalQty] = useState(1)
    const [error, setError] = useState(null)
    const isFavorited = product ? isInWishlist(product.id) : false

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/${id}`)
                if (!res.ok) throw new Error('Product not found')
                const data = await res.json()
                setProduct(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchProduct()
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#637D37]"></div>
        </div>
    )

    if (error || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
            <button onClick={() => router.back()} className="text-[#637D37] hover:underline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-gray-600 hover:text-[#637D37] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Products
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
                        {/* Image Section */}
                        <div className="relative aspect-square lg:aspect-auto h-96 lg:h-full bg-gray-100 rounded-xl overflow-hidden">
                            <Image
                                src={product.imageUrl || "https://premium-stationery.com/placeholder.jpg"}
                                alt={product.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col justify-center space-y-8">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-3 py-1 bg-[#637D37]/10 text-[#637D37] text-sm font-semibold rounded-full">
                                        {product.family || "General"}
                                    </span>
                                    <div className="flex items-center text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-gray-600 ml-1 text-sm">
                                            {product.averageRating || 0} ({product.reviewCount || 0} reviews)
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    {product.description}
                                </p>

                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                                    {product.stock > 0 ? (
                                        <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-sm">
                                            In Stock ({product.stock} available)
                                        </span>
                                    ) : (
                                        <span className="text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full text-sm">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-100 py-6 space-y-4">
                                <div className="flex items-center gap-6">
                                    <span className="font-semibold text-gray-700">Quantity</span>
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                                            className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-medium text-gray-900">{localQty}</span>
                                        <button
                                            onClick={() => setLocalQty(Math.min(product.stock, localQty + 1))}
                                            className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    disabled={product.stock === 0}
                                    onClick={() => {
                                        for (let i = 0; i < localQty; i++) {
                                            addItem(product);
                                        }
                                        showToast(`Added ${localQty} ${product.name} to cart`);
                                    }}
                                    className="flex-1 bg-[#637D37] hover:bg-[#52682d] text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg shadow-[#637D37]/20 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`p-4 rounded-xl border transition-all transform hover:scale-105 ${isFavorited ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'}`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-start gap-3">
                                    <Truck className="w-6 h-6 text-[#637D37]" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Free Delivery</h4>
                                        <p className="text-sm text-gray-600">On orders over ₹500</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="w-6 h-6 text-[#637D37]" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                                        <p className="text-sm text-gray-600">100% secure transaction</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Section */}
                <ReviewSection productId={id} />
            </div>
        </div>
    )
}
