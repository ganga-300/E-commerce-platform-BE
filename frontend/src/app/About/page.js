import HeroSection from "../AboutUs/components/HeroSection"
import StorySection from "../AboutUs/components/StorySection"
import PhilosophySection from "../AboutUs/components/PhilosophySection"
import VisionSection from "../AboutUs/components/VisionSection"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <StorySection />
      <PhilosophySection />
      <VisionSection />
    </main>
  )
}
