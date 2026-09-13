import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'bright' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  isBright: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'bright',
  isBright: true,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('bright');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'bright' ? 'dark' : 'bright'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#070b14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-100 text-slate-800 antialiased selection:bg-sky-500/30 selection:text-sky-800';
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isBright: theme === 'bright', setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
