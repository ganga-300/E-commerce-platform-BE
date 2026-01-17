import HeroSection from "../about-us/components/HeroSection"
import StorySection from "../about-us/components/StorySection"
import PhilosophySection from "../about-us/components/PhilosophySection"
import VisionSection from "../about-us/components/VisionSection"

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
