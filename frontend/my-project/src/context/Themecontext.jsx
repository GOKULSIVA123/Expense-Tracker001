import { createContext, useEffect, useState } from "react";
export const Themecontent = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or OS preference
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      if (localStorage.theme === "light" || localStorage.theme === "dark") {
        return localStorage.theme;
      }
      // If not set, use OS preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Update <html> class and localStorage when theme changes
  useEffect(() => {
    // Toggle "dark" class based on theme
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.theme = theme;
  }, [theme]);

  // Optional: Reset to OS preference
  const resetTheme = () => {
    localStorage.removeItem("theme");
    setTheme(getInitialTheme());
  };

  return (
    <Themecontent.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </Themecontent.Provider>
  );
};
