import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeeAnalytics = () => {
  const { data: feeData, isLoading, error } = useQuery({
    queryKey: ['feeAnalytics'],
    queryFn: async () => {
      const response = await axios.get('/api/fees/analytics');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load fee analytics data.</span>
      </div>
    );
  }

  const chartData = {
    labels: feeData?.labels || [],
    datasets: [
      {
        label: 'Total Fees',
        data: feeData?.totalFees || [],
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
      },
      {
        label: 'Paid Fees',
        data: feeData?.paidFees || [],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
        }
      },
      title: {
        display: true,
        text: 'Fee Collection Analytics',
        color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
      },
    },
    scales: {
      y: {
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Fee Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Total Fees</h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">${feeData?.totalAmount || 0}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Paid Fees</h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">${feeData?.paidAmount || 0}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Fees</h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">${feeData?.pendingAmount || 0}</p>
          </div>
        </div>
        <div className="h-96">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default FeeAnalytics; 