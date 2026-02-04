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
      className="group flex flex-col"
    >
      {/* Visual Frame */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F0] mb-3 rounded-lg">
        <Image
          src={product.imageUrl || product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-[#1B3022]"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-[#637D37] text-[#637D37]' : 'text-current'}`} />
        </button>
      </Link>

      {/* Simplified Content Layer */}
      <div className="flex flex-col">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm text-[#1B3022] leading-tight group-hover:text-[#637D37] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>
        <span className="font-bold text-sm text-[#1B3022] mb-3">₹{product.price}</span>

        {/* Compact Action Bar */}
        <div className="mt-auto">
          {count === 0 ? (
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-full h-9 flex items-center justify-center gap-2 bg-[#1B3022] text-[#FCFBF7] text-xs font-medium rounded-md hover:bg-[#637D37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          ) : (
            <div className="flex items-center justify-between h-9 bg-[#F5F5F0] rounded-md px-1">
              <button
                onClick={() => removeItem(product.name)}
                className="w-8 h-full flex items-center justify-center hover:text-[#637D37] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-medium text-sm text-[#1B3022] tabular-nums">{count}</span>
              <button
                onClick={() => addItem(product)}
                className="w-8 h-full flex items-center justify-center hover:text-[#637D37] transition-colors"
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
