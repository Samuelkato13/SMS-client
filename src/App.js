import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <AppRoutes />
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme={isDarkMode ? "dark" : "light"}
        toastClassName="dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 