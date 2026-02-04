"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Award, Users, Truck } from "lucide-react"

export default function WhyChooseUs() {
  const features = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description:
        "Meticulously curated study accessories designed to enhance your learning experience and academic performance.",
      number: "01",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Exceptional craftsmanship meets functional design. Every product undergoes rigorous quality testing.",
      number: "02",
    },
    {
      icon: Users,
      title: "Student Community",
      description: "Join a thriving community of ambitious students who trust StudyStuff for their academic journey.",
      number: "03",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping across India. Track your order every step of the way.",
      number: "04",
    },
  ]

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium uppercase text-gray-500 mb-4 block tracking-widest">
            Excellence Redefined
          </span>
          <h2 className="text-4xl font-light text-gray-900 tracking-tight">
            Why Choose <span className="font-normal text-gray-900">StudyStuff</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Transform your academic journey with thoughtfully designed accessories that inspire excellence.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative bg-white hover:shadow-xl transition-all duration-500 border-gray-100 h-full">
                <CardContent className="p-8">
                  {/* Number */}
                  <div className="absolute top-6 right-6 text-5xl font-light text-gray-100 group-hover:text-gray-200 transition-colors">
                    {feature.number}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-6"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center transition-all duration-300">
                      <feature.icon className="w-7 h-7 text-gray-900 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-medium mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
