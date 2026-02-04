"use client"
import { useState, useEffect, useMemo } from "react"
import ProductCard from "./ProductCard"
import { Loader2, Feather, Filter, ArrowUpDown, Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const CATEGORIES = [
  { id: "all", name: "All Artifacts" },
  { id: "STATIONERY", name: "Fine Stationery" },
  { id: "CRAFT", name: "Artisanal Crafts" },
  { id: "ART SUPPLIES", name: "Premium Pigments" },
  { id: "OFFICE", name: "Executive Suite" },
  { id: "BOOKS", name: "Limited Prints" }
]

const SORT_OPTIONS = [
  { id: "featured", label: "Curated (Default)" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest Additions" }
]

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortOption, setSortOption] = useState("featured")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch Products (Server-Side Filter)
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

  // Client-Side Sorting
  const sortedProducts = useMemo(() => {
    let sorted = [...products]
    if (sortOption === "price-asc") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price-desc") {
      sorted.sort((a, b) => b.price - a.price)
    } else if (sortOption === "newest") {
      // Assuming _id or createdAt proxy
      sorted.sort((a, b) => (b.createdAt || b._id).localeCompare(a.createdAt || a._id))
    }
    return sorted
  }, [products, sortOption])

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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#637D37]/5 rounded-none mb-6">
            <Feather className="w-3.5 h-3.5 text-[#637D37]" />
            <span className="text-[10px] font-black text-[#637D37] tracking-[0.3em] uppercase">The Curated Collection</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif text-[#1B3022] tracking-tight mb-6">
            Instruments for <span className="italic font-light text-[#637D37]">Discovery</span>
          </h2>
        </motion.div>

        {/* Minimalist Toolbar (Filter & Sort) */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-md border border-[#1B3022]/5 p-4 mb-16 rounded-2xl flex flex-wrap justify-between items-center gap-4 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-[#1B3022]/40">
            Showing {sortedProducts.length} Artifacts
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#FCFBF7] border border-[#1B3022]/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#1B3022] hover:bg-[#1B3022] hover:text-[#FCFBF7] transition-all"
              >
                <Filter className="w-3 h-3" />
                Filter
                <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-[#1B3022]/10 rounded-xl shadow-2xl overflow-hidden py-2"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setIsFilterOpen(false); }}
                        className="w-full text-left px-4 py-3 text-xs font-medium text-[#1B3022] hover:bg-[#FCFBF7] flex items-center justify-between group"
                      >
                        {cat.name}
                        {activeCategory === cat.id && <Check className="w-3 h-3 text-[#637D37]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#FCFBF7] border border-[#1B3022]/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#1B3022] hover:bg-[#1B3022] hover:text-[#FCFBF7] transition-all"
              >
                <ArrowUpDown className="w-3 h-3" />
                Sort
                <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-[#1B3022]/10 rounded-xl shadow-2xl overflow-hidden py-2"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => { setSortOption(option.id); setIsSortOpen(false); }}
                        className="w-full text-left px-4 py-3 text-xs font-medium text-[#1B3022] hover:bg-[#FCFBF7] flex items-center justify-between group"
                      >
                        {option.label}
                        {sortOption === option.id && <Check className="w-3 h-3 text-[#637D37]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Art Gallery Grid */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#637D37]" />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-40 border-t border-dashed border-[#1B3022]/10">
              <p className="text-[#3A433E] text-xl font-serif italic italic opacity-60">No pieces currently showcased in this collection layer.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product) => (
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
