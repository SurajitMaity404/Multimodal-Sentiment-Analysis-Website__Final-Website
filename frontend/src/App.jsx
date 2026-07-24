import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AnimatedBackground from './components/AnimatedBackground'
import Home from './pages/Home'
import DashBoard from './pages/DashBoard'
import TextAnalysis from './pages/TextAnalysis'
import AudioAnalysis from './pages/AudioAnalysis'
import VideoAnalysis from './pages/VideoAnalysis'

import Login from './pages/Login'
import Signup from './pages/Signup'

import AboutUs from './pages/AboutUs'
import FAQs from './pages/FAQs'
import ContactUs from './pages/ContactUs'

// Import Chatbot Button
import ChatbotButton from "./components/ChatbotButton";

export default function App() {
  return (
    <div className="min-h-screen text-textPrimary font-body relative">

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navbar */}
      <Navbar />

      {/* Website Pages */}
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/text" element={<TextAnalysis />} />
        <Route path="/audio" element={<AudioAnalysis />} />
        <Route path="/video" element={<VideoAnalysis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>

      {/* Floating AI Chatbot Button */}
      <ChatbotButton />

    </div>
  );
}