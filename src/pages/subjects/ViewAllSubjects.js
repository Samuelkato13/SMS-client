import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaSearch, FaChalkboardTeacher } from 'react-icons/fa';
import { subjectService } from '../../services/subject';
import { useAuth } from '../../context/AuthContext';

const ViewAllSubjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    classId: '',
    teacherId: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch subjects and teachers from API for the current school
    const fetchData = async () => {
      try {
        const [subjectsData, teachersData] = await Promise.all([
          subjectService.getSubjects(user?.school_id ? { school_id: user.school_id } : {}),
          subjectService.getTeachers()
        ]);
        setSubjects(subjectsData);
        setFilteredSubjects(subjectsData);
        setTeachers(teachersData);
        setError('');
      } catch (error) {
        setError('Failed to fetch subjects or teachers.');
        console.error('Error fetching data:', error);
      }
    };
    if (user?.school_id) fetchData();
  }, [user]);

  useEffect(() => {
    let result = [...subjects];

    // Apply search
    if (searchTerm) {
      result = result.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teachers.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.classId) {
      result = result.filter(subject => subject.classes.includes(filters.classId));
    }
    if (filters.teacherId) {
      result = result.filter(subject => subject.teachers.includes(filters.teacherId));
    }

    setFilteredSubjects(result);
  }, [subjects, searchTerm, filters]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Subjects</h1>
        <Link
          to="/subjects/create"
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-center sm:text-left"
        >
          Create New Subject
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          </div>
          <select
            value={filters.classId}
            onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Classes</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
          </select>
          <select
            value={filters.teacherId}
            onChange={(e) => setFilters({ ...filters, teacherId: e.target.value })}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Teachers</option>
            {teachers.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subject Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Classes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                School
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {error && (
              <tr>
                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-red-600 dark:text-red-400">
                  {error}
                </td>
              </tr>
            )}
            {filteredSubjects.length === 0 && !error && (
              <tr>
                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                  No subjects found for this school.
                </td>
              </tr>
            )}
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{subject.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {subject.classes.map((cls, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 items-center text-sm text-gray-900 dark:text-white">
                    <FaChalkboardTeacher className="mr-2" />
                    {subject.teachers && subject.teachers.length > 0
                      ? subject.teachers.map((t, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-1">{t}</span>
                        ))
                      : 'No teacher assigned'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{subject.school_name || 'N/A'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/subjects/${subject.id}/edit`}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 mr-4 transition-colors"
                  >
                    <FaEdit className="inline-block" /> Edit
                  </Link>
                  <Link
                    to={`/subjects/${subject.id}/assignments`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors mr-4"
                  >
                    View
                  </Link>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this subject?')) {
                        try {
                          await subjectService.deleteSubject(subject.id);
                          setSubjects(prev => prev.filter(s => s.id !== subject.id));
                          setFilteredSubjects(prev => prev.filter(s => s.id !== subject.id));
                        } catch (error) {
                          alert('Failed to delete subject.');
                        }
                      }
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllSubjects; 