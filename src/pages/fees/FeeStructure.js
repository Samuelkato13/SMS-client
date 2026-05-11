import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const FeeStructure = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [capacity, setCapacity] = useState('');

  // Check if user has permission to manage fee structure
  const canManageFeeStructure = user && ['admin', 'bursar'].includes(user.role);

  // Fetch sections
  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: () => axios.get('/api/sections').then(res => res.data)
  });

  // Fetch classes for selected section
  const { data: classes } = useQuery({
    queryKey: ['section-classes', selectedSection],
    queryFn: () => axios.get(`/api/sections/${selectedSection}/classes`).then(res => res.data),
    enabled: !!selectedSection
  });

  // Fetch fee structures
  const { data: feeStructures } = useQuery({
    queryKey: ['fee-structures'],
    queryFn: () => axios.get('/api/fee-structures').then(res => res.data)
  });

  // Create fee structure mutation
  const createFeeStructure = useMutation({
    mutationFn: (data) => axios.post('/api/fee-structures', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fee-structures']);
      setFeeAmount('');
      setCapacity('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createFeeStructure.mutate({
      sectionId: selectedSection,
      classId: selectedClass,
      feeAmount: parseFloat(feeAmount),
      capacity: parseInt(capacity),
      academicYear: new Date().getFullYear(),
      term: 1 // Default to Term 1, can be made dynamic
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Fee Structure Management</h1>

      {/* Fee Structure Form - Only visible to Admin and Bursar */}
      {canManageFeeStructure && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Fee Structure</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Section</option>
                  {sections?.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  disabled={!selectedSection}
                >
                  <option value="">Select Class</option>
                  {classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fee Amount (UGX)</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Class Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createFeeStructure.isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {createFeeStructure.isLoading ? 'Saving...' : 'Save Fee Structure'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fee Structure List - Visible to all roles */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Current Fee Structures</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                {canManageFeeStructure && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeStructures?.map((structure) => (
                <tr key={structure.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {structure.section.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {structure.class.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {structure.feeAmount.toLocaleString()} UGX
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {structure.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(structure.feeAmount * structure.capacity).toLocaleString()} UGX
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {structure.actualIncome.toLocaleString()} UGX
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(structure.feeAmount * structure.capacity - structure.actualIncome).toLocaleString()} UGX
                  </td>
                  {canManageFeeStructure && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => {/* Implement edit functionality */}}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {/* Implement delete functionality */}}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeeStructure; 