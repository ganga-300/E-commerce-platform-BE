"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    type: "video",
    src: "/stvideo.mp4",
    title: "Your All-In-One Accessories Destination",
    subtitle: "Discover products that define your style.",
    cta: "Shop Now"
  },
  {
    type: "image",
    src: "/fountain-pen-collection-luxury-sage-green.jpg",
    title: "Elevate Your Writing Experience",
    subtitle: "Premium fountain pens for the modern professional.",
    cta: "Explore Pens"
  },
  {
    type: "image",
    src: "/artsupplies.jpg",
    title: "Create Without Limits",
    subtitle: "High-quality art supplies for your masterpiece.",
    cta: "Shop Art"
  },
  {
    type: "image",
    src: "/writingess.avif",
    title: "Designed for Productivity",
    subtitle: "Organize your life with our planner collection.",
    cta: "View Planners"
  }
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000) // Change every 6 seconds
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {slides[current].type === "video" ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
              <source src={slides[current].src} type="video/mp4" />
            </video>
          ) : (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60 transition-transform duration-[10000ms] ease-linear transform scale-105 hover:scale-110"
              style={{ backgroundImage: `url(${slides[current].src})` }}
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1
              className="text-white text-4xl md:text-7xl font-bold drop-shadow-2xl mb-4 leading-tight"
              style={{ fontFamily: "TTRamillas, serif" }}
            >
              {slides[current].title.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-2 md:mr-4">
                  {i === 1 || i === 4 ? <span className="text-[#bfd89b]">{word}</span> : word}
                </span>
              ))}
            </h1>
            <p className="text-gray-200 text-lg md:text-2xl mb-8 max-w-2xl mx-auto font-light">
              {slides[current].subtitle}
            </p>
            <button className="px-10 py-4 bg-[#637D37] hover:bg-[#52682d] text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-[#637D37]/30 border border-white/10">
              {slides[current].cta}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-20"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-20"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index ? "bg-[#637D37] w-8" : "bg-white/50 hover:bg-white"
              }`}
          />
        ))}
      </div>
    </section>
  )
}
