"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    ShoppingCart,
    ArrowLeft,
    Star,
    Truck,
    Shield,
    Minus,
    Plus,
    Heart
} from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useToast } from "@/contexts/ToastContext"
import ReviewSection from "@/app/components/ReviewSection"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function ProductDetailsClient({ product }) {
    const router = useRouter()
    const { addItem } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const { showToast } = useToast()
    const [localQty, setLocalQty] = useState(1)

    // Safety check just in case
    if (!product) return null

    const isFavorited = isInWishlist(product.id)

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Breadcrumbs
                        items={[
                            { label: "Products", href: "/#products" },
                            { label: product.family || "Stationery", href: `/?category=${product.family}` },
                            { label: product.name }
                        ]}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
                        {/* Image Section */}
                        <div className="relative aspect-square lg:aspect-auto h-96 lg:h-full bg-gray-100 rounded-xl overflow-hidden">
                            <Image
                                src={product.imageUrl || "/placeholder.jpg"}
                                alt={product.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                priority
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

                {/* Review Section - Assuming it works as a client component or handles its own data fetching if not passed props */}
                {/* Previous implementation passed productId={id} */}
                <ReviewSection productId={product.id} />
            </div>
        </div>
    )
}
