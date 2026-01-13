export default function VisionSection() {
  return (
    <>
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[5/4] bg-accent/5 rounded-lg overflow-hidden">
                <img
                  src="/elegant-stationery-flat-lay-with-sage-green-theme-.jpg"
                  alt="Premium stationery arrangement"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full"></div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">What Drives Us</h2>

              <div className="space-y-6">
                {[
                  {
                    title: "Quality Over Quantity",
                    desc: "We believe in offering fewer, better things. Each product earns its place through exceptional craftsmanship and enduring design.",
                    color: "primary",
                  },
                  {
                    title: "Inspiring Creativity",
                    desc: "Beautiful tools inspire beautiful work. We seek items that spark joy and encourage the creative process.",
                    color: "accent",
                  },
                  {
                    title: "Thoughtful Design",
                    desc: "Every detail matters, from packaging to product. We celebrate design that is both functional and emotionally resonant.",
                    color: "primary",
                  },
                ].map((item, i) => (
                  <div className="flex gap-4" key={i}>
                    <div className={`w-2 h-2 bg-${item.color} rounded-full mt-3 flex-shrink-0`}></div>
                    <div>
                      <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24 bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
            Ready to elevate your workspace?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our carefully curated collection of premium stationery designed to inspire your best work.
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
            Explore Collection
          </button>
        </div>
      </section>
    </>
  )
}
