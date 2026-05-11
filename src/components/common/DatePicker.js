import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const DatePicker = ({ value, onChange, placeholder, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value || new Date().getFullYear().toString());
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedYear(value);
    }
  }, [value]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    onChange(year);
    setIsOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 10; i <= currentYear + 5; i++) {
    years.push(i);
  }

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <div className="relative">
        <input
          type="text"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            onChange(e.target.value);
          }}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          readOnly
        />
        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {years.map((year) => (
            <div
              key={year}
              onClick={() => handleYearChange(year.toString())}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedYear === year.toString()
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {year}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker; 