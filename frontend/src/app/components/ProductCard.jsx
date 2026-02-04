"use client"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { Plus, Minus, Heart, ShoppingBag, Eye, Star } from "lucide-react"
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group flex flex-col pt-4"
    >
      {/* Editorial Visual Frame */}
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F0] mb-6">
        <Image
          src={product.imageUrl || product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />

        {/* Minimalist Favoriting Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm border border-[#1B3022]/5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#637D37] text-[#637D37]' : 'text-[#1B3022]/40'}`} />
        </button>

        {/* Collection Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-[#1B3022] text-[#FCFBF7] text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
            {product.family || 'The Archive'}
          </span>
        </div>
      </Link>

      {/* Content Layer */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product.id}`} className="flex-1">
            <h3 className="font-serif text-lg text-[#1B3022] leading-tight group-hover:text-[#637D37] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <span className="font-serif text-lg text-[#1B3022] ml-4">₹{product.price}</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center text-[#637D37]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-current" />
            ))}
          </div>
          <span className="text-[10px] text-[#1B3022]/40 font-black uppercase tracking-widest">Masterpiece Quality</span>
        </div>

        {/* Modular Action Bar */}
        <div className="mt-auto pt-4 border-t border-[#1B3022]/5">
          {count === 0 ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-full h-12 flex items-center justify-between px-6 bg-[#FCFBF7] border border-[#1B3022]/10 text-[#1B3022] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1B3022] hover:text-[#FCFBF7] hover:border-[#1B3022] transition-all disabled:opacity-20 group/btn"
            >
              <span className="relative z-10">{product.stock === 0 ? 'Restocking Piece' : 'Acquire Current Piece'}</span>
              <ShoppingBag className="w-3.5 h-3.5" />
            </motion.button>
          ) : (
            <div className="flex items-center justify-between h-12 bg-[#F5F5F0] px-1">
              <button
                onClick={() => removeItem(product.name)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white text-[#1B3022] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-serif text-lg text-[#1B3022] tabular-nums">{count}</span>
              <button
                onClick={() => addItem(product)}
                className="w-10 h-10 flex items-center justify-center bg-[#1B3022] text-[#FCFBF7] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
