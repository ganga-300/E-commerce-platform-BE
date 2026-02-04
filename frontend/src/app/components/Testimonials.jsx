"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Engineering Student, IIT Delhi",
        image: "/testimonials/avatar1.jpg",
        rating: 5,
        text: "The quality of notebooks and pens here is exceptional. Perfect for my engineering diagrams and notes. Highly recommend!"
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "MBA Student, IIM Bangalore",
        image: "/testimonials/avatar2.jpg",
        rating: 5,
        text: "Fast delivery and premium products. The leather-bound notebooks are my favorite for case study notes."
    },
    {
        id: 3,
        name: "Anjali Patel",
        role: "Medical Student, AIIMS",
        image: "/testimonials/avatar3.jpg",
        rating: 4,
        text: "Great collection of study materials. The highlighters and markers are perfect for my anatomy textbooks."
    },
    {
        id: 4,
        name: "Arjun Singh",
        role: "Design Student, NID",
        image: "/testimonials/avatar4.jpg",
        rating: 5,
        text: "As an artist, I'm very particular about quality. StudyStuff has the best sketchbooks and art supplies!"
    },
    {
        id: 5,
        name: "Sneha Reddy",
        role: "CA Aspirant",
        image: "/testimonials/avatar5.jpg",
        rating: 5,
        text: "Been ordering from here for 2 years. Consistent quality and excellent customer service."
    },
    {
        id: 6,
        name: "Vikram Kumar",
        role: "Law Student, NLU Delhi",
        image: "/testimonials/avatar6.jpg",
        rating: 4,
        text: "The premium pens write so smoothly. Perfect for long hours of note-taking during lectures."
    }
]

export default function Testimonials() {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-light text-gray-900 tracking-tight mb-4">
                        What Students Say
                    </h2>
                    <p className="text-lg text-gray-600">
                        Join thousands of satisfied customers
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-8 h-8 text-gray-200 mb-4" />

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < testimonial.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 italic mb-6 leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
