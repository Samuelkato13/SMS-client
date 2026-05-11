import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [markData, setMarkData] = useState({
    marks: '',
    remarks: ''
  });

  // Fetch exam details
  const { data: exam, isLoading: examLoading } = useQuery({
    queryKey: ['exam', id],
    queryFn: () => api.get(`/api/exams/${id}`).then(res => res.data)
  });

  // Fetch students for the exam's class
  const { data: students } = useQuery({
    queryKey: ['students', exam?.class_id],
    queryFn: () => api.get(`/api/classes/${exam?.class_id}/students`).then(res => res.data),
    enabled: !!exam?.class_id
  });

  // Fetch marks for the exam
  const { data: marks } = useQuery({
    queryKey: ['exam-marks', id],
    queryFn: () => api.get(`/api/exams/${id}/marks`).then(res => res.data),
    enabled: !!id
  });

  // Submit marks mutation
  const submitMarks = useMutation({
    mutationFn: (data) => api.post(`/api/exams/${id}/marks`, data).then(res => res.data),
    onSuccess: () => {
      toast.success('Marks submitted successfully');
      queryClient.invalidateQueries(['exam-marks', id]);
      setSelectedStudent(null);
      setMarkData({ marks: '', remarks: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit marks');
    }
  });

  const handleMarkSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    submitMarks.mutate({
      student_id: selectedStudent.id,
      marks: parseFloat(markData.marks),
      remarks: markData.remarks
    });
  };

  const handleMarkChange = (e) => {
    const { name, value } = e.target;
    setMarkData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (examLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Exam not found</h2>
          <button
            onClick={() => navigate('/dashboard/exams')}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Exam Details */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.name}</h1>
              <p className="text-gray-600 mt-1">{exam.description}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/exams')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Exams
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="mt-1 text-sm text-gray-900 capitalize">{exam.exam_type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1 text-sm text-gray-900">{new Date(exam.exam_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Time</h3>
              <p className="mt-1 text-sm text-gray-900">
                {exam.start_time} - {exam.end_time}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Marks</h3>
              <p className="mt-1 text-sm text-gray-900">{exam.total_marks}</p>
            </div>
          </div>
        </div>

        {/* Marks Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Student Marks</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student List */}
            <div className="md:col-span-1">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h3 className="text-sm font-medium text-gray-900">Students</h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {students?.map(student => {
                    const studentMark = marks?.find(m => m.student_id === student.id);
                    return (
                      <button
                        key={student.id}
                        onClick={() => {
                          setSelectedStudent(student);
                          setMarkData({
                            marks: studentMark?.marks?.toString() || '',
                            remarks: studentMark?.remarks || ''
                          });
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                          selectedStudent?.id === student.id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.roll_number}</p>
                          </div>
                          {studentMark && (
                            <span className="text-sm font-medium text-gray-900">
                              {studentMark.marks}/{exam.total_marks}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mark Entry Form */}
            <div className="md:col-span-2">
              {selectedStudent ? (
                <form onSubmit={handleMarkSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedStudent.name}</p>
                  </div>

                  <div>
                    <label htmlFor="marks" className="block text-sm font-medium text-gray-700">
                      Marks
                    </label>
                    <input
                      type="number"
                      name="marks"
                      id="marks"
                      value={markData.marks}
                      onChange={handleMarkChange}
                      min="0"
                      max={exam.total_marks}
                      step="0.5"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      id="remarks"
                      value={markData.remarks}
                      onChange={handleMarkChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      Submit Marks
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select a student to enter marks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails; 