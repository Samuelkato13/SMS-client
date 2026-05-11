import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaPrint, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import CurrencyInput from '../../components/common/CurrencyInput';

const StudentFees = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    classId: '',
    studentId: '',
    academicYear: new Date().getFullYear().toString(),
    term: ''
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    remarks: ''
  });

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

  // Fetch student fees
  const { data: studentFees, isLoading } = useQuery({
    queryKey: ['studentFees', filters],
    queryFn: () => api.get('/api/fees/student', {
      params: filters
    }).then(res => res.data),
    enabled: !!filters.studentId && !!filters.term && !!filters.academicYear
  });

  // Record payment mutation
  const recordPayment = useMutation({
    mutationFn: (data) => api.post('/api/payments', data).then(res => res.data),
    onSuccess: () => {
      toast.success('Payment recorded successfully');
      queryClient.invalidateQueries(['studentFees']);
      setPaymentData({
        amount: '',
        paymentMethod: 'cash',
        remarks: ''
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (value) => {
    setPaymentData(prev => ({ ...prev, amount: value }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!filters.studentId || !paymentData.amount) {
      toast.error('Please select a student and enter payment amount');
      return;
    }

    recordPayment.mutate({
      ...paymentData,
      studentId: filters.studentId,
      term: filters.term,
      academicYear: filters.academicYear
    });
  };

  const handlePrintReceipt = async (paymentId) => {
    try {
      const response = await api.get(`/api/payments/${paymentId}/receipt`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to generate receipt');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Student Fees</h1>
        <p className="text-gray-600">Manage student fee payments and records</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Search & Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
            <select
              name="studentId"
              value={filters.studentId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={!filters.classId}
            >
              <option value="">Select Student</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
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

      {/* Fee Summary */}
      {studentFees && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Fee Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Fee</h3>
              <p className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
                {formatCurrency(studentFees.totalFee)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Amount Paid</h3>
              <p className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
                {formatCurrency(studentFees.amountPaid)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Balance</h3>
              <p className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
                {formatCurrency(studentFees.balance)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form */}
      {studentFees && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Record Payment</h2>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <CurrencyInput
                  value={paymentData.amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Money</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <input
                  type="text"
                  name="remarks"
                  value={paymentData.remarks}
                  onChange={handlePaymentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Optional remarks"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={recordPayment.isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {recordPayment.isLoading ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment History */}
      {studentFees && studentFees.payments && studentFees.payments.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentFees.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="capitalize">{payment.method}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.remarks || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handlePrintReceipt(payment.id)}
                        className="text-purple-600 hover:text-purple-900 flex items-center gap-1 transition-colors"
                      >
                        <FaPrint className="h-4 w-4" />
                        <span className="hidden sm:inline">Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !studentFees && (
        <div className="text-center py-12">
          <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fee data found</h3>
          <p className="text-gray-500">
            Please select a student, academic year, and term to view fee information
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentFees; 