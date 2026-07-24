import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-lg border border-panelBorder flex items-center justify-center text-textSecondary hover:text-signal hover:border-signal/50 transition-colors"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
