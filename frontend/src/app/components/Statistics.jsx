"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Users, Package, MapPin, Feather } from "lucide-react"

const statistics = [
    {
        id: 1,
        icon: Users,
        value: 12400,
        suffix: "+",
        label: "Discerning Clients"
    },
    {
        id: 2,
        icon: Package,
        value: 850,
        suffix: "+",
        label: "Masterpiece Artifacts"
    },
    {
        id: 3,
        icon: MapPin,
        value: 18,
        suffix: "",
        label: "Artisan Regions"
    },
    {
        id: 4,
        icon: Feather,
        value: 100,
        suffix: "%",
        label: "Handcrafted Origin"
    }
]

function Counter({ value, suffix }) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true)

                    const duration = 2000
                    const steps = 60
                    const increment = value / steps
                    let current = 0

                    const timer = setInterval(() => {
                        current += increment
                        if (current >= value) {
                            setCount(value)
                            clearInterval(timer)
                        } else {
                            setCount(Math.floor(current))
                        }
                    }, duration / steps)

                    return () => clearInterval(timer)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [value, hasAnimated])

    return (
        <span ref={ref} className="text-6xl font-serif text-[#FCFBF7]">
            {value % 1 === 0 ? count.toLocaleString() : count.toFixed(1)}{suffix}
        </span>
    )
}

export default function Statistics() {
    return (
        <section className="py-32 bg-[#1B3022] relative overflow-hidden">
            {/* Elegant Background Decor */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#FCFBF7_1px,transparent_1px)] bg-[length:48px_48px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
                    {statistics.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Icon Detail */}
                            <div className="mb-8 p-4 bg-[#FCFBF7]/5 border border-[#FCFBF7]/10 rounded-full flex items-center justify-center text-[#637D37]">
                                <stat.icon className="w-6 h-6" />
                            </div>

                            {/* Counter Value */}
                            <div className="mb-4">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>

                            {/* Refined Label */}
                            <p className="text-[#FCFBF7]/40 text-[10px] font-black uppercase tracking-[0.3em] font-serif">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
