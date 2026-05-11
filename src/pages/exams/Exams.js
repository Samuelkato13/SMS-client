import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import GradingSystem from './GradingSystem';

const Exams = () => {
  const queryClient = useQueryClient();
  const [showExamForm, setShowExamForm] = useState(false);
  const [showGradingForm, setShowGradingForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    academicYear: new Date().getFullYear().toString(),
    term: '',
    examSet: '',
    classes: []
  });

  // Fetch exams
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => api.get('/api/exams').then(res => res.data)
  });

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get('/api/classes').then(res => res.data)
  });

  // Create exam mutation
  const createExam = useMutation({
    mutationFn: (data) => api.post('/api/exams', data).then(res => res.data),
    onSuccess: () => {
      toast.success('Exam created successfully');
      queryClient.invalidateQueries(['exams']);
      setShowExamForm(false);
      setFormData({
        name: '',
        academicYear: new Date().getFullYear().toString(),
        term: '',
        examSet: '',
        classes: []
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create exam');
    }
  });

  // Delete exam mutation
  const deleteExam = useMutation({
    mutationFn: (examId) => api.delete(`/api/exams/${examId}`).then(res => res.data),
    onSuccess: () => {
      toast.success('Exam deleted successfully');
      queryClient.invalidateQueries(['exams']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete exam');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createExam.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassChange = (classId) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(classId)
        ? prev.classes.filter(id => id !== classId)
        : [...prev.classes, classId]
    }));
  };

  const handleDelete = (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      deleteExam.mutate(examId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Exams Management</h1>
        <button
          onClick={() => setShowExamForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Create New Exam
        </button>
      </div>

      {/* Exam List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams?.map(exam => (
          <div key={exam.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{exam.name}</h3>
                <p className="text-sm text-gray-500">
                  {exam.term} - {exam.academicYear}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedExam(exam);
                    setShowGradingForm(true);
                  }}
                  className="text-purple-600 hover:text-purple-900"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(exam.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Exam Set:</span> {exam.examSet}
              </p>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Assigned Classes:</p>
                <div className="flex flex-wrap gap-2">
                  {exam.classes.map(cls => (
                    <span
                      key={cls.id}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                    >
                      {cls.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showExamForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New Exam</h3>
              <button
                onClick={() => setShowExamForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Term</label>
                <select
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Term</option>
                  <option value="term1">Term 1</option>
                  <option value="term2">Term 2</option>
                  <option value="term3">Term 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exam Set</label>
                <select
                  name="examSet"
                  value={formData.examSet}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Exam Set</option>
                  <option value="BOT">Beginning of Term (BOT)</option>
                  <option value="MT">Mid Term (MT)</option>
                  <option value="EOT">End of Term (EOT)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value={new Date().getFullYear().toString()}>
                    {new Date().getFullYear()}
                  </option>
                  <option value={(new Date().getFullYear() + 1).toString()}>
                    {new Date().getFullYear() + 1}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Classes</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {classes?.map(cls => (
                    <label key={cls.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.classes.includes(cls.id)}
                        onChange={() => handleClassChange(cls.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{cls.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowExamForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading System Modal */}
      {showGradingForm && selectedExam && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Grading System - {selectedExam.name}</h3>
              <button
                onClick={() => {
                  setShowGradingForm(false);
                  setSelectedExam(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <GradingSystem examId={selectedExam.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams; 