"use client"
import { useState, useEffect, useMemo } from "react"
import ProductCard from "./ProductCard"
import { Loader2, Filter, ChevronDown, LayoutGrid, Star } from "lucide-react"

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
  const [categories, setCategories] = useState(["All"])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [sortBy, setSortBy] = useState("default")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState(0)

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`)
        if (res.ok) {
          const data = await res.json()
          setCategories(["All", ...data])
        }
      } catch (err) {
        console.error("Fetch Categories Error:", err)
      }
    }
    fetchCats()
  }, [])

  // Fetch Products with Filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products?`

        if (activeCategoryId) url += `category=${activeCategoryId}&`
        if (minPrice) url += `minPrice=${minPrice}&`
        if (maxPrice) url += `maxPrice=${maxPrice}&`
        if (minRating) url += `minRating=${minRating}&`

        // Map sort frontend values to backend ones
        if (sortBy === "price-low") url += `sort=price_asc&`
        if (sortBy === "price-high") url += `sort=price_desc&`
        if (sortBy === "rating") url += `sort=rating&`
        if (sortBy === "popular") url += `sort=popular&`

        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error("Home Products Fetch Error:", err)
      } finally {
        setTimeout(() => setLoading(false), 500)
      }
    }
    fetchProducts()
  }, [activeCategoryId, sortBy, minPrice, maxPrice, minRating])

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === "All" ? "All" : cat.name)
    setActiveCategoryId(cat === "All" ? null : cat.id)
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#637D37]" />
                Filter Products
              </h3>

              {/* Search / Categories */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Categories</h4>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat === "All" ? "all" : cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${(cat === "All" ? activeCategory === "All" : activeCategoryId === cat.id)
                        ? "bg-[#637D37] text-white shadow-md shadow-[#637D37]/20 translate-x-1"
                        : "text-gray-500 hover:bg-white hover:text-[#637D37]"
                        }`}
                    >
                      {cat === "All" ? "All Items" : cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#637D37] outline-none"
                />
                <span className="text-gray-300">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#637D37] outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Minimum Rating</h4>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    onClick={() => setMinRating(star === minRating ? 0 : star)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${star <= minRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveCategory("All")
                setActiveCategoryId(null)
                setMinPrice("")
                setMaxPrice("")
                setMinRating(0)
                setSortBy("default")
              }}
              className="w-full py-3 text-xs font-bold text-gray-400 hover:text-red-500 border border-dashed border-gray-200 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Premium Collection</h2>
                <p className="mt-2 text-lg text-gray-500 font-medium">Explore our curated selection of fine stationery</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-3 pr-10 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#637D37] outline-none cursor-pointer transition-all shadow-sm"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : products.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid className="w-10 h-10 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No products found</p>
                  <p className="text-gray-400 mt-2">Try adjusting your filters or category.</p>
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

