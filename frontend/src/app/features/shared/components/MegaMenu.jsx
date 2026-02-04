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
                        className="absolute top-full left-0 w-[600px] -translate-x-1/4 pt-4 z-50"
                    >
                        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-xl overflow-hidden p-6 grid grid-cols-2 gap-6">

                            {/* Categories Column */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Categories</h4>
                                <div className="grid gap-2">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={cat.href}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted group transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="p-2 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <cat.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</div>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{cat.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Featured Column */}
                            <div className="bg-muted/50 rounded-xl p-4 flex flex-col justify-end relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src="/main-image.avif"
                                    alt="Featured Collection"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="relative z-20 text-white">
                                    <h4 className="font-bold text-lg mb-1">New Arrivals</h4>
                                    <p className="text-xs text-gray-200 mb-3">Check out our latest premium collection.</p>
                                    <Link
                                        href="/?sort=newest"
                                        className="inline-block px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Shop Now
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
