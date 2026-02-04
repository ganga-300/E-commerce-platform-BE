"use client"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { Plus, Minus, Heart, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function ProductCard({ product }) {
  const { addItem, removeItem, quantity } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const count = quantity[product.name]?.qty || 0
  const isFavorited = isInWishlist(product.id)

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-[#0f172a]/40 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#637D37]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#1e293b]/50">
        <Image
          src={product.imageUrl || product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Intelligence Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2.5 rounded-xl backdrop-blur-md border border-white/10 transition-colors ${isFavorited ? 'bg-red-500/20 text-red-500 grow' : 'bg-white/5 text-white/70 hover:text-white'
              }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <Link href={`/product/${product.id}`} className="p-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors">
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        {/* Family Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#637D37]/20 backdrop-blur-md border border-[#637D37]/30 text-[#8baf4e] text-[10px] font-bold tracking-widest uppercase rounded-md shadow-lg">
            {product.family || 'Stationery'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-white font-medium mb-3 line-clamp-1 group-hover:text-[#8baf4e] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl tracking-tight">₹{product.price}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Premium Unit</span>
          </div>

          {product.stock > 0 ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-md border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Verified Stock</span>
            </div>
          ) : (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2 py-0.5 bg-red-500/10 rounded-md border border-red-500/20">Restocking</span>
          )}
        </div>

        {/* Transaction Control */}
        <div className="relative">
          {count === 0 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-full h-12 flex items-center justify-center gap-2 bg-white text-[#0f172a] rounded-xl font-bold text-sm tracking-wide disabled:opacity-20 transition-all hover:bg-[#8baf4e] hover:text-white group/btn"
            >
              <ShoppingCart className="w-4 h-4" />
              INITIALIZE ORDER
            </motion.button>
          ) : (
            <div className="flex items-center justify-between h-12 bg-white/5 border border-white/10 rounded-xl p-1 overflow-hidden">
              <button
                onClick={() => removeItem(product.name)}
                className="w-10 h-full flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold text-lg tabular-nums">{count}</span>
              <button
                onClick={() => addItem(product)}
                className="w-10 h-full flex items-center justify-center bg-[#637D37] hover:bg-[#8baf4e] rounded-lg text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
