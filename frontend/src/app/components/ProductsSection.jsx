"use client"
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { Loader2, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Intelligence" },
  { id: "STATIONERY", name: "Stationery" },
  { id: "CRAFT", name: "Crafts" },
  { id: "ART SUPPLIES", name: "Art Supplies" },
  { id: "OFFICE", name: "Office" },
  { id: "BOOKS", name: "Books" }
]

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [categories] = useState(DEFAULT_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`
        if (activeCategory !== "all") {
          url += `?category=${activeCategory}`
        }
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error("Products fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [activeCategory])

  return (
    <section id="products" className="relative py-32 px-6 bg-[#020617] overflow-hidden">
      {/* Ambient Lighting Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#637D37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Intelligence Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#637D37]/10 border border-[#637D37]/20 rounded-lg mb-6">
            <Zap className="w-4 h-4 text-[#8baf4e]" />
            <span className="text-xs font-bold text-[#8baf4e] tracking-widest uppercase">The Catalog Feed</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-6">
            Engineered For <span className="text-[#8baf4e]">Excellence</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            Browse our high-fidelity collection of premium tools, curated for the modern architectural and creative workspace.
          </p>
        </motion.div>

        {/* Glassmorphic Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 border ${activeCategory === cat.id
                  ? "bg-[#637D37] text-white border-[#637D37] shadow-[0_0_20px_rgba(99,125,55,0.3)]"
                  : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:bg-white/10 backdrop-blur-md"
                }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Dynamic Products Feed */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#637D37]" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-slate-500 text-xl font-light italic">No high-fidelity products found in this intelligence layer.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
