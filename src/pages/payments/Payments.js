import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { Routes, Route } from 'react-router-dom';

const PaymentList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const queryClient = useQueryClient();

  // Fetch all payments
  const { data: payments, isLoading } = useQuery(
    ['payments', selectedStudent],
    () => api.payments.getAll({ student_id: selectedStudent }),
    {
      enabled: !!selectedStudent,
    }
  );

  // Fetch students for dropdown
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: api.students.getAll
  });

  // Create payment mutation
  const createMutation = useMutation({
    mutationFn: api.payments.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments', selectedStudent]);
      setIsModalOpen(false);
      toast.success('Payment recorded successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    },
  });

  // Update payment mutation
  const updateMutation = useMutation({
    mutationFn: api.payments.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments', selectedStudent]);
      setIsModalOpen(false);
      toast.success('Payment updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update payment');
    },
  });

  // Delete payment mutation
  const deleteMutation = useMutation({
    mutationFn: api.payments.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments', selectedStudent]);
      toast.success('Payment deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete payment');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      student_id: parseInt(selectedStudent),
      fee_id: parseInt(formData.get('fee_id')),
      amount: parseFloat(formData.get('amount')),
      payment_date: formData.get('payment_date'),
      payment_method: formData.get('payment_method'),
      transaction_id: formData.get('transaction_id'),
      remarks: formData.get('remarks'),
    };

    if (selectedPayment) {
      updateMutation.mutate({ id: selectedPayment.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (paymentData) => {
    setSelectedPayment(paymentData);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <button
          onClick={() => {
            setSelectedPayment(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          disabled={!selectedStudent}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Record Payment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Student</option>
            {students?.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {selectedStudent && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments?.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.fee_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.transaction_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.remarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {selectedPayment ? 'Edit Payment' : 'Record Payment'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fee Type
                  </label>
                  <select
                    name="fee_id"
                    defaultValue={selectedPayment?.fee_id}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Fee Type</option>
                    {/* Add fee options here */}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    defaultValue={selectedPayment?.amount}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="payment_date"
                    defaultValue={selectedPayment?.payment_date}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Payment Method
                  </label>
                  <select
                    name="payment_method"
                    defaultValue={selectedPayment?.payment_method}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    name="transaction_id"
                    defaultValue={selectedPayment?.transaction_id}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    defaultValue={selectedPayment?.remarks}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {selectedPayment ? 'Update' : 'Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreatePayment = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Payment</h1>
      {/* Add payment creation form here */}
    </div>
  );
};

const Payments = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentList />} />
      <Route path="/create" element={<CreatePayment />} />
    </Routes>
  );
};

export default Payments; 