import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Award, Users } from "lucide-react"

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
  ]

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <span className="text-sm font-medium uppercase text-muted-foreground mb-4 block tracking-[0.2em]">
            Excellence Redefined
          </span>
          <h2 className="text-6xl font-light text-foreground tracking-tight">
            Why Choose <span className="font-serif italic text-primary">StudyStuff</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            Transform your academic journey with thoughtfully designed accessories that inspire excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="group relative bg-card/60 backdrop-blur-sm border hover:shadow-xl">
              <CardContent className="p-12">
                <div className="absolute top-8 right-8 text-6xl font-light text-muted-foreground/20">
                  {feature.number}
                </div>
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-light mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
