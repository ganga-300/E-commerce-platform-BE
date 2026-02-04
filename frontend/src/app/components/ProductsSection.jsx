"use client"
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { Loader2, Feather, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Collections" },
  { id: "STATIONERY", name: "Fine Stationery" },
  { id: "CRAFT", name: "Artisanal Crafts" },
  { id: "ART SUPPLIES", name: "Premium Pigments" },
  { id: "OFFICE", name: "Executive Suite" },
  { id: "BOOKS", name: "Limited Prints" }
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
    <section id="products" className="relative py-32 px-6 bg-white overflow-hidden">
      {/* Subtle Background Detail */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1B3022]/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Gallery Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#637D37]/5 rounded-none mb-6">
            <Feather className="w-3.5 h-3.5 text-[#637D37]" />
            <span className="text-[10px] font-black text-[#637D37] tracking-[0.3em] uppercase">The Curated Collection</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-[#1B3022] tracking-tight mb-8">
            Instruments for <span className="italic font-light text-[#637D37]">Discovery</span>
          </h2>
          <p className="text-xl text-[#3A433E] max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
            A selection of fine tools and artifacts chosen for their quality, heritage, and functional beauty.
          </p>
        </motion.div>

        {/* Minimalist Category Navigation */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-20 border-b border-[#1B3022]/5 pb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-2 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeCategory === cat.id
                  ? "text-[#1B3022]"
                  : "text-[#1B3022]/40 hover:text-[#1B3022]"
                }`}
            >
              {cat.name}
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="catUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#637D37]"
                />
              )}
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1B3022]/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1B3022]/60 hover:bg-[#1B3022]/5 transition-colors">
            <Filter className="w-3 h-3" />
            Sort By
          </button>
        </div>

        {/* Art Gallery Grid */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#637D37]" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-40 border-t border-dashed border-[#1B3022]/10">
              <p className="text-[#3A433E] text-xl font-serif italic italic opacity-60">No pieces currently showcased in this collection layer.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
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
