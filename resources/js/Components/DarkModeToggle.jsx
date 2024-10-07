import { IconMoon, IconSun } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button onClick={toggleDarkMode}>
      <div className="flex">
        <div className={`p-1 rounded-tl-lg rounded-bl-lg ${!darkMode ? 'bg-gray-200' : 'bg-zinc-500 dark:bg-zinc-900'} transition-all`}>
          <IconSun />
        </div>
        <div className={`p-1 rounded-tr-lg rounded-br-lg ${darkMode ? 'bg-gray-200 text-zinc-900' : 'bg-zinc-500 dark:bg-zinc-900'} transition-all`}>
          <IconMoon />
        </div>
      </div>
    </button>
  );
};

export default DarkModeToggle;
