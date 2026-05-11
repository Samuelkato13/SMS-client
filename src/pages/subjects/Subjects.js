import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewAllSubjects from './ViewAllSubjects';
import CreateSubject from './CreateSubject';

const Subjects = () => {
  return (
    <Routes>
      <Route path="/" element={<ViewAllSubjects />} />
      <Route path="/create" element={<CreateSubject />} />
      <Route path="/assignments" element={<ViewAllSubjects />} />
      <Route path="/by-class" element={<ViewAllSubjects />} />
    </Routes>
  );
};

export default Subjects; 