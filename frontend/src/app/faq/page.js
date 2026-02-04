"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle, Search } from "lucide-react"

const faqs = [
    {
        category: "Ordering & Payment",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards (Visa, Mastercard, Rupay), UPI, Net Banking, and Wallet payments via our secure payment gateway."
            },
            {
                q: "Can I cancel my order?",
                a: "Yes, you can cancel your order within 12 hours of placing it. Please contact our support team immediately. Once the order is shipped, it cannot be cancelled."
            },
            {
                q: "Do you offer Cash on Delivery (COD)?",
                a: "Currently, we only accept prepaid orders to ensure contactless and secure delivery. We are working on enabling COD for select pin codes soon."
            }
        ]
    },
    {
        category: "Shipping & Delivery",
        questions: [
            {
                q: "How long does shipping take?",
                a: "Orders usually ship within 24-48 hours. Delivery takes 3-7 business days depending on your location. Metro cities typically receive orders faster."
            },
            {
                q: "Do you ship internationally?",
                a: "At the moment, we only ship within India. We hope to expand to international locations in the future."
            },
            {
                q: "How can I track my order?",
                a: "Once your order is shipped, you will receive an SMS and Email with the tracking link. You can also view the status in your Profile > Orders section."
            }
        ]
    },
    {
        category: "Returns & Refunds",
        questions: [
            {
                q: "What is your return policy?",
                a: "We offer a 7-day return policy for damaged or incorrect items. Please record a video while unboxing to facilitate smooth returns."
            },
            {
                q: "When will I get my refund?",
                a: "Refunds are processed within 5-7 business days after the returned item reaches our warehouse and passes quality checks."
            }
        ]
    }
]

function FaqItem({ question, answer, isOpen, onClick }) {
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all hover:border-[#637D37]/50">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className="font-bold text-gray-900 text-lg">{question}</span>
                <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-[#637D37] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100/50">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState("0-0") // default open first item
    const [searchTerm, setSearchTerm] = useState("")

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0)

    return (
        <div className="min-h-screen bg-[#FDFCF8] py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                        Everything you need to know about our products and services.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#637D37]/30 focus:border-[#637D37] transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <div className="space-y-12">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-12">
                            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">No results found</h3>
                            <p className="text-gray-500">Try searching for something else.</p>
                        </div>
                    ) : (
                        filteredFaqs.map((category, catIndex) => (
                            <div key={catIndex}>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-[#637D37] rounded-full"></span>
                                    {category.category}
                                </h2>
                                <div className="space-y-4">
                                    {category.questions.map((faq, index) => {
                                        const uniqueId = `${catIndex}-${index}`
                                        return (
                                            <FaqItem
                                                key={uniqueId}
                                                question={faq.q}
                                                answer={faq.a}
                                                isOpen={openIndex === uniqueId}
                                                onClick={() => handleToggle(uniqueId)}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-20 text-center bg-gray-900 text-white rounded-3xl p-12">
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-3 bg-[#637D37] hover:bg-[#52682d] rounded-xl font-bold transition-colors"
                    >
                        Get in Touch
                    </a>
                </div>
            </div>
        </div>
    )
}
