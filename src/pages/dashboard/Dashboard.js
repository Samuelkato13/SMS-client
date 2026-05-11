import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import DirectorDashboard from '../../components/dashboard/DirectorDashboard';
import HeadTeacherDashboard from '../../components/dashboard/HeadTeacherDashboard';
import BursarDashboard from '../../components/dashboard/BursarDashboard';
import ClassTeacherDashboard from '../../components/dashboard/ClassTeacherDashboard';
import SubjectTeacherDashboard from '../../components/dashboard/SubjectTeacherDashboard';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import { FaUsers, FaSchool, FaFileInvoiceDollar, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        const data = {
          totalUsers: 150,
          totalSchools: 5,
          totalExams: 12,
          totalFees: 25000000,
          recentExams: [
            { id: 1, name: 'BOT 2024', term: 'Term 1', year: '2024', status: 'Active' },
            { id: 2, name: 'MT 2024', term: 'Term 1', year: '2024', status: 'Upcoming' }
          ],
          feeSummary: {
            totalExpected: 50000000,
            totalCollected: 35000000,
            outstanding: 15000000
          },
          schoolStats: [
            { id: 1, name: 'Heritage', students: 500, teachers: 25, classes: 12 },
            { id: 2, name: 'St. Mary\'s', students: 450, teachers: 22, classes: 10 }
          ]
        };
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Render different dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'director':
        return <DirectorDashboard />;
      case 'head_teacher':
        return <HeadTeacherDashboard />;
      case 'bursar':
        return <BursarDashboard />;
      case 'class_teacher':
        return <ClassTeacherDashboard />;
      case 'subject_teacher':
        return <SubjectTeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <Link
                to="/users/create"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Add New User
              </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <FaUsers className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                    <FaSchool className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Schools</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.totalSchools}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                    <FaFileInvoiceDollar className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Fees (UGX)</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {dashboardData?.totalFees.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
                    <FaChartLine className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Exams</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.totalExams}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Fee Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Expected</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      UGX {dashboardData?.feeSummary.totalExpected.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                      UGX {dashboardData?.feeSummary.totalCollected.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding</p>
                    <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                      UGX {dashboardData?.feeSummary.outstanding.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Exams and School Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Exams */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Exams</h2>
                  <div className="space-y-4">
                    {dashboardData?.recentExams.map(exam => (
                      <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded transition-colors">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{exam.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exam.term} - {exam.year}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {exam.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* School Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">School Statistics</h2>
                  <div className="space-y-4">
                    {dashboardData?.schoolStats.map(school => (
                      <div key={school.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded transition-colors">
                        <p className="font-medium mb-2 text-gray-900 dark:text-white">{school.name}</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                            <p className="font-medium text-gray-900 dark:text-white">{school.students}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Teachers</p>
                            <p className="font-medium text-gray-900 dark:text-white">{school.teachers}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Classes</p>
                            <p className="font-medium text-gray-900 dark:text-white">{school.classes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderDashboard()}
      <AnalyticsDashboard userRole={user?.role} />
    </div>
  );
} 