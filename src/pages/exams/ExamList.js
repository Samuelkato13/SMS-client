import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ExamList = () => {
  const { user } = useAuth();

  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => axios.get('/api/exams').then(res => res.data)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Exams</h1>
        {['admin', 'head_teacher', 'director'].includes(user.role) && (
          <Link
            to="/exams/create"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Exam
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams?.map((exam) => (
          <div
            key={exam.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {exam.name}
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Term:</span> {exam.term}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Year:</span> {exam.academicYear}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Exam Set:</span> {exam.examSet}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Assigned Classes:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exam.classes.map((cls) => (
                      <span
                        key={cls.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {cls.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="flex justify-between items-center">
                <Link
                  to={`/exams/${exam.id}/marks`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View Marks
                </Link>
                {['admin', 'head_teacher', 'director'].includes(user.role) && (
                  <Link
                    to={`/exams/${exam.id}/edit`}
                    className="text-sm font-medium text-gray-600 hover:text-gray-500"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamList; 