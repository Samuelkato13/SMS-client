import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import {
  ChartBarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
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
  Legend
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

const AnalyticsDashboard = ({ userRole }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState({
    fees: null,
    marks: null,
    attendance: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        const data = {
          fees: {
            totalCollected: 1500000,
            outstanding: 500000,
            collectionRate: 75,
            monthlyTrends: [
              { month: 'Jan', amount: 300000 },
              { month: 'Feb', amount: 350000 },
              { month: 'Mar', amount: 400000 }
            ]
          },
          marks: {
            classAverage: 75,
            subjectPerformance: {
              Mathematics: 80,
              English: 70,
              Science: 75
            },
            studentDistribution: {
              'A': 20,
              'B': 35,
              'C': 30,
              'D': 15
            }
          },
          attendance: {
            attendanceRate: 85,
            classAttendance: {
              'Form 1': 88,
              'Form 2': 85,
              'Form 3': 82
            },
            monthlyTrends: [
              { month: 'Jan', rate: 87 },
              { month: 'Feb', rate: 85 },
              { month: 'Mar', rate: 83 }
            ]
          }
        };
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  useEffect(() => {
    if (dashboardData) {
      // Get AI insights for each category
      const fetchInsights = async () => {
        try {
          const [feesInsights, marksInsights, attendanceInsights] = await Promise.all([
            analyticsService.analyzeFees(dashboardData.fees),
            analyticsService.analyzeMarks(dashboardData.marks),
            analyticsService.analyzeAttendance(dashboardData.attendance)
          ]);

          setAiInsights({
            fees: feesInsights,
            marks: marksInsights,
            attendance: attendanceInsights
          });
        } catch (error) {
          console.error('Error fetching AI insights:', error);
        }
      };

      fetchInsights();
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const renderAiInsights = (insights, type) => {
    if (!insights) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          AI-Powered Insights - {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {insights.split('\n').map((line, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300">{line}</p>
          ))}
        </div>
      </div>
    );
  };

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
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Fee Collection Rate
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {dashboardData?.fees.collectionRate}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                      <ArrowTrendingUpIcon className="h-5 w-5" />
                      <span>2.5%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Class Average
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {dashboardData?.marks.classAverage}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600 dark:text-red-400">
                      <ArrowTrendingDownIcon className="h-5 w-5" />
                      <span>1.2%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Attendance Rate
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {dashboardData?.attendance.attendanceRate}%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                      <ArrowTrendingUpIcon className="h-5 w-5" />
                      <span>3.1%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Outstanding Fees
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      UGX {dashboardData?.fees.outstanding.toLocaleString()}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      <span>25%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fee Collection Trends</h3>
          <div className="h-64">
            <Line
              data={{
                labels: dashboardData?.fees.monthlyTrends.map(item => item.month) || [],
                datasets: [
                  {
                    label: 'Collection Amount',
                    data: dashboardData?.fees.monthlyTrends.map(item => item.amount) || [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: Object.keys(dashboardData?.marks.subjectPerformance || {}),
                datasets: [
                  {
                    label: 'Average Score (%)',
                    data: Object.values(dashboardData?.marks.subjectPerformance || {}),
                    backgroundColor: [
                      'rgba(139, 92, 246, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)'
                    ],
                    borderColor: [
                      'rgba(139, 92, 246, 1)',
                      'rgba(59, 130, 246, 1)',
                      'rgba(16, 185, 129, 1)'
                    ],
                    borderWidth: 1
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Student Grade Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={{
                labels: Object.keys(dashboardData?.marks.studentDistribution || {}),
                datasets: [
                  {
                    data: Object.values(dashboardData?.marks.studentDistribution || {}),
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                      'rgba(34, 197, 94, 1)',
                      'rgba(59, 130, 246, 1)',
                      'rgba(245, 158, 11, 1)',
                      'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2
                  }
                ]
              }}
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

        {/* Attendance Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Attendance Trends</h3>
          <div className="h-64">
            <Line
              data={{
                labels: dashboardData?.attendance.monthlyTrends.map(item => item.month) || [],
                datasets: [
                  {
                    label: 'Attendance Rate (%)',
                    data: dashboardData?.attendance.monthlyTrends.map(item => item.rate) || [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderAiInsights(aiInsights.fees, 'fees')}
        {renderAiInsights(aiInsights.marks, 'marks')}
        {renderAiInsights(aiInsights.attendance, 'attendance')}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 