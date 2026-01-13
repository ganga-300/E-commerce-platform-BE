"use client"
import { useCart } from "@/contexts/CartContext"
import { Plus, Minus, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProductCard({ product }) {
  const { addItem, removeItem, quantity } = useCart()
  const count = quantity[product.name]?.qty || 0

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-[260px] border border-gray-100/50">
      <Link href={`/product/${product.id}`} className="relative block w-full h-56 overflow-hidden cursor-pointer">
        <Image
          src={product.imageUrl || product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-sm transition-all transform hover:scale-110" onClick={(e) => e.preventDefault()}>
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </Link>

      <div className="p-5">
        <div className="mb-1">
          <span className="text-[10px] font-bold text-[#637D37] uppercase tracking-widest">{product.family || 'Stationery'}</span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-base font-bold text-gray-900 cursor-pointer hover:text-[#637D37] transition-colors leading-tight line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-lg font-black text-gray-900 mt-2">₹{product.price}</p>

        <div className="mt-4">
          {count === 0 ? (
            <button
              onClick={() => addItem(product)}
              className="w-full py-2.5 bg-[#637D37] text-white rounded-xl text-xs font-bold hover:bg-[#52682d] transition-all shadow-md shadow-[#637D37]/10 transform active:scale-95"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button
                onClick={() => removeItem(product.name)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-gray-800">{count}</span>
              <button
                onClick={() => addItem(product)}
                className="p-2 text-gray-400 hover:text-[#637D37] hover:bg-white rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
