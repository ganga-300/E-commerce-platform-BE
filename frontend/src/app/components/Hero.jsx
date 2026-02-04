"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Play } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-[#020617] overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#637D37]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#637D37]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            {/* Intelligence Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8 shadow-2xl"
            >
              <Sparkles className="w-4 h-4 text-[#8baf4e]" />
              <span className="text-sm font-medium text-white/80 tracking-widest uppercase">The Intelligence Suite 2024</span>
            </motion.div>

            {/* High-Fidelity Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[0.9] mb-8 tracking-tighter">
              Aesthetics <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8baf4e] via-[#637D37] to-[#8baf4e] italic bg-[length:200%_auto] animate-gradient">
                Unlocked
              </span>
            </h1>

            <p className="text-xl text-slate-400 font-light mb-12 max-w-xl leading-relaxed">
              Experience India's most curated stationery marketplace. Engineered for high-performance learners and creative professionals.
            </p>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/#products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-[#637D37] text-white font-semibold rounded-xl overflow-hidden shadow-[0_0_30px_rgba(99,125,55,0.3)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-2">
                    EXPLORE COLLECTION
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium rounded-xl flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
                HOW IT WORKS
              </motion.button>
            </div>

            {/* Live Metrics Overlay */}
            <div className="mt-16 pt-8 border-t border-white/10 flex gap-12">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white tracking-tighter">12k+</div>
                <div className="text-xs uppercase tracking-widest text-slate-500">Active Users</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white tracking-tighter">4.9/5</div>
                <div className="text-xs uppercase tracking-widest text-slate-500">Reviews</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white tracking-tighter">24h</div>
                <div className="text-xs uppercase tracking-widest text-slate-500">Delivery</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content: Glassmorphic Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Interactive Card */}
            <div className="relative z-10 p-8 rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#637D37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2000&auto=format&fit=crop"
                  alt="Premium Collection"
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  priority
                />

                {/* Floating Intelligence Label */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-white/60 tracking-widest uppercase">Curated Series</div>
                      <div className="text-white font-medium">Premium Artist Edition</div>
                    </div>
                    <div className="px-3 py-1 bg-[#637D37] rounded-lg text-xs font-bold text-white">
                      NEW ARRIVAL
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting Decor Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#8baf4e] to-[#637D37] rounded-full blur-2xl opacity-40"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl opacity-20"
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
