import {
  Brain,
  Languages,
  FileText,
  Mic,
  Video,
  Users,
  ShieldCheck,
  Sparkles,
  Target,
  Rocket,
} from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: <FileText size={30} />,
      title: "Text Analysis",
      desc: "Analyze multilingual text and identify Positive, Negative, or Neutral sentiment using advanced NLP models.",
    },
    {
      icon: <Mic size={30} />,
      title: "Audio Analysis",
      desc: "Detect emotions from speech using acoustic features such as tone, pitch, rhythm, and intensity.",
    },
    {
      icon: <Video size={30} />,
      title: "Video Analysis",
      desc: "Combine facial expressions, speech, and spoken language to provide highly accurate sentiment predictions.",
    },
    {
      icon: <Languages size={30} />,
      title: "Multilingual AI",
      desc: "Support for multiple languages, enabling users from different regions to analyze sentiment effortlessly.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-16 left-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-500/20 blur-[160px]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Hero */}
        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-cyan-300">
            <Sparkles size={18} />
            About Signalis
          </div>

          <h1 className="mt-6 text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Empowering Emotion Intelligence with AI
          </h1>

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-9 text-gray-300">
            <span className="font-semibold text-cyan-400">Signalis</span> is an
            AI-powered <span className="font-semibold">Multimodal Sentiment Analysis Platform</span>
            developed to understand human emotions from
            <span className="text-cyan-300"> Text</span>,
            <span className="text-purple-300"> Audio</span>, and
            <span className="text-pink-300"> Video</span>.
            By combining multiple modalities, our platform delivers more accurate,
            context-aware, and multilingual sentiment predictions for research,
            business intelligence, customer feedback analysis, education, and healthcare.
          </p>

        </div>

        {/* Mission & Vision */}

        <div className="grid lg:grid-cols-2 gap-8 mt-20">

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400 transition">

            <Target className="text-cyan-400 mb-4" size={40} />

            <h2 className="text-3xl font-bold mb-4">
              Our Mission
            </h2>

            <p className="text-gray-300 leading-8">
              Our mission is to bridge the communication gap between humans and
              artificial intelligence by enabling machines to understand emotions
              expressed through language, voice, and facial expressions.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-purple-400 transition">

            <Rocket className="text-purple-400 mb-4" size={40} />

            <h2 className="text-3xl font-bold mb-4">
              Our Vision
            </h2>

            <p className="text-gray-300 leading-8">
              We envision a future where AI can interpret emotions naturally,
              helping businesses, educators, researchers, and healthcare
              professionals make smarter, more empathetic decisions.
            </p>

          </div>

        </div>

        {/* Features */}

        <div className="mt-24">

          <h2 className="text-4xl font-bold text-center mb-14">
            Platform Capabilities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center hover:-translate-y-2 hover:border-cyan-400 transition-all duration-300"
              >

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-400 leading-7">
                  {item.desc}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* Why Choose */}

        <div className="mt-24 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl p-10">

          <div className="flex items-center gap-4 mb-6">
            <Brain className="text-cyan-400" size={40} />
            <h2 className="text-4xl font-bold">
              Why Choose Signalis?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-gray-300">

            <div className="space-y-4">
              <p>✔ AI-powered multimodal sentiment analysis.</p>
              <p>✔ Text, Audio & Video understanding.</p>
              <p>✔ Multilingual language support.</p>
              <p>✔ Fast and accurate predictions.</p>
            </div>

            <div className="space-y-4">
              <p>✔ Modern responsive interface.</p>
              <p>✔ Secure and privacy-focused.</p>
              <p>✔ Easy integration with future AI services.</p>
              <p>✔ Designed for research and real-world applications.</p>
            </div>

          </div>

        </div>

        {/* Team */}

        <div className="mt-24 text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-12">

          <Users className="mx-auto text-cyan-400 mb-6" size={55} />

          <h2 className="text-4xl font-bold">
            Meet Our Team
          </h2>

          <h3 className="mt-6 text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            FinalFrame
          </h3>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-gray-300">
            <strong>FinalFrame</strong> is a passionate team dedicated to
            developing innovative Artificial Intelligence solutions.
            Our goal is to create intelligent systems that understand human
            emotions through multimodal learning and provide meaningful insights
            for real-world applications.
          </p>

        </div>

      </div>
    </div>
  );
}