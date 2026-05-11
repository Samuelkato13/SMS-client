import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { reportService } from '../../services/report';
import { toast } from 'react-toastify';

const CustomReports = () => {
  const [reportConfig, setReportConfig] = useState({
    reportType: '',
    dateRange: 'month',
    class: '',
    subject: '',
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
  });

  const { data: availableReports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['availableReports'],
    queryFn: () => reportService.getAvailableReports(),
  });

  const generateReportMutation = useMutation({
    mutationFn: (config) => reportService.generateCustomReport(config),
    onSuccess: (data) => {
      toast.success('Report generated successfully');
      // Handle report download
      window.open(data.downloadUrl, '_blank');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate report');
    },
  });

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReportConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateReportMutation.mutate(reportConfig);
  };

  if (isLoadingReports) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Custom Reports
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select
                name="reportType"
                id="reportType"
                value={reportConfig.reportType}
                onChange={handleConfigChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select report type</option>
                {availableReports?.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                name="dateRange"
                id="dateRange"
                value={reportConfig.dateRange}
                onChange={handleConfigChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                name="class"
                id="class"
                value={reportConfig.class}
                onChange={handleConfigChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Classes</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                name="subject"
                id="subject"
                value={reportConfig.subject}
                onChange={handleConfigChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Subjects</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
              </select>
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                Report Format
              </label>
              <select
                name="format"
                id="format"
                value={reportConfig.format}
                onChange={handleConfigChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeCharts"
                    id="includeCharts"
                    checked={reportConfig.includeCharts}
                    onChange={handleConfigChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeCharts" className="ml-2 block text-sm text-gray-900">
                    Include Charts
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeTables"
                    id="includeTables"
                    checked={reportConfig.includeTables}
                    onChange={handleConfigChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeTables" className="ml-2 block text-sm text-gray-900">
                    Include Tables
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={generateReportMutation.isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {generateReportMutation.isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomReports; 