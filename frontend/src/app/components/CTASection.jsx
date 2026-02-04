"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
          Transform Your Study Space Today
        </h2>

        {/* Description */}
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Discover our carefully curated collection of premium stationery designed to inspire your best work and elevate your productivity.
        </p>

        {/* Offer Badge */}
        <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm font-medium mb-8">
          Limited time: Free shipping on orders over ₹500
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/#products">
            <button className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 flex items-center justify-center gap-2">
              Explore Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/#products">
            <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Browse Catalog
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
