"use client"

import Link from "next/link"
import { ArrowRight, Feather } from "lucide-react"
import { motion } from "framer-motion"

export default function CTASection() {
  return (
    <section className="py-32 bg-[#FCFBF7] relative overflow-hidden border-t border-[#1B3022]/5">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B3022]/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Symbolic Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <div className="w-16 h-16 bg-[#1B3022] flex items-center justify-center rounded-none shadow-2xl">
            <Feather className="w-8 h-8 text-[#FCFBF7]" />
          </div>
        </motion.div>

        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-serif text-[#1B3022] mb-10 tracking-tight leading-tight">
          Elevate Your <span className="italic font-light text-[#637D37]">Creative Process</span>
        </h2>

        {/* Heritage Description */}
        <p className="text-xl text-[#3A433E] mb-12 max-w-2xl mx-auto opacity-80 leading-relaxed font-medium">
          Join a community of professionals who believe that fine instruments are the catalyst for exceptional ideas.
        </p>

        {/* Offer Detail */}
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#637D37]/10 border border-[#637D37]/20 mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B3022]">Complimentary Atelier Shipping</span>
          <div className="w-1 h-1 bg-[#637D37] rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#637D37]">Orders Over ₹2,500</span>
        </div>

        {/* Action Group */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link href="/#products">
            <motion.button
              whileHover={{ y: -4, shadow: "0 20px 40px rgba(27, 48, 34, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-5 bg-[#1B3022] text-[#FCFBF7] font-serif text-lg flex items-center gap-3 transition-all"
            >
              Begin Your Collection
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/about" className="text-[#1B3022] font-black uppercase text-[10px] tracking-[0.3em] border-b-2 border-[#1B3022] pb-1 hover:text-[#637D37] hover:border-[#637D37] transition-all">
            The Atelier Story
          </Link>
        </div>
      </div>
    </section>
  )
}
