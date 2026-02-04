"use client"

import { motion } from "framer-motion"
import { Feather, ShieldCheck, Map, Clock } from "lucide-react"

export default function WhyChooseUs() {
  const features = [
    {
      icon: Feather,
      title: "Artisanal Heritage",
      description: "Every piece is selected for its connection to a rich legacy of craftsmanship and functional design.",
      number: "01",
    },
    {
      icon: ShieldCheck,
      title: "Proven Quality",
      description: "Meticulously tested for durability and performance by professionals who demand the absolute best.",
      number: "02",
    },
    {
      icon: Map,
      title: "Curated Origin",
      description: "Directly sourced from dedicated workshops and independent artisans across the subcontinent.",
      number: "03",
    },
    {
      icon: Clock,
      title: "Priority Concierge",
      description: "Experience premium white-glove shipping and support, ensuring your collection arrives in pristine state.",
      number: "04",
    },
  ]

  return (
    <section className="py-32 bg-[#FCFBF7] relative overflow-hidden">
      {/* Background Subtle Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 right-[20%] w-px h-full bg-[#1B3022]" />
        <div className="absolute top-0 right-[40%] w-px h-full bg-[#1B3022]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-[10px] font-black uppercase text-[#637D37] mb-6 block tracking-[0.4em]">
            The Heritage Standard
          </span>
          <h2 className="text-5xl font-serif text-[#1B3022] tracking-tight mb-8">
            The Philosophy of <span className="italic font-light text-[#637D37]">Quality</span>
          </h2>
          <p className="text-xl text-[#3A433E] max-w-2xl mx-auto opacity-70 leading-relaxed font-medium">
            We believe that the tools we use define the depth of our creative output.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col"
            >
              {/* Number/Icon Row */}
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#1B3022]/10 transition-colors group-hover:border-[#637D37]/30">
                <div className="w-12 h-12 bg-[#1B3022]/5 rounded-none flex items-center justify-center transition-colors group-hover:bg-[#1B3022] group-hover:text-[#FCFBF7]">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-4xl font-serif text-[#1B3022]/10 group-hover:text-[#637D37]/20 transition-colors">{feature.number}</span>
              </div>

              {/* Text */}
              <h3 className="text-xl font-serif text-[#1B3022] mb-4 group-hover:text-[#637D37] transition-colors">{feature.title}</h3>
              <p className="text-[#3A433E] leading-relaxed text-sm opacity-70 font-medium group-hover:opacity-100 transition-opacity">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
