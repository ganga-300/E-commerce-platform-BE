"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Users, Package, Award, Star } from "lucide-react"

const statistics = [
    {
        id: 1,
        icon: Users,
        value: 10000,
        suffix: "+",
        label: "Happy Customers"
    },
    {
        id: 2,
        icon: Package,
        value: 500,
        suffix: "+",
        label: "Products"
    },
    {
        id: 3,
        icon: Award,
        value: 50,
        suffix: "+",
        label: "Brands"
    },
    {
        id: 4,
        icon: Star,
        value: 4.8,
        suffix: "★",
        label: "Average Rating"
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
        <span ref={ref} className="text-5xl font-light">
            {value % 1 === 0 ? count : count.toFixed(1)}{suffix}
        </span>
    )
}

export default function Statistics() {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {statistics.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                    <stat.icon className="w-8 h-8" />
                                </div>
                            </div>

                            {/* Number */}
                            <div className="mb-2">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>

                            {/* Label */}
                            <p className="text-white/60 text-sm font-medium">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
