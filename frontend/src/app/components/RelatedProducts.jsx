"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function RelatedProducts({ currentProductId, category }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Try fetching by category if available, otherwise fetch all
                const url = category
                    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products?category=${category}`
                    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`

                const res = await fetch(url)
                if (res.ok) {
                    const data = await res.json()
                    // Filter out current product and limit to 4
                    const related = data
                        .filter(p => p.id !== currentProductId)
                        .slice(0, 4)
                    setProducts(related)
                }
            } catch (error) {
                console.error("Failed to load related products", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [currentProductId, category])

    if (!loading && products.length === 0) return null

    return (
        <div className="mt-24 pt-12 border-t border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    // Skeletons
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 aspect-[4/5] rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="group"
                        >
                            <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-4">
                                <Image
                                    src={product.imageUrl || "/placeholder.jpg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.countInStock === 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="bg-white/90 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900 group-hover:text-[#637D37] transition-colors truncate">
                                {product.name}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                ₹{product.price.toLocaleString()}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
