import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const PromoteStudents = () => {
  const queryClient = useQueryClient();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [targetClass, setTargetClass] = useState('');
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());

  // Generate academic years (current year and 5 years forward)
  const academicYears = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return year.toString();
  });

  // Fetch current classes
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await axios.get('/api/classes');
      return response.data;
    },
  });

  // Fetch students from the selected class
  const { data: students } = useQuery({
    queryKey: ['students', targetClass],
    queryFn: async () => {
      if (!targetClass) return [];
      const response = await axios.get(`/api/classes/${targetClass}/students`);
      return response.data;
    },
    enabled: !!targetClass,
  });

  const promoteStudentsMutation = useMutation({
    mutationFn: async ({ studentIds, targetClassId, academicYear }) => {
      const response = await axios.post('/api/students/promote', {
        studentIds,
        targetClassId,
        academicYear,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Students promoted successfully!');
      queryClient.invalidateQueries(['students']);
      setSelectedStudents([]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to promote students');
    },
  });

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students?.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students?.map(student => student.id) || []);
    }
  };

  const handlePromote = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student to promote');
      return;
    }

    if (!targetClass) {
      toast.error('Please select a target class');
      return;
    }

    promoteStudentsMutation.mutate({
      studentIds: selectedStudents,
      targetClassId: targetClass,
      academicYear,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Promote Students</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Class Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Current Class
            </label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Select a class</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.stream}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              {academicYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Students List */}
        {students && students.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Students</h2>
              <button
                onClick={handleSelectAll}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission Number
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentSelect(student.id)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.admissionNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handlePromote}
            disabled={selectedStudents.length === 0 || promoteStudentsMutation.isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promoteStudentsMutation.isLoading ? 'Promoting...' : 'Promote Selected Students'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteStudents; 