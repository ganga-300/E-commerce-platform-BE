"use client"
import React from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import ProductCard from '@/app/components/ProductCard'
import { Heart, ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist()
    const { addItem } = useCart()

    const handleMoveToCart = (product) => {
        addItem(product)
        removeFromWishlist(product.id)
        toast.success(`${product.name} moved to cart!`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-3 bg-[#637D37]/10 rounded-2xl">
                            <Heart className="w-8 h-8 text-[#637D37]" />
                        </div>
                        My Wishlist
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Products you've saved to buy later • {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                    </p>
                </motion.div>

                {wishlistItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-red-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Save items you're interested in by clicking the heart icon on any product.
                        </p>
                        <Link href="/">
                            <button className="px-8 py-3 bg-[#637D37] text-white rounded-xl font-bold hover:bg-[#52682d] transition-all flex items-center gap-2 mx-auto shadow-lg shadow-[#637D37]/20 hover:-translate-y-0.5">
                                <ShoppingBag className="w-5 h-5" />
                                Start Shopping
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                            {wishlistItems.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="w-full max-w-sm"
                                >
                                    <div className="relative group">
                                        <ProductCard product={product} />
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleMoveToCart(product)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#637D37] text-white rounded-xl font-bold text-sm hover:bg-[#52682d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Move to Cart
                                            </button>
                                            <button
                                                onClick={() => {
                                                    removeFromWishlist(product.id)
                                                    toast.success(`${product.name} removed from wishlist`)
                                                }}
                                                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
