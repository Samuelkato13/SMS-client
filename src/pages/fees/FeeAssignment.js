import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import CurrencyInput from '../../components/common/CurrencyInput';

const FeeAssignment = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    classId: '',
    academicYear: new Date().getFullYear().toString(),
    term: ''
  });
  const [feeAmount, setFeeAmount] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get('/api/classes').then(res => res.data)
  });

  // Fetch students for selected class
  const { data: students } = useQuery({
    queryKey: ['students', filters.classId],
    queryFn: () => api.get('/api/students', { params: { classId: filters.classId } }).then(res => res.data),
    enabled: !!filters.classId
  });

  // Assign fees mutation
  const assignFeesMutation = useMutation({
    mutationFn: (data) => api.post('/api/fees/assign', data).then(res => res.data),
    onSuccess: () => {
      toast.success('Fees assigned successfully');
      setSelectedStudents([]);
      setFeeAmount('');
      queryClient.invalidateQueries(['students']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to assign fees');
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Clear selections when filters change
    setSelectedStudents([]);
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (students && students.length > 0) {
      setSelectedStudents(prev => 
        prev.length === students.length ? [] : students.map(s => s.id)
      );
    }
  };

  const handleAssignFees = () => {
    if (!selectedStudents.length || !feeAmount) {
      toast.error('Please select students and enter fee amount');
      return;
    }

    assignFeesMutation.mutate({
      studentIds: selectedStudents,
      amount: parseFloat(feeAmount),
      classId: filters.classId,
      academicYear: filters.academicYear,
      term: filters.term
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Fee Assignment</h1>
        <p className="text-gray-600">Assign fees to students by class</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Search & Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              name="classId"
              value={filters.classId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Class</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.section && `- ${cls.section}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
            <input
              type="text"
              name="academicYear"
              value={filters.academicYear}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
            <select
              name="term"
              value={filters.term}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Term</option>
              <option value="term1">Term 1</option>
              <option value="term2">Term 2</option>
              <option value="term3">Term 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List */}
      {students && students.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-medium">Student List</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fee Amount</label>
                <CurrencyInput
                  value={feeAmount}
                  onChange={setFeeAmount}
                  placeholder="Enter amount"
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleAssignFees}
                  disabled={!selectedStudents.length || !feeAmount || assignFeesMutation.isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {assignFeesMutation.isLoading ? 'Assigning...' : 'Assign Fees'}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelection(student.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.student_id || 'N/A'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(student.current_balance || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedStudents.length > 0 && feeAmount && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{selectedStudents.length}</strong> student(s) selected. 
                Total fee to assign: <strong>{formatCurrency(parseFloat(feeAmount) * selectedStudents.length)}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* No Data State */}
      {!students && (
        <div className="text-center py-12">
          <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">
            Please select a class to view students
          </p>
        </div>
      )}
    </div>
  );
};

export default FeeAssignment; 