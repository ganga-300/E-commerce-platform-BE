"use client"
import ProductCard from "./ProductCard"

const productList = [
  { id: "1", image: "/placeholder.svg", name: "Classmate Notebook", quantity: "200 Pages", price: 65 },
  { id: "2", image: "/placeholder.svg", name: "Camlin Geometry Box", quantity: "1 Set", price: 70 },
  { id: "3", image: "/placeholder.svg", name: "Apsara Platinum Pencils", quantity: "Pack of 10", price: 30 },
  { id: "4", image: "/placeholder.svg", name: "Camel Poster Colours", quantity: "12 Shades", price: 120 },
  { id: "5", image: "/placeholder.svg", name: "Fevicol MR", quantity: "200 g", price: 35 },
]

export default function ProductsSection() {
  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Our Products</h2>
          <p className="mt-4 text-lg text-gray-600">Discover our wide range of quality stationery items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
