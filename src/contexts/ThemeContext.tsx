'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('auto')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) {
      setThemeState(saved)
    }
  }, [])

  // Calculate resolved theme based on theme setting
  useEffect(() => {
    if (theme === 'auto') {
      // KST-based auto mode: 18:00-06:00 dark, otherwise light
      const updateAutoTheme = () => {
        const now = new Date()
        const kstOffset = 9 * 60 // KST is UTC+9
        const kstTime = new Date(now.getTime() + (kstOffset + now.getTimezoneOffset()) * 60 * 1000)
        const hour = kstTime.getHours()

        const isDark = hour >= 18 || hour < 6
        setResolvedTheme(isDark ? 'dark' : 'light')
      }

      updateAutoTheme()

      // Update every minute to catch time changes
      const interval = setInterval(updateAutoTheme, 60000)
      return () => clearInterval(interval)
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

  // Apply theme class to html element
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
