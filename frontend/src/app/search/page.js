"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductCard from "../components/ProductCard"
import { Search, Loader2 } from "lucide-react"

function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get("query")
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return

            setLoading(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/search?query=${query}`)
                if (!res.ok) throw new Error('Search failed')
                const data = await res.json()
                setProducts(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])

    if (!query) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <Search className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Search for products</h2>
            <p className="text-gray-500">Type something in the search bar to find what you need.</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Search Results for <span className="text-[#637D37]">"{query}"</span>
                </h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#637D37]" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        Error: {error}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found matching your search.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-4 text-[#637D37] font-medium hover:underline"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#637D37]"></div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}
