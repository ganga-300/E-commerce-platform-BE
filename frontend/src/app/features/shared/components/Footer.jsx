import { Mail, Phone, MapPin, Heart } from "lucide-react"

function ElegantFooter() {
  return (
    <footer className="bg-[#0f172a] border-t border-gray-800 text-gray-300">

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 style={{ fontFamily: "TTRamillas" }} className="text-4xl font-bold text-white mb-4">
                Study<span style={{ color: "#637D37" }}>Stuff</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Gear up, geek out, and maybe even look cool — StudyStuff's got your back! Your one-stop destination for
                all academic essentials.
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="group"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#637D37] transition-all duration-300 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="h-5 w-5 text-white transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm5.5-1.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                    </svg>
                  </div>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="group"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#637D37] transition-all duration-300 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="h-5 w-5 text-white transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.77-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </div>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="group"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#637D37] transition-all duration-300 group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="h-5 w-5 text-white transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.97-2.48 9.14 9.14 0 01-2.9 1.11 4.52 4.52 0 00-7.7 4.12A12.81 12.81 0 013 4.89a4.52 4.52 0 001.4 6.03 4.48 4.48 0 01-2.05-.57v.06a4.52 4.52 0 003.62 4.43 4.5 4.5 0 01-2.04.07 4.53 4.53 0 004.22 3.13 9.07 9.07 0 01-5.61 1.93A9.37 9.37 0 012 19.54a12.85 12.85 0 006.95 2.04c8.34 0 12.91-6.91 12.91-12.91 0-.2 0-.42-.02-.63A9.22 9.22 0 0023 3z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['About Us', 'FAQs', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                    className="text-gray-400 hover:text-[#637D37] transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#637D37] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#637D37]/20 transition-colors">
                  <Phone className="w-5 h-5 text-[#637D37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call us</p>
                  <a href="tel:7067909690" className="text-gray-300 hover:text-[#637D37] transition-colors font-medium">
                    7067909690
                  </a>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#637D37]/20 transition-colors">
                  <Mail className="w-5 h-5 text-[#637D37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us</p>
                  <a
                    href="mailto:studystuff@gmail.com"
                    className="text-gray-300 hover:text-[#637D37] transition-colors font-medium"
                  >
                    studystuff@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#637D37]/20 transition-colors">
                  <MapPin className="w-5 h-5 text-[#637D37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit us</p>
                  <p className="text-gray-300 font-medium">Available Online 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest study materials and exclusive offers</p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border-none text-white focus:outline-none focus:ring-2 focus:ring-[#637D37]"
              />
              <button className="px-6 py-3 bg-[#637D37] text-white rounded-r-lg hover:bg-[#4a5a2a] transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0b1120] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm flex items-center">
              Copyright © 2024 StudyStuff. All rights reserved. Made with
              <Heart className="w-4 h-4 text-red-500 mx-1" fill="currentColor" />
              for students
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-500 hover:text-[#637D37] transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-[#637D37] transition-colors">
                Terms
              </a>
              <a href="/cookies" className="text-gray-500 hover:text-[#637D37] transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ElegantFooter
