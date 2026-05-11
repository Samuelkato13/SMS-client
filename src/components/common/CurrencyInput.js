import React, { useState, useEffect } from 'react';
import { formatCurrencyNumber } from '../../utils/formatters';

const CurrencyInput = ({
  value,
  onChange,
  placeholder = "Enter amount",
  className = "",
  required = false,
  disabled = false,
  min = 0,
  max,
  step = 1000
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      setDisplayValue(formatCurrencyNumber(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Remove all non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const cleanValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    setDisplayValue(cleanValue);
    
    // Convert to number for the parent component
    const numValue = parseFloat(cleanValue) || 0;
    onChange(numValue);
  };

  const handleBlur = () => {
    if (displayValue) {
      const numValue = parseFloat(displayValue) || 0;
      setDisplayValue(formatCurrencyNumber(numValue));
    }
  };

  const handleFocus = () => {
    if (displayValue) {
      // Show raw number when focused
      const numValue = parseFloat(displayValue.replace(/[^\d.]/g, '')) || 0;
      setDisplayValue(numValue.toString());
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed ${className}`}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-gray-500 dark:text-gray-400 text-sm">UGX</span>
      </div>
    </div>
  );
};

export default CurrencyInput; 