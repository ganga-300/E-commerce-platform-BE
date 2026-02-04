"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Book, PenTool, Briefcase, Palette } from 'lucide-react'

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
                className={`flex items-center gap-1 text-sm font-semibold transition-colors py-2
          ${isOpen ? 'text-primary' : 'text-muted-foreground hover:text-primary'}
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
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] pt-4 z-50"
                    >
                        <div className="bg-white/95 backdrop-blur-xl dark:bg-card/95 border border-border/50 rounded-2xl shadow-2xl overflow-hidden p-8 grid grid-cols-12 gap-8 ring-1 ring-black/5">

                            {/* Categories Column */}
                            <div className="col-span-7 space-y-6">
                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">Collections</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={cat.href}
                                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/80 group transition-all duration-300 border border-transparent hover:border-gray-100"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="p-2.5 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
                                                <cat.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</div>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{cat.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Featured Column */}
                            <div className="col-span-5 bg-muted/30 rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden group shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                <img
                                    src="/fountain-pen-collection-luxury-sage-green.jpg"
                                    alt="Premium Collection"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="relative z-20 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="inline-block px-3 py-1 bg-[#637D37] text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 shadow-lg">Editor's Pick</span>
                                    <h4 className="font-bold text-xl mb-2 font-heading leading-tight">Luxury Writing Instruments</h4>
                                    <p className="text-xs text-gray-200 mb-4 opacity-90">Elevate your desk with our sage green collection.</p>
                                    <Link
                                        href="/?category=Stationery"
                                        className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Shop Collection
                                        <span className="text-xs">→</span>
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
