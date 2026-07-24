import { NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/home', label: 'Home' },
]

function SignalMark() {
  return (
    <div className="flex items-end gap-[3px] h-4">
      <span className="w-[3px] bg-signal rounded-full animate-scan1 h-full origin-bottom" />
      <span className="w-[3px] bg-signal rounded-full animate-scan2 h-full origin-bottom" />
      <span className="w-[3px] bg-signal rounded-full animate-scan3 h-full origin-bottom" />
      <span className="w-[3px] bg-signal rounded-full animate-scan4 h-full origin-bottom" />
      <span className="w-[3px] bg-signal rounded-full animate-scan5 h-full origin-bottom" />
    </div>
  )
}

export default function Navbar() {
  const location = useLocation();

  const hideNav = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/home",
  ].includes(location.pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-panelBorder bg-ink/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SignalMark />
          <span className="font-display font-semibold text-lg tracking-tight">
            Signal<span className="text-signal">is</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!hideNav && (
            <nav className="flex items-center gap-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all ${
                      isActive
                        ? 'bg-panel text-signal'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-panel/60'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}