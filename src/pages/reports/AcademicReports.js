import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/report';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AcademicReports = () => {
  const [filters, setFilters] = useState({
    class: '',
    subject: '',
    examType: '',
    dateRange: 'month',
  });

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['academicReports', filters],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        classPerformance: {
          labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
          data: [75, 82, 78, 85, 80],
        },
        subjectPerformance: {
          labels: ['Math', 'Science', 'English', 'History', 'Geography'],
          data: [72, 85, 78, 82, 80],
        },
        examPerformance: {
          labels: ['Mid Term', 'Final', 'Quiz 1', 'Quiz 2', 'Assignment'],
          data: [78, 82, 85, 79, 88],
        },
        topPerformers: [
          { name: 'John Doe', class: 'Class 1', score: 95 },
          { name: 'Jane Smith', class: 'Class 2', score: 92 },
          { name: 'Mike Johnson', class: 'Class 3', score: 90 },
          { name: 'Sarah Williams', class: 'Class 4', score: 88 },
          { name: 'David Brown', class: 'Class 5', score: 87 },
        ],
        improvementAreas: [
          { subject: 'Math', improvement: 15 },
          { subject: 'Science', improvement: 12 },
          { subject: 'English', improvement: 10 },
          { subject: 'History', improvement: 8 },
          { subject: 'Geography', improvement: 5 },
        ],
      };
    },
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  const classData = {
    labels: reportData.classPerformance.labels,
    datasets: [
      {
        label: 'Class Performance',
        data: reportData.classPerformance.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const subjectData = {
    labels: reportData.subjectPerformance.labels,
    datasets: [
      {
        label: 'Subject Performance',
        data: reportData.subjectPerformance.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  const examData = {
    labels: reportData.examPerformance.labels,
    datasets: [
      {
        label: 'Exam Performance',
        data: reportData.examPerformance.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Report Filters</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Class
            </label>
            <select
              name="class"
              id="class"
              value={filters.class}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Classes</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <select
              name="subject"
              id="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Subjects</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="history">History</option>
              <option value="geography">Geography</option>
            </select>
          </div>

          <div>
            <label htmlFor="examType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exam Type
            </label>
            <select
              name="examType"
              id="examType"
              value={filters.examType}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="midterm">Mid Term</option>
              <option value="final">Final</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </label>
            <select
              name="dateRange"
              id="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Class Performance</h3>
          <Bar
            data={classData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                  }
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                  }
                },
                x: {
                  grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                  }
                }
              },
            }}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <Bar
            data={subjectData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                  }
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                  }
                },
                x: {
                  grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                  },
                  ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                  }
                }
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Exam Performance Trend</h3>
        <Line
          data={examData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                }
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                },
                ticks: {
                  color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                }
              },
              x: {
                grid: {
                  color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                },
                ticks: {
                  color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                }
              }
            },
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Performers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.topPerformers.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Areas of Improvement</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Improvement Needed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.improvementAreas.map((area, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {area.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {area.improvement}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicReports; 