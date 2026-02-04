"use client"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { Plus, Minus, Heart } from "lucide-react"
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-[260px] border border-border/50"
    >
      <Link href={`/product/${product.id}`} className="relative block w-full h-56 overflow-hidden cursor-pointer">
        <Image
          src={product.imageUrl || product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-sm transition-colors z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </motion.button>
      </Link>

      <div className="p-5">
        <div className="mb-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.family || 'Stationery'}</span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-base font-bold text-foreground cursor-pointer hover:text-primary transition-colors leading-tight line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-lg font-black text-foreground mt-2">₹{product.price}</p>

        <div className="mt-4">
          {count === 0 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addItem(product)}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md shadow-primary/10"
            >
              Add to Cart
            </motion.button>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-xl p-1 border border-border">
              <button
                onClick={() => removeItem(product.name)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-background rounded-lg transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-foreground">{count}</span>
              <button
                onClick={() => addItem(product)}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-all"
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
