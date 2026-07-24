import { Mail, Phone, MapPin, Send, Github, Linkedin, Globe } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[180px]" />
    </div>

      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Contact Us
          </h1>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions, ideas, or collaboration opportunities?
            We'd love to hear from you. Send us a message and we'll respond
            as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Left Side */}
          <div className="space-y-8">

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-cyan-400 transition-all">

              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-cyan-500/20">
                  <Mail className="text-cyan-400" size={28} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Email</h3>
                  <p className="text-gray-400">
                    support@signalis.ai
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-purple-400 transition-all">

              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-purple-500/20">
                  <Phone className="text-purple-400" size={28}/>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Phone</h3>
                  <p className="text-gray-400">
                    +91 98765 43210
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-pink-400 transition-all">

              <div className="flex items-center gap-4">

                <div className="p-4 rounded-xl bg-pink-500/20">
                  <MapPin className="text-pink-400" size={28}/>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Office
                  </h3>

                  <p className="text-gray-400">
                    Kolkata, West Bengal, India
                  </p>
                </div>

              </div>

            </div>

            {/* Socials */}

            <div className="flex gap-4 pt-5">

              <a
                href="#"
                className="p-4 rounded-xl bg-white/10 hover:bg-cyan-500 transition"
              >
                <Github />
              </a>

              <a
                href="#"
                className="p-4 rounded-xl bg-white/10 hover:bg-blue-500 transition"
              >
                <Linkedin />
              </a>

              <a
                href="#"
                className="p-4 rounded-xl bg-white/10 hover:bg-purple-500 transition"
              >
                <Globe />
              </a>

            </div>

          </div>

          {/* Contact Form */}

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Send Message
            </h2>

            <form className="space-y-6">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl bg-white/10 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl bg-white/10 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-xl bg-white/10 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400"
              />

              <textarea
                rows="6"
                placeholder="Your Message..."
                className="w-full rounded-xl bg-white/10 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400 resize-none"
              />

              <button
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 py-4 text-lg font-semibold hover:scale-[1.02] transition-all"
              >
                <Send size={20}/>
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}