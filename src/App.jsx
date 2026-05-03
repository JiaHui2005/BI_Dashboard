import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="App">
      <Dashboard theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
