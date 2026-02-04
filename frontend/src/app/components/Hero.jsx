"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#f8faf6] via-white to-[#f5f7f3] overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#637D37_1px,transparent_1px),linear-gradient(to_bottom,#637D37_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#637D37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#637D37]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[92vh] items-center gap-12 lg:gap-20">

          {/* Left Content */}
          <div className="px-6 md:px-12 lg:pl-16 py-20 lg:py-32">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#637D37]/10 border border-[#637D37]/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-[#637D37]" />
              <span className="text-sm font-medium text-[#637D37] tracking-wide">Premium Quality Since 2024</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 leading-[0.95] mb-8">
              Excellence
              <span className="block mt-3 text-[#637D37] font-normal italic" style={{ fontFamily: 'Georgia, serif' }}>
                Redefined
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-700 font-light mb-12 max-w-xl leading-relaxed">
              Discover India's finest collection of premium stationery, thoughtfully curated for students and professionals who demand perfection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="/#products">
                <button className="group px-8 py-4 bg-[#637D37] text-white font-medium hover:bg-[#52682d] transition-all shadow-lg hover:shadow-xl hover:shadow-[#637D37]/20 flex items-center gap-3 justify-center">
                  SHOP COLLECTION
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/#why-choose-us">
                <button className="px-8 py-4 bg-white border-2 border-[#637D37] text-[#637D37] font-medium hover:bg-[#637D37] hover:text-white transition-all">
                  LEARN MORE
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 bg-[#637D37] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 bg-[#637D37] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                100% Authentic
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 bg-[#637D37] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Easy Returns
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative px-6 lg:pr-0 py-12 lg:py-0">
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative Background Shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#637D37]/20 to-[#637D37]/5 rounded-3xl transform rotate-3" />

              {/* Image */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12 transform -rotate-1">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/hero-stationery.png"
                    alt="Premium Stationery Collection"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="text-4xl font-light text-[#637D37] mb-1">10K+</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">Happy Customers</div>
              </div>

              <div className="absolute -top-6 -right-6 bg-[#637D37] text-white rounded-xl shadow-xl p-6">
                <div className="text-lg font-medium mb-1">Premium Quality</div>
                <div className="text-sm opacity-90">Since 2024</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900">500+</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Products</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900">4.8★</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900">50+</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Brands</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
        <div className="flex flex-col items-center gap-2 text-[#637D37] animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-[#637D37]/50" />
        </div>
      </div>
    </section>
  )
}
