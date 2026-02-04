"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Feather, PenTool, BookOpen, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/classic-study-room-colour-of-cream-and-white.jpg"
          alt="Our Studio"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6">
            Crafting <span className="text-[#bfd89b]">Inspiration</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            We believe that the tools you use shape the work you create.
            Our mission is to provide premium stationery that elevates your daily rituals.
          </p>
        </motion.div>
      </div>

      {/* Our Story */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl font-bold font-heading text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                It started with a simple notebook. A place to capture fleeting thoughts,
                ambitious diagrams, and quiet reflections. We realized that the tactile experience
                of writing has the power to slow down time and clarify the mind.
              </p>
              <p>
                Founded in 2024, StudyStuff was born from a desire to curtail the digital noise
                and return to the essentials. We curate objects that are not just functional,
                but beautiful—tools that you'll cherish for a lifetime.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/fountain-pen-collection-luxury-sage-green.jpg"
              alt="Premium Pens"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-900 text-white py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-heading text-center mb-16"
          >
            Our Core Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: PenTool,
                title: "Craftsmanship",
                desc: "We partner with artisans who take pride in every detail, ensuring quality that lasts."
              },
              {
                icon: BookOpen,
                title: "Thoughtfulness",
                desc: "Design should serve a purpose. Every product is selected to enhance your workflow."
              },
              {
                icon: Heart,
                title: "Community",
                desc: "We support a community of creators, thinkers, and dreamers who value the written word."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#637D37] rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
