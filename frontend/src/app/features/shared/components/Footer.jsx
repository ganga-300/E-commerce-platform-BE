import { Mail, Phone, MapPin, Heart, Instagram, Facebook, Twitter } from "lucide-react"
import Link from "next/link"

function ElegantFooter() {
  return (
    <footer className="bg-[#1B3022] border-t border-[#FCFBF7]/10 text-[#FCFBF7]/80">

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-[#FCFBF7] mb-6 tracking-tight">
                Study<span className="italic text-[#637D37]">Stuff</span>
              </h1>
              <p className="text-[#FCFBF7]/60 text-sm leading-relaxed font-medium">
                Elevating the art of organization. Curated instruments for the discerning scholar and creator.
              </p>
            </div>

            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-[#FCFBF7]/5 rounded-full hover:bg-[#637D37] hover:text-white transition-all duration-300 group">
                  <Icon className="w-4 h-4 text-[#FCFBF7]/60 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#FCFBF7]/40 mb-8">Collections</h3>
            <ul className="space-y-4">
              {['Stationery', 'Art Supplies', 'Office', 'Books'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/?category=${link}`}
                    className="text-sm font-medium text-[#FCFBF7]/80 hover:text-[#637D37] transition-colors duration-200 block"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#FCFBF7]/40 mb-8">Support</h3>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'FAQ', 'Returns'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                    className="text-sm font-medium text-[#FCFBF7]/80 hover:text-[#637D37] transition-colors duration-200 block"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#FCFBF7]/40 mb-8">Atelier</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <MapPin className="w-5 h-5 text-[#637D37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-serif text-[#FCFBF7] leading-relaxed">
                    124, Luxury Lane<br />Creative District, Ind 452001
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <Mail className="w-5 h-5 text-[#637D37] shrink-0" />
                <a href="mailto:concierge@studystuff.com" className="text-sm font-medium hover:text-[#637D37] transition-colors">
                  concierge@studystuff.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Bottom Bar */}
      <div className="border-t border-[#FCFBF7]/5">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#FCFBF7]/30 text-xs font-medium uppercase tracking-widest">
            © 2024 StudyStuff. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[#FCFBF7]/30 text-xs font-medium uppercase tracking-widest">Crafted with</span>
            <Heart className="w-3 h-3 text-[#637D37] fill-[#637D37]" />
            <span className="text-[#FCFBF7]/30 text-xs font-medium uppercase tracking-widest">for Creators</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ElegantFooter
