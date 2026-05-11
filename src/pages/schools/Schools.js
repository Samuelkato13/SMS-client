import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewAllSchools from './ViewAllSchools';
import CreateSchool from './CreateSchool';
import EditSchool from './EditSchool';

const Schools = () => {
  return (
    <Routes>
      <Route path="/" element={<ViewAllSchools />} />
      <Route path="create" element={<CreateSchool />} />
      <Route path=":id/edit" element={<EditSchool />} />
    </Routes>
  );
};

export default Schools;
