import type { LucideIcon } from 'lucide-react';
import { MoonIcon, SunIcon, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';

/** Cycles system → light → dark, with the icon and label for the current step. */
export function useThemeNavigation() {
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const getThemeIcon = useCallback((): LucideIcon => {
    if (theme === 'system') return SunMoon;
    return currentTheme === 'dark' ? MoonIcon : SunIcon;
  }, [theme, currentTheme]);

  const getThemeLabel = useCallback((): string => {
    if (theme === 'system') return 'سیستم';
    return currentTheme === 'dark' ? 'تاریک' : 'روشن';
  }, [theme, currentTheme]);

  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  }, [theme, setTheme]);

  return { theme, getThemeIcon, getThemeLabel, toggleTheme };
}
