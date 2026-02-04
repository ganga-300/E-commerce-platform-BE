"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({ error, reset }) {
    const router = useRouter()

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-8">
                        <AlertTriangle className="w-16 h-16 text-red-600" />
                    </div>

                    <h1 className="text-5xl font-black text-gray-900 mb-4">
                        Oops! Something went wrong
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        We encountered an unexpected error. Don't worry, we're on it!
                    </p>

                    {error?.message && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl max-w-lg mx-auto">
                            <p className="text-sm text-red-700 font-mono">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => reset()}
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#637D37] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>

                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold hover:border-[#637D37] hover:text-[#637D37] transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
