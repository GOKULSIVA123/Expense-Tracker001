import React, { useContext } from 'react';
import { Themecontent } from '../context/Themecontext';

function ThemeToggle() {
  // 1. Get theme and setTheme from the context
  const { theme, setTheme } = useContext(Themecontent);

  // 2. Create the toggle handler
  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
    >
      {/* 3. Show the correct icon based on the current theme */}
      {theme === 'dark' ? (
        // Sun icon for dark mode (to switch to light)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Moon icon for light mode (to switch to dark)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;