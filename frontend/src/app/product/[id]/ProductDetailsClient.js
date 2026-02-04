"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import {
    ShoppingCart,
    ArrowLeft,
    Star,
    Truck,
    Shield,
    Minus,
    Plus,
    Heart,
    Package,
    RefreshCw,
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
    const [selectedImage, setSelectedImage] = useState(0)

    // Safety check just in case
    if (!product) return null

    const isFavorited = isInWishlist(product.id)

    // Mock multiple images (you can extend this when backend supports multiple images)
    const productImages = [
        product.imageUrl || "/placeholder.jpg",
        product.imageUrl || "/placeholder.jpg",
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button & Breadcrumbs */}
                <div className="mb-6 flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="p-2 bg-white rounded-full border border-gray-200 hover:border-[#637D37] hover:bg-[#637D37]/5 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    <Breadcrumbs
                        items={[
                            { label: "Products", href: "/#products" },
                            { label: product.family || "Stationery", href: `/?category=${product.family}` },
                            { label: product.name }
                        ]}
                    />
                </div>

                {/* Main Product Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <motion.div
                                layoutId="product-image"
                                className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-inner"
                            >
                                <Image
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Wishlist Badge */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleWishlist(product)}
                                    className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all ${isFavorited
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/80 text-gray-600 hover:bg-white'
                                        }`}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                                </motion.button>

                                {/* Stock Badge */}
                                {product.stock > 0 && product.stock < 10 && (
                                    <div className="absolute bottom-4 left-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg">
                                        Only {product.stock} left!
                                    </div>
                                )}
                            </motion.div>

                            {/* Thumbnail Gallery - if multiple images */}
                            {productImages.length > 1 && (
                                <div className="flex gap-3">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                                                    ? 'border-[#637D37] ring-2 ring-[#637D37]/20'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col justify-center space-y-6">
                            {/* Category & Rating */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="px-4 py-1.5 bg-[#637D37]/10 text-[#637D37] text-sm font-bold rounded-full">
                                    {product.family || "General"}
                                </span>
                                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-gray-900 font-bold text-sm">
                                        {product.averageRating || 0}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        ({product.reviewCount || 0})
                                    </span>
                                </div>
                            </div>

                            {/* Product Name */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight">
                                    {product.name}
                                </h1>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price & Stock */}
                            <div className="flex items-end gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                                    <span className="text-5xl font-black text-[#637D37]">₹{product.price}</span>
                                </div>
                                {product.stock > 0 ? (
                                    <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-xl text-sm border border-green-200">
                                        ✓ In Stock
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-xl text-sm border border-red-200">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">Quantity</span>
                                    <div className="flex items-center gap-4 bg-white rounded-xl border-2 border-gray-200 p-1">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                                        >
                                            <Minus className="w-5 h-5" />
                                        </motion.button>
                                        <span className="w-12 text-center font-bold text-xl text-gray-900">{localQty}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setLocalQty(Math.min(product.stock, localQty + 1))}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={product.stock === 0}
                                onClick={() => {
                                    for (let i = 0; i < localQty; i++) {
                                        addItem(product);
                                    }
                                    toast.success(`Added ${localQty} ${product.name} to cart`, {
                                        icon: '🛒',
                                    });
                                }}
                                className="w-full bg-gradient-to-r from-[#637D37] to-[#52682d] hover:from-[#52682d] hover:to-[#3d4f22] text-white py-5 px-8 rounded-2xl font-black text-lg shadow-2xl shadow-[#637D37]/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Add to Cart
                            </motion.button>

                            {/* Benefits */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <Truck className="w-8 h-8 text-blue-600 mb-2" />
                                    <h4 className="font-bold text-gray-900 text-sm">Free Delivery</h4>
                                    <p className="text-xs text-gray-600">On orders over ₹500</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-xl border border-green-100">
                                    <Shield className="w-8 h-8 text-green-600 mb-2" />
                                    <h4 className="font-bold text-gray-900 text-sm">Secure Payment</h4>
                                    <p className="text-xs text-gray-600">100% protected</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <Award className="w-8 h-8 text-purple-600 mb-2" />
                                    <h4 className="font-bold text-gray-900 text-sm">Quality Assured</h4>
                                    <p className="text-xs text-gray-600">Premium products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Review Section */}
                <ReviewSection productId={product.id} />

                {/* Related Products */}
                <RelatedProducts currentProductId={product.id} category={product.family} />
            </div>
        </div>
    )
}
