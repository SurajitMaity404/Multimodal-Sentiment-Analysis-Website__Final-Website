import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Multimodal Sentiment Analysis?",
    answer:
      "Multimodal Sentiment Analysis combines information from text, audio, and video to accurately determine whether a person's sentiment is Positive, Negative, or Neutral. By analyzing multiple data sources simultaneously, it achieves much higher accuracy than using text alone.",
  },
  {
    question: "Which input types are supported?",
    answer:
      "Our platform supports Text, Audio, and Video inputs. You can type text, upload an audio file, or upload a video for AI-powered sentiment prediction.",
  },
  {
    question: "Does the system support multiple languages?",
    answer:
      "Yes. The platform supports multilingual sentiment analysis, enabling users to analyze sentiment in multiple languages. The AI automatically processes supported languages and provides consistent sentiment predictions.",
  },
  {
    question: "What sentiments can the AI detect?",
    answer:
      "The AI predicts three sentiment classes: Positive 😊, Negative 😞, and Neutral 😐. Depending on the trained model, confidence scores can also be displayed.",
  },
  {
    question: "How does video sentiment analysis work?",
    answer:
      "The system analyzes facial expressions from video frames, speech characteristics from audio, and spoken text using speech recognition. These modalities are fused together to generate a more reliable sentiment prediction.",
  },
  {
    question: "Can audio be analyzed separately?",
    answer:
      "Yes. Audio sentiment analysis extracts speech features such as tone, pitch, intensity, and emotional characteristics to identify the speaker's sentiment.",
  },
  {
    question: "How accurate is the AI model?",
    answer:
      "Accuracy depends on the training dataset and model architecture. Using multimodal fusion generally improves prediction performance compared to single-modality models.",
  },
  {
    question: "Which datasets were used for training?",
    answer:
      "The platform can be trained using benchmark datasets such as CMU-MOSEI, CMU-MOSI, MELD, or custom multilingual datasets for improved real-world performance.",
  },
  {
    question: "Can I use this system for real-time analysis?",
    answer:
      "Yes. The platform can analyze live text input, recorded audio, or uploaded video files. It can also be extended for real-time webcam and microphone analysis.",
  },
  {
    question: "Is my uploaded data secure?",
    answer:
      "Yes. Uploaded files are processed securely and are not permanently stored unless explicitly configured by the administrator.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#050816] overflow-hidden text-white">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-24 left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-purple-500/20 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Hero */}
        <div className="text-center mb-16">

          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 text-cyan-300">
            <HelpCircle size={18} />
            Frequently Asked Questions
          </div>

          <h1 className="mt-6 text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            FAQs
          </h1>

          <p className="mt-6 text-gray-400 max-w-3xl mx-auto text-lg">
            Learn more about our AI-powered Multimodal Sentiment Analysis
            platform that analyzes Text, Audio, and Video with multilingual
            support to deliver accurate emotion and sentiment predictions.
          </p>

        </div>

        {/* Accordion */}

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all hover:border-cyan-400"
            >

              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between px-7 py-6 text-left"
              >

                <span className="font-semibold text-lg">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />

              </button>

              {openIndex === index && (
                <div className="px-7 pb-6 text-gray-300 leading-8 border-t border-white/10">
                  <div className="pt-5">
                    {faq.answer}
                  </div>
                </div>
              )}

            </div>

          ))}

        </div>

        {/* Bottom Card */}

        <div className="mt-20 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl p-10 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Still have questions?
          </h2>

          <p className="text-gray-300 max-w-2xl mx-auto">
            Our team is here to help you understand our AI-powered
            Multimodal Sentiment Analysis platform, multilingual
            capabilities, model performance, and integration options.
          </p>

          <button className="mt-8 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 font-semibold hover:scale-105 transition-all">
            Contact Support
          </button>

        </div>

      </div>
    </div>
  );
}