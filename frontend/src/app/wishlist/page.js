"use client"
import React from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import ProductCard from '@/app/components/ProductCard'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
    const { wishlistItems } = useWishlist()

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-3 bg-[#637D37]/10 rounded-2xl">
                            <Heart className="w-8 h-8 text-[#637D37]" />
                        </div>
                        My Wishlist
                    </h1>
                    <p className="mt-2 text-gray-500">Products you've saved to buy later</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Save items you're interested in by clicking the heart icon on any product.
                        </p>
                        <Link href="/">
                            <button className="px-8 py-3 bg-[#637D37] text-white rounded-xl font-bold hover:bg-[#52682d] transition-all flex items-center gap-2 mx-auto shadow-lg shadow-[#637D37]/20">
                                <ShoppingBag className="w-5 h-5" />
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                        {wishlistItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
