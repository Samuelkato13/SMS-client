import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceAnalytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['attendanceAnalytics'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        totalStudents: 150,
        presentToday: 142,
        absentToday: 8,
        attendanceRate: 95,
        monthlyAttendance: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [92, 94, 93, 95, 94, 95],
        },
        classAttendance: {
          labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
          data: [96, 94, 93, 95, 97],
        },
        attendanceByDay: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          data: [94, 95, 93, 96, 94],
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

  const monthlyData = {
    labels: analyticsData.monthlyAttendance.labels,
    datasets: [
      {
        label: 'Monthly Attendance Rate',
        data: analyticsData.monthlyAttendance.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const classData = {
    labels: analyticsData.classAttendance.labels,
    datasets: [
      {
        label: 'Class Attendance Rate',
        data: analyticsData.classAttendance.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const dayData = {
    labels: analyticsData.attendanceByDay.labels,
    datasets: [
      {
        label: 'Attendance by Day',
        data: analyticsData.attendanceByDay.data,
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Students</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.totalStudents}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Present Today</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{analyticsData.presentToday}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Absent Today</h3>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">{analyticsData.absentToday}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance Rate</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.attendanceRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Attendance Trend</h3>
          <Line
            data={monthlyData}
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Class-wise Attendance</h3>
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
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Attendance by Day</h3>
        <Bar
          data={dayData}
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
  );
};

export default AttendanceAnalytics; 