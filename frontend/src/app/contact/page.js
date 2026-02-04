"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from "lucide-react"

export default function ContactPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setLoading(false)
        setSuccess(true)
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] py-12 px-6 lg:px-12 flex items-center justify-center">
            <div className="max-w-7xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
                        We'd Love to Hear from You
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Whether you have a question about our products, need help with an order, or just want to say hello.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-[#637D37]/10 rounded-xl flex items-center justify-center mb-6">
                                <Mail className="w-6 h-6 text-[#637D37]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                            <p className="text-gray-500 mb-4">
                                Our team is here to help. Reach out anytime.
                            </p>
                            <a href="mailto:support@studystuff.com" className="text-[#637D37] font-bold hover:underline">
                                support@studystuff.com
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-[#637D37]/10 rounded-xl flex items-center justify-center mb-6">
                                <Phone className="w-6 h-6 text-[#637D37]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                            <p className="text-gray-500 mb-4">
                                Mon-Fri from 8am to 5pm.
                            </p>
                            <a href="tel:+15550000000" className="text-[#637D37] font-bold hover:underline">
                                +1 (555) 000-0000
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-[#637D37]/10 rounded-xl flex items-center justify-center mb-6">
                                <MapPin className="w-6 h-6 text-[#637D37]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                            <p className="text-gray-500 mb-4">
                                Come say hello at our studio.
                            </p>
                            <p className="text-gray-900 font-medium">
                                123 Stationery Lane,<br />
                                Bandra West, Mumbai 400050
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>

                        {success ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                                <p className="text-gray-500 mt-2">We'll get back to you as soon as possible.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 text-[#637D37] font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all" placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all" placeholder="jane@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Message</label>
                                    <textarea required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all resize-none" placeholder="How can we help you?" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-[#637D37] transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        <>
                                            Send Message <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
