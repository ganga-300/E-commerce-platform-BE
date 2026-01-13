"use client"
import { useState, useEffect, useMemo } from "react"
import ProductCard from "./ProductCard"
import { Loader2, Filter, ChevronDown, LayoutGrid } from "lucide-react"

const categories = ["All", "Stationery", "Books", "Office", "Crafts"]

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full max-w-[260px] animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
    <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-4"></div>
    <div className="h-8 bg-gray-200 rounded-full w-2/3 mx-auto"></div>
  </div>
)

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortBy, setSortBy] = useState("default")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error("Home Products Fetch Error:", err)
      } finally {
        setTimeout(() => setLoading(false), 800) // Small delay for smoother feel
      }
    }
    fetchProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Category Filter
    if (activeCategory !== "All") {
      result = result.filter(p => p.family?.toLowerCase() === activeCategory.toLowerCase())
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, activeCategory, sortBy])

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Premium Collection</h2>
            <p className="mt-2 text-lg text-gray-600">Explore our curated selection of fine stationery</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-[#637D37] outline-none cursor-pointer transition-all"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${activeCategory === cat
                  ? "bg-[#637D37] text-white border-[#637D37] shadow-lg shadow-[#637D37]/20 transform scale-105"
                  : "bg-white text-gray-600 border-gray-100 hover:border-[#637D37] hover:text-[#637D37]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No products match your criteria.</p>
            </div>
          ) : (
            filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

