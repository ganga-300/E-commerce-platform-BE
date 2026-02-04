"use client"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { Plus, Minus, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProductCard({ product }) {
  const { addItem, removeItem, quantity } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const count = quantity[product.name]?.qty || 0
  const isFavorited = isInWishlist(product.id)

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Link href={`/product/${product.id}`} className="relative block w-full aspect-square overflow-hidden cursor-pointer">
        <Image
          src={product.imageUrl || product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />

        <button
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">{product.family || 'Stationery'}</span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-semibold text-gray-900">₹{product.price}</span>
          {product.stock > 0 ? (
            <span className="text-xs text-green-600">In Stock</span>
          ) : (
            <span className="text-xs text-red-600">Out of Stock</span>
          )}
        </div>

        {count === 0 ? (
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => removeItem(product.name)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-gray-900">{count}</span>
            <button
              onClick={() => addItem(product)}
              className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-md"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
