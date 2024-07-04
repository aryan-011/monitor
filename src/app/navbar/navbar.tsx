"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <span className="text-gray-900 dark:text-gray-100 font-semibold">Home</span>
          </Link>
          <Link href="/createMonitor">
            <span className="text-gray-900 dark:text-gray-100 font-semibold">Create Monitor</span>
          </Link>
        </div>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Toggle Dark Mode
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
