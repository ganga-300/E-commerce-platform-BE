"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

          {/* Left Content */}
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-20 lg:py-32">
            {/* Eyebrow */}
            <div className="mb-6">
              <span className="text-sm uppercase tracking-[0.2em] text-gray-400 font-medium">
                Premium Stationery
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 leading-[0.9] mb-8">
              Craft Your
              <span className="block mt-3 font-normal">Excellence</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 font-light mb-12 max-w-lg leading-relaxed">
              Discover thoughtfully curated essentials for students and professionals who value quality and design.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-6">
              <Link href="/#products">
                <button className="group px-10 py-4 bg-gray-900 text-white text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-3">
                  EXPLORE COLLECTION
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-12 mt-16 pt-12 border-t border-gray-200">
              <div>
                <div className="text-3xl font-light text-gray-900 mb-1">10,000+</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">Customers</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900 mb-1">500+</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">Products</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900 mb-1">4.8★</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative bg-gray-50 flex items-center justify-center p-12 lg:p-20">
            <div className="relative w-full max-w-xl aspect-square">
              <Image
                src="/artifacts/hero_stationery_image.webp"
                alt="Premium Stationery Collection"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating Text */}
            <div className="absolute bottom-16 left-12 bg-white px-8 py-6 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Starting from</div>
              <div className="text-3xl font-light text-gray-900">₹35</div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gray-300" />
        </div>
      </div>
    </section>
  )
}
