import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import api from '../../services/api';

const GradingSystem = ({ examId }) => {
  const queryClient = useQueryClient();
  const [grades, setGrades] = useState([
    { minScore: 90, maxScore: 100, grade: 'A', comment: 'Excellent' },
    { minScore: 80, maxScore: 89, grade: 'B', comment: 'Very Good' },
    { minScore: 70, maxScore: 79, grade: 'C', comment: 'Good' },
    { minScore: 60, maxScore: 69, grade: 'D', comment: 'Satisfactory' },
    { minScore: 50, maxScore: 59, grade: 'E', comment: 'Pass' },
    { minScore: 0, maxScore: 49, grade: 'F', comment: 'Fail' }
  ]);

  // Fetch existing grading scheme
  const { data: existingGrades } = useQuery({
    queryKey: ['grades', examId],
    queryFn: () => api.get(`/api/exams/${examId}/grades`).then(res => res.data),
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setGrades(data);
      }
    }
  });

  // Save grading scheme mutation
  const saveGrades = useMutation({
    mutationFn: (data) => api.post(`/api/exams/${examId}/grades`, data).then(res => res.data),
    onSuccess: () => {
      toast.success('Grading scheme saved successfully');
      queryClient.invalidateQueries(['grades', examId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save grading scheme');
    }
  });

  const handleGradeChange = (index, field, value) => {
    const newGrades = [...grades];
    newGrades[index] = {
      ...newGrades[index],
      [field]: field === 'minScore' || field === 'maxScore' ? parseInt(value) : value
    };
    setGrades(newGrades);
  };

  const handleAddGrade = () => {
    setGrades([
      ...grades,
      { minScore: 0, maxScore: 0, grade: '', comment: '' }
    ]);
  };

  const handleRemoveGrade = (index) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate grades
    const isValid = grades.every((grade, index) => {
      if (index < grades.length - 1) {
        return grade.maxScore === grades[index + 1].minScore - 1;
      }
      return true;
    });

    if (!isValid) {
      toast.error('Grade ranges must be continuous without gaps');
      return;
    }

    saveGrades.mutate(grades);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {grades.map((grade, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Score Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={grade.minScore}
                  onChange={(e) => handleGradeChange(index, 'minScore', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  min="0"
                  max="100"
                  required
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={grade.maxScore}
                  onChange={(e) => handleGradeChange(index, 'maxScore', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Grade</label>
              <input
                type="text"
                value={grade.grade}
                onChange={(e) => handleGradeChange(index, 'grade', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <input
                type="text"
                value={grade.comment}
                onChange={(e) => handleGradeChange(index, 'comment', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveGrade(index)}
              className="mt-6 text-red-600 hover:text-red-900"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleAddGrade}
          className="px-4 py-2 text-purple-600 hover:text-purple-900 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Grade
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Save Grading Scheme
        </button>
      </div>
    </form>
  );
};

export default GradingSystem; 