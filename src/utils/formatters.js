// Currency formatting for UGX
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'UGX 0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

// Format currency without symbol (just the number)
export const formatCurrencyNumber = (amount) => {
  if (amount === null || amount === undefined) return '0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

// Date formatting without date-fns dependency
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

// Format time
export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Time';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    return 'Invalid Time';
  }
};

// Format date and time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Get current academic year
export const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // January is 0
  
  // If we're in the first half of the year (Jan-June), use previous year as start
  if (currentMonth <= 6) {
    return `${currentYear - 1}/${currentYear}`;
  } else {
    return `${currentYear}/${currentYear + 1}`;
  }
};

// Get academic year options
export const getAcademicYearOptions = (count = 5) => {
  const options = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    const year = currentYear - i;
    options.push({
      value: `${year}/${year + 1}`,
      label: `${year}/${year + 1}`,
    });
  }
  
  return options;
};

// Parse currency input (remove commas and convert to number)
export const parseCurrencyInput = (value) => {
  if (!value) return 0;
  
  // Remove all non-digit characters except decimal point
  const cleanValue = value.toString().replace(/[^\d.]/g, '');
  
  return parseFloat(cleanValue) || 0;
};

// Format currency input for display
export const formatCurrencyInput = (value) => {
  if (!value) return '';
  
  const numValue = parseCurrencyInput(value);
  return formatCurrencyNumber(numValue);
}; 