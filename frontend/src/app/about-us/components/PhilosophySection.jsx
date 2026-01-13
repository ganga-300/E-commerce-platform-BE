export default function StorySection() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Born from a passion for the tactile beauty of analog tools in our digital world, StudyStuff began as a
                simple belief: that the right stationery can transform not just how we work, but how we think.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We curate each piece with intention, seeking items that marry functionality with aesthetic grace. From
                the weight of a perfectly balanced pen to the texture of handcrafted paper, every detail matters in
                creating tools that inspire.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-px bg-primary"></div>
              <span className="text-sm font-medium text-primary tracking-wider uppercase">Since 2020</span>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3 aspect-[4/5]">
              <div className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src="/interior-design-idea-working-area-260nw-1747986791.webp"
                    alt="Sage green notebook with fountain pen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <img
                    src="/fountain-pen-collection-luxury-sage-green.jpg"
                    alt="Minimalist desk setup"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-6">
                <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <img
                    src="/classic-study-room-colour-of-cream-and-white.jpg"
                    alt="Handwritten notes on cream paper"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src="/il_fullxfull.7034356741_pcdn.webp"
                    alt="Watercolor palette in sage and earth tones"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
