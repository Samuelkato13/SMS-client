import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClassFees from './ClassFees';
import StudentFees from './StudentFees';

const FeeManagement = () => {
  return (
    <Routes>
      <Route path="/" element={<ClassFees />} />
      <Route path="/students" element={<StudentFees />} />
    </Routes>
  );
};

export default FeeManagement; 