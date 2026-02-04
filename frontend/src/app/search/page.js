"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductCard from "../components/ProductCard"
import { Search, Loader2, Filter, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get("query")
    const router = useRouter()

    // Data State
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Filter States
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
    const [selectedCategories, setSelectedCategories] = useState([])
    const [minRating, setMinRating] = useState(0)
    const [sortBy, setSortBy] = useState("relevant")
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const categories = ["Stationery", "Books", "Office", "Crafts", "Technology", "Accessories"]

    // Fetch Initial Results
    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return

            setLoading(true)
            try {
                // If query is empty/generic, maybe fetch all? But search page implies specific intent.
                // For now, keep using search endpoint.
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/search?query=${query}`)
                if (!res.ok) throw new Error('Search failed')
                const data = await res.json()
                setAllProducts(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])

    // Filter logic
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            // Price Filter
            if (product.price < priceRange.min || product.price > priceRange.max) return false

            // Category Filter
            if (selectedCategories.length > 0) {
                // Check if product.family or product.category matches
                const cat = product.family || product.category?.name
                if (!cat || !selectedCategories.includes(cat)) return false
            }

            // Rating Filter (assuming averageRating exists)
            const rating = product.averageRating || 0
            if (rating < minRating) return false

            return true
        }).sort((a, b) => {
            if (sortBy === "price_asc") return a.price - b.price
            if (sortBy === "price_desc") return b.price - a.price
            if (sortBy === "rating") return (b.averageRating || 0) - (a.averageRating || 0)
            return 0 // relevance (default order)
        })
    }, [allProducts, priceRange, selectedCategories, minRating, sortBy])

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        )
    }

    if (!query) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <Search className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Search for products</h2>
            <p className="text-gray-500">Type something in the search bar to find what you need.</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#FDFCF8] py-8">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-gray-900">
                            Results for <span className="text-[#637D37]">"{query}"</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Found {filteredProducts.length} items
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="md:hidden px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
                        >
                            <Filter className="w-4 h-4" /> Filters
                        </button>

                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#637D37] shadow-sm cursor-pointer"
                            >
                                <option value="relevant">Relevance</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <div className="hidden md:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                        placeholder="Min"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-[#637D37] border-[#637D37]' : 'border-gray-300 bg-white group-hover:border-[#637D37]'}`}>
                                            {selectedCategories.includes(cat) && <X className="w-3 h-3 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                            className="hidden"
                                        />
                                        <span className={`text-sm ${selectedCategories.includes(cat) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Rating</h3>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map(star => (
                                    <label key={star} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="rating"
                                            checked={minRating === star}
                                            onChange={() => setMinRating(star)}
                                            className="text-[#637D37] focus:ring-[#637D37]"
                                        />
                                        <div className="flex items-center gap-1">
                                            {Array(star).fill(0).map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-sm">★</span>
                                            ))}
                                            <span className="text-sm text-gray-600 ml-1">& Up</span>
                                        </div>
                                    </label>
                                ))}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={minRating === 0}
                                        onChange={() => setMinRating(0)}
                                        className="text-[#637D37] focus:ring-[#637D37]"
                                    />
                                    <span className="text-sm text-gray-600">Any Rating</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-[#637D37]" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-red-50 rounded-xl">
                                <p className="text-red-600 font-medium font-mono">Error: {error}</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-xl">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 font-heading">No matches found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={() => {
                                        setPriceRange({ min: 0, max: 10000 })
                                        setSelectedCategories([])
                                        setMinRating(0)
                                    }}
                                    className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-900 hover:border-[#637D37] hover:text-[#637D37] transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
                {showMobileFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 md:hidden flex justify-end"
                        onClick={() => setShowMobileFilters(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="bg-white w-[300px] h-full p-6 overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold font-heading">Filters</h2>
                                <button onClick={() => setShowMobileFilters(false)}>
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Reusing Filter Controls - In production, extract FilterSidebar component */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                                placeholder="Min"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* ... Categories and Ratings (duplicated for simpler MVP implementation within one file) ... */}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#637D37]"></div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}
