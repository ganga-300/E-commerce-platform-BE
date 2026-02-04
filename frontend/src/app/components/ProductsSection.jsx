"use client"
import { useState, useEffect, useMemo } from "react"
import ProductCard from "./ProductCard"
import { Loader2 } from "lucide-react"

const categories = ["All", "Stationery", "Books", "Office", "Crafts"]

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [allCategories, setAllCategories] = useState(categories)
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`)
        if (res.ok) {
          const data = await res.json()
          setAllCategories(["All", ...data])
        }
      } catch (err) {
        console.error("Fetch Categories Error:", err)
      }
    }
    fetchCats()
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`

        if (activeCategory !== "All") {
          url += `?category=${activeCategoryId || activeCategory}`
        }

        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error("Fetch Products Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory, activeCategoryId])

  const handleCategoryClick = (cat) => {
    if (cat === "All") {
      setActiveCategory("All")
      setActiveCategoryId(null)
    } else {
      setActiveCategory(cat.name || cat)
      setActiveCategoryId(cat.id || null)
    }
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-gray-900 tracking-tight mb-4">
            Discover Premium Stationery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thoughtfully curated products for students and professionals
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allCategories.map((cat) => (
            <button
              key={cat === "All" ? "all" : cat.id || cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${(cat === "All" ? activeCategory === "All" : activeCategoryId === cat.id || activeCategory === cat.name || activeCategory === cat)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat === "All" ? "All Products" : cat.name || cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
