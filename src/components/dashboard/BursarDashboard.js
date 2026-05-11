import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon
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
  { name: 'Total Revenue', icon: CurrencyDollarIcon, color: 'bg-green-500' },
  { name: 'Pending Fees', icon: ClockIcon, color: 'bg-yellow-500' },
  { name: 'Collection Rate', icon: ChartBarIcon, color: 'bg-blue-500' },
  { name: 'Total Students', icon: UserGroupIcon, color: 'bg-purple-500' }
];

export default function BursarDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['bursarDashboard'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/bursar');
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

  const revenueData = {
    labels: dashboardData?.revenueData?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: dashboardData?.revenueData?.amounts || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      }
    ]
  };

  const feeCollectionData = {
    labels: dashboardData?.feeCollectionData?.labels || [],
    datasets: [
      {
        label: 'Fee Collection',
        data: dashboardData?.feeCollectionData?.amounts || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
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
                  {stat.name.includes('Revenue') || stat.name.includes('Fees') ? `$${value}` : value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
        <div className="h-80">
          <Line
            data={revenueData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value}`
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Fee Collection Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Collection Overview</h3>
        <div className="h-80">
          <Bar
            data={feeCollectionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value}`
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Fee Collection Summary */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Fee Collection Summary</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData?.feeSummary?.map((fee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fee.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.totalFees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.collected}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.pending}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.collectionRate}%</td>
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