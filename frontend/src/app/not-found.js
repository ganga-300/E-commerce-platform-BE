"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Search, ShoppingBag, AlertCircle } from "lucide-react"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6 py-12">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-[#637D37]/10 rounded-full mb-8">
                        <AlertCircle className="w-16 h-16 text-[#637D37]" />
                    </div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-9xl font-black text-gray-900 mb-4"
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-gray-800 mb-4"
                    >
                        Page Not Found
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-600 mb-12 max-w-md mx-auto"
                    >
                        Oops! The page you're looking for seems to have wandered off.
                        Let's get you back on track.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => router.push("/")}
                        className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#637D37] text-white rounded-xl font-bold shadow-lg shadow-[#637D37]/20 hover:shadow-xl hover:shadow-[#637D37]/30 hover:-translate-y-0.5 transition-all"
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Go Home
                    </button>

                    <button
                        onClick={() => router.push("/search")}
                        className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold hover:border-[#637D37] hover:text-[#637D37] hover:shadow-lg transition-all"
                    >
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Search Products
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 pt-12 border-t border-gray-200"
                >
                    <p className="text-sm text-gray-500 mb-6">Popular Categories</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {["Notebooks", "Pens", "Art Supplies", "Office Essentials"].map((category) => (
                            <button
                                key={category}
                                onClick={() => router.push(`/?category=${category}`)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-[#637D37] hover:text-white transition-all"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
