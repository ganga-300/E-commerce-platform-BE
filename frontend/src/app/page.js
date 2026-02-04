"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import Hero from "./components/Hero"
import Products from "./components/ProductsSection"
import WhyChooseUs from "./components/WhyChooseUs"
import Testimonials from "./components/Testimonials"
import Statistics from "./components/Statistics"
import Newsletter from "./components/Newsletter"
import CTASection from "./components/CTASection"
import PageTransition from "@/components/PageTransition"

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()


  if (loading) return null; // Prevent flash of home content
  return (
    <PageTransition className="flex flex-col items-center justify-center w-full">

      <section className="relative w-full">
        <Hero />
      </section>


      <section id="products" className="w-full">
        <Products />
      </section>


      <section id="why-choose-us" className="w-full">
        <WhyChooseUs />
      </section>

      <section id="testimonials" className="w-full">
        <Testimonials />
      </section>

      <section id="statistics" className="w-full">
        <Statistics />
      </section>

      <section id="cta" className="w-full">
        <CTASection />
      </section>

      <section id="newsletter" className="w-full">
        <Newsletter />
      </section>
    </PageTransition>
  )
}
