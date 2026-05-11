import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewAllClasses from './ViewAllClasses';
import CreateClass from './CreateClass';
import EditClass from './EditClass';
import ClassAnalytics from './ClassAnalytics';

const Classes = () => {
  return (
    <Routes>
      <Route path="/" element={<ViewAllClasses />} />
      <Route path="create" element={<CreateClass />} />
      <Route path=":id/edit" element={<EditClass />} />
      <Route path="analytics" element={<ClassAnalytics />} />
    </Routes>
  );
};

export default Classes; 