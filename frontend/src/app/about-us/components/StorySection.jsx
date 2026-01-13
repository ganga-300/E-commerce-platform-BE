export default function PhilosophySection() {
  return (
    <section className="px-6 py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12">Our Philosophy</h2>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Mindful Curation",
              desc: "Every item is thoughtfully selected for its quality, design, and ability to enhance your creative process.",
              color: "primary",
            },
            {
              title: "Sustainable Beauty",
              desc: "We prioritize eco-conscious materials and timeless designs that reduce waste and inspire longevity.",
              color: "accent",
            },
            {
              title: "Tactile Experience",
              desc: "In our digital age, we celebrate the irreplaceable satisfaction of pen meeting paper.",
              color: "primary",
            },
          ].map((item, i) => (
            <div className="space-y-4" key={i}>
              <div
                className={`w-16 h-16 bg-${item.color}/10 rounded-full flex items-center justify-center mx-auto`}
              >
                <div className={`w-8 h-8 bg-${item.color} rounded-full`}></div>
              </div>
              <h3 className="font-medium text-foreground text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
