import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics';
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

const SubjectAnalytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['subjectAnalytics'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        totalSubjects: 8,
        totalTeachers: 12,
        averageScore: 78,
        passRate: 85,
        performanceBySubject: {
          labels: ['Math', 'Science', 'English', 'History', 'Geography'],
          data: [82, 88, 85, 79, 84],
        },
        teacherPerformance: {
          labels: ['Teacher 1', 'Teacher 2', 'Teacher 3', 'Teacher 4', 'Teacher 5'],
          data: [85, 78, 92, 88, 90],
        },
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  const performanceData = {
    labels: analyticsData.performanceBySubject.labels,
    datasets: [
      {
        label: 'Subject Performance',
        data: analyticsData.performanceBySubject.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const teacherData = {
    labels: analyticsData.teacherPerformance.labels,
    datasets: [
      {
        label: 'Teacher Performance',
        data: analyticsData.teacherPerformance.data,
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Subjects</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.totalSubjects}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Teachers</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{analyticsData.totalTeachers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Average Score</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.averageScore}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pass Rate</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">{analyticsData.passRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <Line
            data={performanceData}
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Teacher Performance</h3>
          <Bar
            data={teacherData}
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
    </div>
  );
};

export default SubjectAnalytics; 