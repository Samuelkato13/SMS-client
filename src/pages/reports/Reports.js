import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const reportTypes = [
  {
    name: 'Academic Reports',
    description: 'View student performance, exam results, and grade reports',
    icon: AcademicCapIcon,
    href: '/reports/academic',
    color: 'bg-blue-500',
  },
  {
    name: 'Financial Reports',
    description: 'Access fee collection, payment history, and financial statements',
    icon: CurrencyDollarIcon,
    href: '/reports/financial',
    color: 'bg-green-500',
  },
  {
    name: 'Attendance Reports',
    description: 'Track student attendance and generate attendance reports',
    icon: CalendarIcon,
    href: '/reports/attendance',
    color: 'bg-yellow-500',
  },
  {
    name: 'Custom Reports',
    description: 'Create and manage custom reports with specific criteria',
    icon: DocumentTextIcon,
    href: '/reports/custom',
    color: 'bg-purple-500',
  },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="mt-1 text-sm text-gray-500">
            Access and generate various types of reports for your school
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Link
            key={report.name}
            to={report.href}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <span className={`inline-flex p-3 rounded-lg ${report.color} text-white`}>
                <report.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                {report.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{report.description}</p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* TODO: Replace with actual data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Monthly Academic Report
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Academic</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-03-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports; 