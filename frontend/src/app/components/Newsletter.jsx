"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function Newsletter() {
    const [email, setEmail] = useState("")
    const [subscribed, setSubscribed] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email")
            return
        }

        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setSubscribed(true)
            setLoading(false)
            toast.success("Thanks for subscribing!")
            setEmail("")
        }, 1000)
    }

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center">
                    {!subscribed ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-4xl font-light text-gray-900 tracking-tight mb-4">
                                    Stay Updated
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Get exclusive offers and new product updates
                                </p>
                                <p className="text-sm text-green-600 font-medium mt-2">
                                    Subscribe now and get 10% off your first order
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {loading ? "..." : "Subscribe"}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">
                                    We respect your privacy. Unsubscribe anytime.
                                </p>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12"
                        >
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-light text-gray-900 mb-2">
                                Thanks for subscribing!
                            </h3>
                            <p className="text-gray-600">
                                Check your inbox for your exclusive discount code.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    )
}
