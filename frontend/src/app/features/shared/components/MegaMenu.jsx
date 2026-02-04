"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Book, PenTool, Briefcase, Palette, ArrowRight } from 'lucide-react'

const categories = [
    {
        name: "Stationery",
        icon: PenTool,
        desc: "Premium pens, pencils & highlighters",
        href: "/?category=Stationery"
    },
    {
        name: "Books",
        icon: Book,
        desc: "Notebooks, journals & planners",
        href: "/?category=Books"
    },
    {
        name: "Office",
        icon: Briefcase,
        desc: "Desk organizers & files",
        href: "/?category=Office"
    },
    {
        name: "Crafts",
        icon: Palette,
        desc: "Art supplies & painting kits",
        href: "/?category=Crafts"
    }
]

export default function MegaMenu() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest transition-colors py-2
          ${isOpen ? 'text-[#637D37]' : 'text-[#1B3022]/80 hover:text-[#637D37]'}
        `}
            >
                Shop
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-[800px] pt-4 z-50"
                    >
                        <div className="bg-white border border-[#1B3022]/10 rounded-2xl shadow-[0_20px_50px_rgba(27,48,34,0.1)] overflow-hidden p-8 grid grid-cols-12 gap-8 relative">
                            {/* Decorative Top Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#637D37]" />

                            {/* Categories Column */}
                            <div className="col-span-7 space-y-6">
                                <h4 className="text-xs font-black text-[#1B3022]/40 uppercase tracking-[0.2em] px-2 mb-4">Master Collections</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={cat.href}
                                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F5F5F0] group transition-all duration-300 border border-transparent hover:border-[#1B3022]/5"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="p-3 bg-[#1B3022]/5 rounded-lg text-[#1B3022] group-hover:bg-[#1B3022] group-hover:text-[#FCFBF7] transition-all duration-300 shadow-sm">
                                                <cat.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-serif font-bold text-lg text-[#1B3022] group-hover:text-[#637D37] transition-colors mb-1">{cat.name}</div>
                                                <p className="text-xs text-[#3A433E]/70 font-medium line-clamp-1 group-hover:text-[#1B3022]/60">{cat.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Featured Column */}
                            <div className="col-span-5 bg-[#1B3022] rounded-xl p-6 flex flex-col justify-end relative overflow-hidden group shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#1B3022]/50 to-transparent z-10" />
                                <Image
                                    src="/assets/luxury_bg.png"
                                    alt="Premium Collection"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                                />
                                <div className="relative z-20 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="inline-block px-3 py-1 bg-[#637D37] text-[9px] font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-lg border border-[#FCFBF7]/20">Editor's Pick</span>
                                    <h4 className="font-serif font-bold text-2xl mb-2 text-[#FCFBF7]">Luxury Writing Instruments</h4>
                                    <p className="text-xs text-[#FCFBF7]/80 mb-6 font-medium leading-relaxed max-w-[90%]">Elevate your desk with our signature sage green collection.</p>
                                    <Link
                                        href="/?category=Stationery"
                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:gap-4 transition-all text-[#FCFBF7] group/link"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Shop Collection
                                        <ArrowRight className="w-3 h-3 group-hover/link:text-[#637D37] transition-colors" />
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
