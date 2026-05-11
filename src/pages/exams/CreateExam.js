import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CreateExam = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    academicYear: new Date().getFullYear(),
    term: '',
    examSet: '',
    classes: [],
    gradingSchema: {
      grades: [
        { min: 90, max: 100, grade: 'A', comment: 'Excellent' },
        { min: 80, max: 89, grade: 'B', comment: 'Very Good' },
        { min: 70, max: 79, grade: 'C', comment: 'Good' },
        { min: 60, max: 69, grade: 'D', comment: 'Satisfactory' },
        { min: 50, max: 59, grade: 'E', comment: 'Pass' },
        { min: 0, max: 49, grade: 'F', comment: 'Fail' }
      ]
    }
  });

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await axios.get('/api/classes');
      return response.data;
    },
  });

  const createExamMutation = useMutation({
    mutationFn: async (examData) => {
      const response = await axios.post('/api/exams', examData);
      return response.data;
    },
    onSuccess: () => {
      navigate('/exams');
    },
  });

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

  const handleGradingChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      gradingSchema: {
        ...prev.gradingSchema,
        grades: prev.gradingSchema.grades.map((grade, i) => 
          i === index ? { ...grade, [field]: value } : grade
        )
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createExamMutation.mutate({
      ...formData,
      schoolId: user.schoolId
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Exam</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., 2025 T1 BOT"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Academic Year</label>
            <input
              type="number"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
              min={2000}
              max={2100}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Term</label>
            <select
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Term</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Set</label>
            <select
              name="examSet"
              value={formData.examSet}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Exam Set</option>
              <option value="BOT">Beginning of Term (BOT)</option>
              <option value="MT">Mid Term (MT)</option>
              <option value="EOT">End of Term (EOT)</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Classes</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes?.map((cls) => (
              <label key={cls.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.classes.includes(cls.id)}
                  onChange={() => handleClassChange(cls.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{cls.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Grading Schema */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grading Schema</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.gradingSchema.grades.map((grade, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={grade.min}
                        onChange={(e) => handleGradingChange(index, 'min', parseInt(e.target.value))}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={grade.max}
                        onChange={(e) => handleGradingChange(index, 'max', parseInt(e.target.value))}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        max="100"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={grade.grade}
                        onChange={(e) => handleGradingChange(index, 'grade', e.target.value)}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={grade.comment}
                        onChange={(e) => handleGradingChange(index, 'comment', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/exams')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createExamMutation.isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {createExamMutation.isLoading ? 'Creating...' : 'Create Exam'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam; 