"use client"
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { Loader2 } from "lucide-react"

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([
    { id: "all", name: "All Products", slug: "all" }
  ])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`)
        if (res.ok) {
          const data = await res.json()
          console.log("Fetched categories:", data)
          // Build categories array with "All" option first
          const allCategories = [
            { id: "all", name: "All Products", slug: "all" },
            ...data.map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase()
            }))
          ]
          setCategories(allCategories)
        } else {
          // Fallback to defaults if API fails
          setCategories([{ id: "all", name: "All Products", slug: "all" }])
        }
      } catch (err) {
        console.error("Categories fetch error:", err)
        // Fallback to defaults
        setCategories([{ id: "all", name: "All Products", slug: "all" }])
      }
    }
    fetchCategories()
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`

        // For filtering, use the category name (not ID or slug)
        if (activeCategory !== "all") {
          const selectedCat = categories.find(c => c.id === activeCategory || c.slug === activeCategory)
          if (selectedCat && selectedCat.name !== "All Products") {
            url += `?category=${selectedCat.name}`
          }
        }

        console.log("Fetching products from:", url)
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          console.log("Fetched products:", data.length)
          setProducts(data)
        }
      } catch (err) {
        console.error("Products fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (categories.length > 0) {
      fetchProducts()
    }
  }, [activeCategory, categories])

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
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid - 5 columns for smaller cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
