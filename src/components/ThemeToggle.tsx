'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, Clock } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const buttons = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'auto' as const, icon: Clock, label: 'Auto' },
  ]

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {buttons.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-colors
            flex items-center gap-2
            ${
              theme === value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }
          `}
          aria-label={`Switch to ${label} mode`}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
