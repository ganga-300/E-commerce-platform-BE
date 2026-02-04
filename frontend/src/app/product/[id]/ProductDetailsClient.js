"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import {
    ShoppingCart,
    ChevronLeft,
    Star,
    Truck,
    Shield,
    Minus,
    Plus,
    Heart,
    Award
} from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useToast } from "@/contexts/ToastContext"
import ReviewSection from "@/app/components/ReviewSection"
import RelatedProducts from "@/app/components/RelatedProducts"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { toast } from "sonner"

export default function ProductDetailsClient({ product }) {
    const router = useRouter()
    const { addItem } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const { showToast } = useToast()
    const [localQty, setLocalQty] = useState(1)
    const [selectedImage, setSelectedImage] = useState(product.imageUrl)

    if (!product) return null

    const isFavorited = isInWishlist(product.id)

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="font-medium">Back</span>
                        </button>
                        <div className="hidden md:block">
                            <Breadcrumbs
                                items={[
                                    { label: "Shop", href: "/#products" },
                                    { label: product.family || "Products", href: `/?category=${product.family}` },
                                    { label: product.name }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Image Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full aspect-square bg-[#FAFAF8] rounded-3xl overflow-hidden group border border-gray-100 shadow-sm"
                        >
                            <div className="absolute inset-0 p-8">
                                <Image
                                    src={selectedImage || product.imageUrl || "/placeholder.jpg"}
                                    alt={product.name}
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            </div>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${isFavorited
                                    ? 'bg-white text-red-500 hover:scale-110'
                                    : 'bg-white/60 text-gray-700 hover:bg-white hover:text-red-400'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                            </button>
                        </motion.div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedImage(product.imageUrl)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${selectedImage === product.imageUrl ? 'border-[#637D37] ring-2 ring-[#637D37]/10' : 'border-gray-100'
                                        }`}
                                >
                                    <Image src={product.imageUrl} alt="Thumbnail" fill className="object-contain p-2" />
                                </button>
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${selectedImage === img ? 'border-[#637D37] ring-2 ring-[#637D37]/10' : 'border-gray-100'
                                            }`}
                                    >
                                        <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 space-y-8"
                    >
                        {/* Category & Rating */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                                {product.family || "General"}
                            </span>
                            {product.reviewCount > 0 && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {product.averageRating || 0}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            ({product.reviewCount})
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Product Name */}
                        <div>
                            <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-base text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-light text-gray-900">₹{product.price}</span>
                            {product.stock > 0 ? (
                                <span className="text-sm text-green-600 font-medium">In Stock</span>
                            ) : (
                                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100"></div>

                        {/* Quantity */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900">Quantity</label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-200 rounded-md">
                                    <button
                                        onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium text-gray-900">{localQty}</span>
                                    <button
                                        onClick={() => setLocalQty(Math.min(product.stock, localQty + 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {product.stock > 0 && product.stock < 10 && (
                                    <span className="text-sm text-orange-600">Only {product.stock} left</span>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-3">
                            <button
                                disabled={product.stock === 0}
                                onClick={() => {
                                    for (let i = 0; i < localQty; i++) {
                                        addItem(product);
                                    }
                                    toast.success(`Added to cart`);
                                }}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-md font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
                            >
                                Add to Cart
                            </button>
                            <p className="text-xs text-center text-gray-500">
                                Free shipping on orders over ₹500
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100"></div>

                        {/* Benefits */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Free Delivery</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">On orders above ₹500</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Secure Payment</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">100% secure transactions</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Premium Quality</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Verified authentic products</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Reviews */}
            <div className="border-t border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <ReviewSection productId={product.id} />
                </div>
            </div>

            {/* Related Products */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <RelatedProducts currentProductId={product.id} category={product.family} />
            </div>
        </div>
    )
}
