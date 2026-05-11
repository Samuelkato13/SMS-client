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

const MarksAnalytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['marksAnalytics'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        totalStudents: 150,
        averageScore: 78,
        passRate: 85,
        topPerformers: 25,
        gradeDistribution: {
          labels: ['A', 'B', 'C', 'D', 'F'],
          data: [30, 40, 20, 5, 5],
        },
        performanceBySubject: {
          labels: ['Math', 'Science', 'English', 'History', 'Geography'],
          data: [75, 82, 78, 85, 80],
        },
        monthlyTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [72, 75, 78, 76, 80, 82],
        },
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Chart configuration for dark mode
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        }
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#374151' : '#ffffff',
        titleColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#111827',
        bodyColor: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        }
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        beginAtZero: true,
        max: 100,
      }
    }
  };

  const gradeData = {
    labels: analyticsData.gradeDistribution.labels,
    datasets: [
      {
        data: analyticsData.gradeDistribution.data,
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2
      },
    ],
  };

  const subjectData = {
    labels: analyticsData.performanceBySubject.labels,
    datasets: [
      {
        label: 'Subject Performance',
        data: analyticsData.performanceBySubject.data,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      },
    ],
  };

  const trendData = {
    labels: analyticsData.monthlyTrend.labels,
    datasets: [
      {
        label: 'Monthly Performance',
        data: analyticsData.monthlyTrend.data,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Students</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.totalStudents}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Average Score</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{analyticsData.averageScore}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pass Rate</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.passRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Performers</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">{analyticsData.topPerformers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={gradeData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <div className="h-64">
            <Bar data={subjectData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Performance Trend</h3>
        <div className="h-64">
          <Line data={trendData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MarksAnalytics; 