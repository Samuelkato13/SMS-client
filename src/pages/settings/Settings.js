import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    school_name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: null
  });

  const { data: schoolData, isLoading } = useQuery({
    queryKey: ['school', user?.school_id],
    queryFn: () => api.get(`/schools/${user?.school_id}`).then(res => res.data),
    enabled: !!user?.school_id
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings updated successfully!');
    } catch (error) {
        toast.error('Failed to update settings');
    }
  };

  const handleGradingChange = (grade, field, value) => {
    setFormData(prev => ({
      ...prev,
      gradingSystem: {
        ...prev.gradingSystem,
        [grade]: {
          ...prev.gradingSystem[grade],
          [field]: value
        }
      }
    }));
  };

  const handleSystemSettingChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        [setting]: value
      }
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General Settings
            </button>
            <button
              onClick={() => setActiveTab('grading')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'grading'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Grading System
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'system'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              System Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">School Name</label>
                  <input
                    type="text"
                    value={formData.school_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.files[0] }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            {activeTab === 'grading' && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Grade</div>
                  <div className="font-medium">Minimum</div>
                  <div className="font-medium">Maximum</div>
                  <div className="font-medium">Comment</div>
                </div>
                {Object.entries(formData.gradingSystem).map(([grade, data]) => (
                  <div key={grade} className="grid grid-cols-4 gap-4">
                    <div className="font-medium">{grade}</div>
                    <input
                      type="number"
                      value={data.min}
                      onChange={(e) => handleGradingChange(grade, 'min', parseInt(e.target.value))}
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={data.max}
                      onChange={(e) => handleGradingChange(grade, 'max', parseInt(e.target.value))}
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      value={data.comment}
                      onChange={(e) => handleGradingChange(grade, 'comment', e.target.value)}
                      className="p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enable Notifications</label>
                  <input
                    type="checkbox"
                    checked={formData.systemSettings.enableNotifications}
                    onChange={(e) => handleSystemSettingChange('enableNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Automatic Backup</label>
                  <input
                    type="checkbox"
                    checked={formData.systemSettings.autoBackup}
                    onChange={(e) => handleSystemSettingChange('autoBackup', e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Backup Frequency</label>
                  <select
                    value={formData.systemSettings.backupFrequency}
                    onChange={(e) => handleSystemSettingChange('backupFrequency', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Maximum Login Attempts</label>
                  <input
                    type="number"
                    value={formData.systemSettings.maxLoginAttempts}
                    onChange={(e) => handleSystemSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={formData.systemSettings.sessionTimeout}
                    onChange={(e) => handleSystemSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Settings; 