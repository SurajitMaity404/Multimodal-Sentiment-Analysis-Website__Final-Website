import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import PricingSection from "../components/PricingSection"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)] flex flex-col items-center px-6 py-16 gap-20">

      <div className="glass-card w-full max-w-md p-8">

        <p className="font-display text-4xl font-bold text-textPrimary leading-tight">
          Welcome Back
        </p>

        <h1 className="font-display text-5xl font-bold text-signal mt-1">
          to Signalis
        </h1>

        <div className="space-y-5 mt-8">

          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-xl bg-panel border border-panelBorder px-4 py-3 outline-none focus:border-signal"
          />

          <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full rounded-xl bg-panel border border-panelBorder px-4 py-3 pr-12 outline-none focus:border-signal"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-signal transition-colors"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>

</div>

          <button className="
          mx-auto
    flex
    items-center
    justify-center
    w-full
    px-8
    py-3
    rounded-xl
    bg-signal/15
    border
    border-signal/40
    text-signal
    font-medium
    transition-all
    duration-300
    hover:bg-signal
    hover:text-ink
    hover:border-signal
    hover:shadow-[0_0_20px_rgb(var(--color-signal)/0.3)]
          ">
            Sign In
          </button>

        </div>

        <div className="flex justify-center items-center gap-3 mt-8 text-sm">
  <Link
    to="/forgot-password"
    className="text-textSecondary hover:text-signal transition-colors"
  >
    Forgot Password?
  </Link>

  <Link
    to="/signup"
    className="text-signal hover:underline underline-offset-4 transition-colors"
  >
    Create Account
  </Link>
</div>

      </div>

      <PricingSection />

    </div>
  )
}
