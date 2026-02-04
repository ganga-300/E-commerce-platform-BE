"use client"
import Link from "next/link"
import { ArrowRight, Sparkles, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">India's Premium Stationery Store</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 leading-[0.95] tracking-tight">
              Elevate Your
              <span className="block mt-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent font-normal">
                Study Space
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-lg leading-relaxed">
              Discover thoughtfully curated stationery and essentials designed for students and professionals who demand excellence.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-light text-gray-900">10,000+</div>
                <div className="text-sm text-gray-500">Happy Students</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Premium Products</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-3xl font-light text-gray-900">4.8</div>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mb-1" />
                <div className="text-sm text-gray-500 ml-2">Rated</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/#products">
                <button className="group px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/#why-choose-us">
                <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-all border border-gray-200 shadow-sm">
                  Why Choose Us
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Easy Returns
              </div>
            </div>
          </div>

          {/* Right Visual - Product Showcase */}
          <div className="relative lg:ml-auto">
            {/* Main Product Image Container */}
            <div className="relative">
              {/* Background Card Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl transform rotate-3 scale-105" />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 rounded-3xl transform -rotate-2 scale-105" />

              {/* Main Product Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Notebook */}
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center p-6 hover:scale-105 transition-transform">
                    <div className="text-center">
                      <div className="w-20 h-24 mx-auto bg-blue-900 rounded-sm mb-3 shadow-lg" />
                      <div className="text-sm font-medium text-gray-700">Premium Notebooks</div>
                    </div>
                  </div>

                  {/* Pens */}
                  <div className="aspect-square bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center p-6 hover:scale-105 transition-transform">
                    <div className="text-center">
                      <div className="flex gap-2 justify-center mb-3">
                        <div className="w-3 h-20 bg-purple-900 rounded-full shadow-lg" />
                        <div className="w-3 h-20 bg-purple-700 rounded-full shadow-lg" />
                        <div className="w-3 h-20 bg-purple-500 rounded-full shadow-lg" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">Luxury Pens</div>
                    </div>
                  </div>

                  {/* Art Supplies */}
                  <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl flex items-center justify-center p-6 hover:scale-105 transition-transform">
                    <div className="text-center">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="w-6 h-16 bg-red-500 rounded-sm shadow-lg" />
                        <div className="w-6 h-16 bg-yellow-500 rounded-sm shadow-lg" />
                        <div className="w-6 h-16 bg-green-500 rounded-sm shadow-lg" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">Art Supplies</div>
                    </div>
                  </div>

                  {/* Office */}
                  <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center p-6 hover:scale-105 transition-transform">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-green-900 rounded-lg mb-3 shadow-lg flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="w-2 h-2 bg-white rounded-full" />
                          <div className="w-2 h-2 bg-white rounded-full" />
                          <div className="w-2 h-2 bg-white rounded-full" />
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">Office Essentials</div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg transform rotate-12">
                  <div className="text-sm font-bold">500+ Products</div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-red-500 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
