import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const stats = [
  { name: 'Total Students', icon: UserGroupIcon, color: 'bg-blue-500' },
  { name: 'Average Score', icon: AcademicCapIcon, color: 'bg-green-500' },
  { name: 'Attendance Rate', icon: ClockIcon, color: 'bg-yellow-500' },
  { name: 'Performance Trend', icon: ChartBarIcon, color: 'bg-purple-500' }
];

export default function ClassTeacherDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['classTeacherDashboard'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/class-teacher');
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
        label: 'Class Average',
        data: dashboardData?.performanceData?.scores || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };

  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [
          dashboardData?.attendanceData?.present || 0,
          dashboardData?.attendanceData?.absent || 0,
          dashboardData?.attendanceData?.late || 0
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(245, 158, 11, 0.5)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)'
        ],
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const value = dashboardData?.[stat.name.toLowerCase().replace(/\s+/g, '_')] || '0';
          
          return (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.name.includes('Rate') || stat.name.includes('Score') || stat.name.includes('Trend') ? `${value}%` : value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Class Performance Trend</h3>
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

      {/* Attendance Distribution */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Distribution</h3>
        <div className="h-80">
          <Doughnut
            data={attendanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      {/* Student Performance Summary */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Student Performance Summary</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.studentPerformance?.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.averageScore}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.attendance}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.performance}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                        student.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                        student.status === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
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
} 