import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  UserCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? You will need to login again to continue.')) {
      logout();
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    toggleDarkMode();
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Role-based navigation configuration
  const getNavigationByRole = (role) => {
    const baseNavigation = [
      {
        name: 'Dashboard',
        icon: ChartBarIcon,
        href: '/dashboard'
      }
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseNavigation,
          {
            name: 'Students',
            icon: UserCircleIcon,
            items: [
              { name: 'All Students', href: '/students' },
              { name: 'Add Student', href: '/students/create' },
              { name: 'Student Analytics', href: '/students/analytics' },
              { name: 'Promote Students', href: '/students/promote' }
            ]
          },
          {
            name: 'Classes',
            icon: AcademicCapIcon,
            items: [
              { name: 'All Classes', href: '/classes' },
              { name: 'Add Class', href: '/classes/create' },
              { name: 'Class Analytics', href: '/classes/analytics' }
            ]
          },
          {
            name: 'Subjects',
            icon: BookOpenIcon,
            items: [
              { name: 'All Subjects', href: '/subjects' },
              { name: 'Add Subject', href: '/subjects/create' },
              { name: 'Subject Analytics', href: '/subjects/analytics' }
            ]
          },
          {
            name: 'Exams',
            icon: ClipboardDocumentListIcon,
            items: [
              { name: 'All Exams', href: '/exams' },
              { name: 'Create Exam', href: '/exams/create' },
              { name: 'Exam Analytics', href: '/exams/analytics' }
            ]
          },
          {
            name: 'Marks',
            icon: ChartBarIcon,
            items: [
              { name: 'Record Marks', href: '/marks' },
              { name: 'Marks Analytics', href: '/marks/analytics' }
            ]
          },
          {
            name: 'Attendance',
            icon: CalendarIcon,
            items: [
              { name: 'Record Attendance', href: '/attendance' },
              { name: 'Attendance Analytics', href: '/attendance/analytics' }
            ]
          },
          {
            name: 'Fees',
            icon: CurrencyDollarIcon,
            items: [
              { name: 'Fee Structure', href: '/fees/structure/create' },
              { name: 'Student Fees', href: '/fees/students' },
              { name: 'Payments', href: '/fees/payments' },
              { name: 'Fee Analytics', href: '/fees/analytics' }
            ]
          },
          {
            name: 'Users',
            icon: UserGroupIcon,
            items: [
              { name: 'All Users', href: '/users' },
              { name: 'Add User', href: '/users/create' }
            ]
          },
          {
            name: 'Schools',
            icon: BuildingOfficeIcon,
            items: [
              { name: 'All Schools', href: '/schools' },
              { name: 'Add School', href: '/schools/create' }
            ]
          },
          {
            name: 'Reports',
            icon: ChartBarIcon,
            items: [
              { name: 'Academic Reports', href: '/reports/academic' },
              { name: 'Financial Reports', href: '/reports/financial' },
              { name: 'Attendance Reports', href: '/reports/attendance' },
              { name: 'Custom Reports', href: '/reports/custom' }
            ]
          }
        ];

      case 'director':
        return [
          ...baseNavigation,
          {
            name: 'Students',
            icon: UserCircleIcon,
            items: [
              { name: 'All Students', href: '/students' },
              { name: 'Add Student', href: '/students/create' },
              { name: 'Student Analytics', href: '/students/analytics' },
              { name: 'Promote Students', href: '/students/promote' }
            ]
          },
          {
            name: 'Classes',
            icon: AcademicCapIcon,
            items: [
              { name: 'All Classes', href: '/classes' },
              { name: 'Add Class', href: '/classes/create' },
              { name: 'Class Analytics', href: '/classes/analytics' }
            ]
          },
          {
            name: 'Subjects',
            icon: BookOpenIcon,
            items: [
              { name: 'All Subjects', href: '/subjects' },
              { name: 'Add Subject', href: '/subjects/create' },
              { name: 'Subject Analytics', href: '/subjects/analytics' }
            ]
          },
          {
            name: 'Exams',
            icon: ClipboardDocumentListIcon,
            items: [
              { name: 'All Exams', href: '/exams' },
              { name: 'Exam Analytics', href: '/exams/analytics' }
            ]
          },
          {
            name: 'Marks',
            icon: ChartBarIcon,
            items: [
              { name: 'Marks Analytics', href: '/marks/analytics' }
            ]
          },
          {
            name: 'Attendance',
            icon: CalendarIcon,
            items: [
              { name: 'Attendance Analytics', href: '/attendance/analytics' }
            ]
          },
          {
            name: 'Fees',
            icon: CurrencyDollarIcon,
            items: [
              { name: 'Fee Analytics', href: '/fees/analytics' }
            ]
          },
          {
            name: 'Users',
            icon: UserGroupIcon,
            items: [
              { name: 'All Users', href: '/users' },
              { name: 'Add User', href: '/users/create' }
            ]
          },
          {
            name: 'Reports',
            icon: ChartBarIcon,
            items: [
              { name: 'Academic Reports', href: '/reports/academic' },
              { name: 'Financial Reports', href: '/reports/financial' },
              { name: 'Attendance Reports', href: '/reports/attendance' }
            ]
          }
        ];

      case 'head_teacher':
        return [
          ...baseNavigation,
          {
            name: 'Students',
            icon: UserCircleIcon,
            items: [
              { name: 'All Students', href: '/students' },
              { name: 'Add Student', href: '/students/create' },
              { name: 'Student Analytics', href: '/students/analytics' },
              { name: 'Promote Students', href: '/students/promote' }
            ]
          },
          {
            name: 'Classes',
            icon: AcademicCapIcon,
            items: [
              { name: 'All Classes', href: '/classes' },
              { name: 'Add Class', href: '/classes/create' },
              { name: 'Class Analytics', href: '/classes/analytics' }
            ]
          },
          {
            name: 'Subjects',
            icon: BookOpenIcon,
            items: [
              { name: 'All Subjects', href: '/subjects' },
              { name: 'Add Subject', href: '/subjects/create' },
              { name: 'Subject Analytics', href: '/subjects/analytics' }
            ]
          },
          {
            name: 'Exams',
            icon: ClipboardDocumentListIcon,
            items: [
              { name: 'All Exams', href: '/exams' },
              { name: 'Create Exam', href: '/exams/create' },
              { name: 'Exam Analytics', href: '/exams/analytics' }
            ]
          },
          {
            name: 'Marks',
            icon: ChartBarIcon,
            items: [
              { name: 'Record Marks', href: '/marks' },
              { name: 'Marks Analytics', href: '/marks/analytics' }
            ]
          },
          {
            name: 'Attendance',
            icon: CalendarIcon,
            items: [
              { name: 'Record Attendance', href: '/attendance' },
              { name: 'Attendance Analytics', href: '/attendance/analytics' }
            ]
          },
          {
            name: 'Fees',
            icon: CurrencyDollarIcon,
            items: [{ name: 'Fee Analytics', href: '/fees/analytics' }]
          },
          {
            name: 'Users',
            icon: UserGroupIcon,
            items: [
              { name: 'All Users', href: '/users' },
              { name: 'Add User', href: '/users/create' }
            ]
          },
          {
            name: 'Reports',
            icon: ChartBarIcon,
            items: [
              { name: 'Academic Reports', href: '/reports/academic' },
              { name: 'Financial Reports', href: '/reports/financial' },
              { name: 'Attendance Reports', href: '/reports/attendance' }
            ]
          }
        ];

      case 'bursar':
        return [
          ...baseNavigation,
          {
            name: 'Students',
            icon: UserCircleIcon,
            items: [
              { name: 'All Students', href: '/students' }
            ]
          },
          {
            name: 'Fees',
            icon: CurrencyDollarIcon,
            items: [
              { name: 'Fee Structure', href: '/fees/structure/create' },
              { name: 'Student Fees', href: '/fees/students' },
              { name: 'Payments', href: '/fees/payments' },
              { name: 'Fee Analytics', href: '/fees/analytics' }
            ]
          },
          {
            name: 'Reports',
            icon: ChartBarIcon,
            items: [
              { name: 'Financial Reports', href: '/reports/financial' }
            ]
          }
        ];

      case 'class_teacher':
        return [
          ...baseNavigation,
          {
            name: 'Students',
            icon: UserCircleIcon,
            items: [
              { name: 'My Students', href: '/students' }
            ]
          },
          {
            name: 'Marks',
            icon: ChartBarIcon,
            items: [
              { name: 'Record Marks', href: '/marks' },
              { name: 'Marks Analytics', href: '/marks/analytics' }
            ]
          },
          {
            name: 'Attendance',
            icon: CalendarIcon,
            items: [
              { name: 'Record Attendance', href: '/attendance' },
              { name: 'Attendance Analytics', href: '/attendance/analytics' }
            ]
          },
          {
            name: 'Reports',
            icon: ChartBarIcon,
            items: [
              { name: 'Class Reports', href: '/reports/academic' }
            ]
          }
        ];

      case 'subject_teacher':
        return [
          ...baseNavigation,
          {
            name: 'Students',
            icon: UserCircleIcon,
            items: [
              { name: 'My Students', href: '/students' }
            ]
          },
          {
            name: 'Marks',
            icon: ChartBarIcon,
            items: [
              { name: 'Record Marks', href: '/marks' },
              { name: 'Marks Analytics', href: '/marks/analytics' }
            ]
          },
          {
            name: 'Reports',
            icon: ChartBarIcon,
            items: [
              { name: 'Subject Reports', href: '/reports/academic' }
            ]
          }
        ];

      default:
        return baseNavigation;
    }
  };

  const navigation = getNavigationByRole(user?.role);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-lg overflow-hidden">
      {/* Project Title and School Name */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
            <AcademicCapIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">School Management</h1>
            {user?.school && <p className="text-sm text-white/90 mt-1">{user.school}</p>}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-3 px-6 py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent min-h-0">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href || item.items?.[0]?.href);
          const isDropdownOpen = openDropdowns[item.name];

          return (
            <div key={item.name}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full group flex items-center px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 hover:shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    {isDropdownOpen ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-8 mt-3 space-y-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            location.pathname === subItem.href
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-4 ${
                            location.pathname === subItem.href
                              ? 'bg-purple-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`} />
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`group flex items-center px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 hover:shadow-md ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-base font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || 'User'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="p-3 rounded-xl text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 