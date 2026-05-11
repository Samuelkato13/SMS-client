import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FeeManagement from './FeeManagement';
import ClassFees from './ClassFees';
import StudentFees from './StudentFees';

const Fees = () => {
  return (
    <Routes>
      <Route path="/" element={<FeeManagement />} />
      <Route path="/manage" element={<FeeManagement />} />
      <Route path="/class" element={<ClassFees />} />
      <Route path="/students" element={<StudentFees />} />
    </Routes>
  );
};

export default Fees; 