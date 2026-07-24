import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setError("");
  navigate("/home");
};

  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">

      <div className="glass-card w-full max-w-md p-8">

        <p className="font-display text-4xl font-bold text-textPrimary leading-tight">
          Create Account
        </p>

        <h1 className="font-display text-5xl font-bold text-signal mt-1">
          Sign up
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-xl bg-panel border border-panelBorder px-4 py-3 outline-none focus:border-signal"
          />

          <div className="relative">

  <input
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
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

<div className="relative">

  <input
  type={showConfirmPassword ? "text" : "password"}
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => {
  setConfirmPassword(e.target.value);
  setError("");
  }}
  className="w-full rounded-xl bg-panel border border-panelBorder px-4 py-3 pr-12 outline-none focus:border-signal"
/>

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-signal transition-colors"
  >
    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>

</div>
{error && (
  <p className="text-negative text-sm mt-2">
    {error}
  </p>
)}

          <button  onClick={handleSignup}
           className="
          mx-auto
    flex
    items-center
    justify-center
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
            Create Account
          </button>

        </div>

        <p className="text-center text-textSecondary mt-8">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-signal ml-2 hover:underline"
          >
            Sign In
          </Link>

        </p>

      </div>

    </div>
  )
}