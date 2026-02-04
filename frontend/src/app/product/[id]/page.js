import ProductDetailsClient from "./ProductDetailsClient"
import { notFound } from "next/navigation"

// Helper to fetch product data
async function getProduct(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/${id}`, {
            cache: 'no-store' // Ensure fresh data for product details
        })

        if (!res.ok) return null

        return res.json()
    } catch (error) {
        console.error("Failed to fetch product:", error)
        return null
    }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
    const product = await getProduct(params.id)

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    return {
        title: `${product.name} | Premium Stationery`,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.slice(0, 160),
            images: [product.imageUrl || '/placeholder.jpg'],
        },
    }
}

export default async function ProductPage({ params }) {
    const product = await getProduct(params.id)

    if (!product) {
        notFound()
    }

    return <ProductDetailsClient product={product} />
}
