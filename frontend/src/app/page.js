"use client"

import Hero from "./components/Hero"
import Products from "./components/ProductsSection" 
import WhyChooseUs from "./components/WhyChooseUs"
import CTASection from "./components/CTASection"

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
    
      <section className="relative w-full">
        <Hero />
      </section>

     
      <section id="products" className="w-full">
        <Products />
      </section>

      
      <section id="why-choose-us" className="w-full">
        <WhyChooseUs />
      </section>

     
      <section id="cta" className="w-full">
        <CTASection />
      </section>
    </main>
  )
}
