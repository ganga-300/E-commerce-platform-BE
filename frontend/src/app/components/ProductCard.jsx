"use client"
import { useCart } from "@/contexts/CartContext"
import { Plus, Minus, Heart } from "lucide-react"
import Image from "next/image"

export default function ProductCard({ product }) {
  const { addItem, removeItem, quantity } = useCart()
  const count = quantity[product.id]?.count || 0

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden w-full max-w-[260px]">
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-white/70 rounded-full p-2 hover:bg-white">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.quantity}</p>
        <p className="text-lg font-medium text-primary mt-2">₹{product.price}</p>

        <div className="mt-4 flex items-center justify-center gap-3">
          {count === 0 ? (
            <button
              onClick={() => addItem(product)}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeItem(product.id)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">{count}</span>
              <button
                onClick={() => addItem(product)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
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
