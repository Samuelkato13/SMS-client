import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/report';
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

const FinancialReports = () => {
  const [filters, setFilters] = useState({
    dateRange: 'month',
    feeType: '',
    class: '',
  });

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['financialReports', filters],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        totalRevenue: 150000,
        totalExpenses: 120000,
        netIncome: 30000,
        collectionRate: 85,
        monthlyRevenue: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [22000, 25000, 28000, 24000, 26000, 25000],
        },
        feeTypeDistribution: {
          labels: ['Tuition', 'Transport', 'Library', 'Sports', 'Other'],
          data: [60, 15, 10, 10, 5],
        },
        expenseCategories: {
          labels: ['Salaries', 'Utilities', 'Maintenance', 'Supplies', 'Other'],
          data: [45, 20, 15, 10, 10],
        },
        pendingPayments: [
          { student: 'John Doe', class: 'Class 1', amount: 5000, dueDate: '2024-03-15' },
          { student: 'Jane Smith', class: 'Class 2', amount: 4500, dueDate: '2024-03-20' },
          { student: 'Mike Johnson', class: 'Class 3', amount: 4800, dueDate: '2024-03-25' },
          { student: 'Sarah Williams', class: 'Class 4', amount: 5200, dueDate: '2024-03-30' },
          { student: 'David Brown', class: 'Class 5', amount: 4900, dueDate: '2024-04-05' },
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

  const monthlyData = {
    labels: reportData.monthlyRevenue.labels,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: reportData.monthlyRevenue.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const feeTypeData = {
    labels: reportData.feeTypeDistribution.labels,
    datasets: [
      {
        data: reportData.feeTypeDistribution.data,
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

  const expenseData = {
    labels: reportData.expenseCategories.labels,
    datasets: [
      {
        data: reportData.expenseCategories.data,
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
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Report Filters</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

          <div>
            <label htmlFor="feeType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fee Type
            </label>
            <select
              name="feeType"
              id="feeType"
              value={filters.feeType}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="tuition">Tuition</option>
              <option value="transport">Transport</option>
              <option value="library">Library</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${reportData.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            ${reportData.totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Net Income</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            ${reportData.netIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Collection Rate</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{reportData.collectionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Revenue Trend</h3>
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
                  grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                  },
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                  },
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fee Type Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={feeTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                    }
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expense Categories</h3>
          <div className="h-64">
            <Doughnut
              data={expenseData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827'
                    }
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Pending Payments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.pendingPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.dueDate}
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

export default FinancialReports; 