"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Feather, Sparkles, Scroll } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Parallax offsets for floating elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 15])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-5, 10])

  return (
    <section ref={containerRef} className="relative min-h-[110vh] flex items-center justify-center bg-[#FCFBF7] overflow-hidden">
      {/* Editorial Background Detail */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#1B3022]/[0.02] via-transparent to-[#637D37]/[0.02] rotate-12" />
        <div className="absolute top-20 left-20 w-px h-[80vh] bg-[#1B3022]/10" />
        <div className="absolute top-20 right-20 w-px h-[80vh] bg-[#1B3022]/10" />
      </div>

      {/* Floating 3D Elements Area */}
      <div className="absolute inset-0 z-0">
        {/* Top Left: Floating Pen */}
        <motion.div
          style={{ y: y1, rotate: rotate1 }}
          className="absolute top-[15%] left-[10%] w-[300px] h-[300px] opacity-90 transition-all duration-75"
        >
          <Image
            src="/assets/luxury_pen.png"
            alt="Handcrafted Pen"
            fill
            className="object-contain drop-shadow-[20px_40px_60px_rgba(27,48,34,0.15)]"
          />
        </motion.div>

        {/* Bottom Right: Ink Bottle */}
        <motion.div
          style={{ y: y3, rotate: rotate2 }}
          className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] opacity-80"
        >
          <Image
            src="/assets/luxury_ink.png"
            alt="Bespoke Ink"
            fill
            className="object-contain drop-shadow-[40px_40px_80px_rgba(27,48,34,0.2)]"
          />
        </motion.div>

        {/* Top Right: Decorative Swirl/Detail */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[20%] right-[15%] flex flex-col items-center gap-4 text-[#1B3022]/20"
        >
          <Scroll className="w-12 h-12" />
          <div className="w-px h-32 bg-current" />
        </motion.div>
      </div>

      {/* Centered Editorial Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-4 px-6 py-2 bg-[#1B3022] text-[#FCFBF7] text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              India's Premier Stationery Marketplace
            </motion.div>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif text-[#1B3022] leading-[1] mb-8 tracking-tight">
            Curated Stationery <br />
            <span className="italic font-light text-[#637D37] md:ml-12">& Art Supplies</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#3A433E] font-sans font-light leading-relaxed max-w-4xl mx-auto mb-10 opacity-90">
            Shop the finest collection of <span className="font-serif text-3xl md:text-4xl text-[#1B3022] italic">Notebooks</span>, <span className="font-serif text-3xl md:text-4xl text-[#1B3022] italic">High-Performance Pens</span>, and <span className="font-serif text-3xl md:text-4xl text-[#1B3022] italic">Professional Craft Materials</span>.
            <span className="block mt-6 text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#1B3022]/60">Designed for students, artists, and creators</span>
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12 opacity-60">
            {["Premium Notebooks", "Fine Writing", "Art Essentials", "Office Gear", "Craft Kits"].map((item, i) => (
              <span key={i} className="px-3 py-1 border border-[#1B3022]/20 rounded-full text-[10px] uppercase tracking-widest text-[#1B3022] font-bold">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-10 items-center justify-center">
            <Link href="/#products">
              <motion.button
                whileHover={{ scale: 1.05, shadow: "0 30px 60px rgba(27,48,34,0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="px-14 py-6 bg-[#1B3022] text-[#FCFBF7] font-serif text-xl border border-[#1B3022] transition-all group"
              >
                Explore The Collection
              </motion.button>
            </Link>

            <Link href="/about" className="group flex items-center gap-4 text-[#1B3022] font-black uppercase text-[10px] tracking-[0.3em] transition-all">
              <span className="border-b border-[#1B3022] pb-1 group-hover:border-[#637D37] group-hover:text-[#637D37]">Our Craftsmanship</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Vertical Text Side Detail */}
        <div className="hidden lg:block absolute left-[-10%] top-1/2 -rotate-90 origin-center text-[10px] font-black uppercase tracking-[0.5em] text-[#1B3022]/20">
          The Discerning Collector • Edition No. 04
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1B3022]/40">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#1B3022]/40 to-transparent" />
      </motion.div>
    </section>
  )
}
