import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
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
  Legend
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

const stats = [
  { name: 'Overall Performance', icon: ChartBarIcon, color: 'bg-blue-500' },
  { name: 'Class Performance', icon: AcademicCapIcon, color: 'bg-green-500' },
  { name: 'Fee Collection', icon: CurrencyDollarIcon, color: 'bg-yellow-500' },
  { name: 'Student Attendance', icon: UserGroupIcon, color: 'bg-purple-500' }
];

export default function DirectorDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['directorDashboard'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/director');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const performanceData = {
    labels: dashboardData?.performanceData?.labels || [],
    datasets: [
      {
        label: 'Average Score',
        data: dashboardData?.performanceData?.scores || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };

  const feeData = {
    labels: dashboardData?.feeData?.labels || [],
    datasets: [
      {
        label: 'Fee Collection',
        data: dashboardData?.feeData?.amounts || [],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const value = dashboardData?.[stat.name.toLowerCase().replace(/\s+/g, '_')] || '0%';
          
          return (
            <div
              key={stat.name}
              className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden transition-colors"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Academic Performance Trend</h3>
        <div className="h-80">
          <Line
            data={performanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>
      </div>

      {/* Fee Collection Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fee Collection Overview</h3>
        <div className="h-80">
          <Bar
            data={feeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      {/* Class Performance Summary */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Class Performance Summary</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Average Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendance Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fee Collection</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData?.classPerformance?.map((classData, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{classData.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{classData.averageScore}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{classData.attendanceRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{classData.feeCollection}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 