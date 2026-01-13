"use client"
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { Loader2 } from "lucide-react"

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error("Home Products Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-[#637D37] w-10 h-10" />
    </div>
  )

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Our Products</h2>
          <p className="mt-4 text-lg text-gray-600">Discover our wide range of quality stationery items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {products.length === 0 ? (
            <p className="text-gray-500 col-span-full">No products available yet.</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
