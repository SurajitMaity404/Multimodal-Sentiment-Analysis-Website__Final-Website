import { useState } from 'react'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Basic',
    tagline: 'Best for personal use.',
    monthly: 0,
    annually: 0,
    highlight: false,
    features: ['50 analyses / month', 'Text sentiment', 'Community support'],
  },
  {
    name: 'Enterprise',
    tagline: 'For large teams & corporations.',
    monthly: 20,
    annually: 16,
    highlight: true,
    features: ['Unlimited analyses', 'Text, audio & video', 'Sarcasm detection', 'Priority support'],
  },
  {
    name: 'Business',
    tagline: 'Best for business owners.',
    monthly: 120,
    annually: 96,
    highlight: false,
    features: ['Everything in Enterprise', 'Team seats', 'API access', 'Dedicated onboarding'],
  },
]

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal mb-3">Plans</p>
        <h2 className="font-display text-3xl font-semibold">Bring your analysis to the best scale</h2>
        <p className="text-textSecondary mt-3 max-w-md mx-auto">
          Select the plan that fits, or customize your subscription for a seamless fit.
        </p>

        <div className="inline-flex items-center gap-1 mt-6 p-1 rounded-full border border-panelBorder bg-panel/60">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-mono transition-colors ${
              !annual ? 'bg-signal text-ink' : 'text-textSecondary'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-mono transition-colors ${
              annual ? 'bg-signal text-ink' : 'text-textSecondary'
            }`}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const price = annual ? plan.annually : plan.monthly
          return (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col transition-all ${
                plan.highlight
                  ? 'border-signal/50 bg-panel shadow-[0_0_50px_-16px_rgb(var(--color-signal)/0.5)] md:-translate-y-2'
                  : 'border-panelBorder bg-panel/60'
              }`}
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center border ${
                  plan.highlight ? 'border-signal bg-signal/10' : 'border-panelBorder'
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${plan.highlight ? 'bg-signal' : 'bg-textSecondary'}`} />
              </div>

              <h3 className="font-display text-xl font-semibold mt-4">{plan.name}</h3>
              <p className="text-textSecondary text-sm mt-1">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                {price === 0 ? (
                  <span className="font-display text-4xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="font-display text-4xl font-bold">${price}</span>
                    <span className="text-textSecondary text-sm">/ per month</span>
                  </>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-textSecondary">
                    <Check size={14} className="text-signal shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  plan.highlight
                    ? 'bg-signal text-ink hover:brightness-110'
                    : 'border border-panelBorder text-textPrimary hover:border-signal/50'
                }`}
              >
                Get Started
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
