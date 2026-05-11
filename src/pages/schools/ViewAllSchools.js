import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { schoolService } from '../../services/school';

const ViewAllSchools = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({ name: '', location: '', school_type: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    motto: '', 
    staff_suffix: '', 
    email: '', 
    phone1: '', 
    phone2: '', 
    website: '', 
    location: '',
    school_type: 'primary'
  });

  // Fetch schools
  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: () => schoolService.getSchools(),
  });

  // Delete mutation
  const deleteSchool = useMutation({
    mutationFn: (id) => schoolService.deleteSchool(id),
    onSuccess: () => {
      toast.success('School deleted successfully!');
      queryClient.invalidateQueries(['schools']);
    },
    onError: () => toast.error('Failed to delete school'),
  });

  // Create mutation
  const createSchool = useMutation({
    mutationFn: (data) => schoolService.createSchool(data),
    onSuccess: () => {
      toast.success('School created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', motto: '', staff_suffix: '', email: '', phone1: '', phone2: '', website: '', location: '', school_type: 'primary' });
      queryClient.invalidateQueries(['schools']);
    },
    onError: () => toast.error('Failed to create school'),
  });

  // Update mutation
  const updateSchool = useMutation({
    mutationFn: ({ id, data }) => schoolService.updateSchool(id, data),
    onSuccess: () => {
      toast.success('School updated successfully!');
      setShowEditModal(false);
      setSelectedSchool(null);
      queryClient.invalidateQueries(['schools']);
    },
    onError: () => toast.error('Failed to update school'),
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      deleteSchool.mutate(id);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    createSchool.mutate(formData);
  };

  const handleViewSchool = (school) => {
    setSelectedSchool(school);
    setShowViewModal(true);
  };

  const handleEditSchool = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      motto: school.motto || '',
      staff_suffix: school.staff_suffix || '',
      email: school.email || '',
      phone1: school.phone1 || '',
      phone2: school.phone2 || '',
      website: school.website || '',
      location: school.location || '',
      school_type: school.school_type || 'primary'
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    updateSchool.mutate({ id: selectedSchool.id, data: formData });
  };

  const filteredSchools = useMemo(() => {
    if (!schools) return [];
    return schools.filter(school =>
      (!filter.name || school.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (!filter.location || (school.location && school.location.toLowerCase().includes(filter.location.toLowerCase()))) &&
      (!filter.school_type || school.school_type === filter.school_type)
    );
  }, [schools, filter]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">School Management</h1>
        <Link
          to="/schools/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" /> Add School
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by Name"
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
          className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Filter by Location"
          value={filter.location}
          onChange={e => setFilter(f => ({ ...f, location: e.target.value }))}
          className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
        <select
          value={filter.school_type}
          onChange={e => setFilter(f => ({ ...f, school_type: e.target.value }))}
          className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        >
          <option value="">All Types</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="nursery">Nursery</option>
        </select>
      </div>

      {/* Schools Table */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Motto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">Loading schools...</td>
              </tr>
            ) : filteredSchools.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">No schools found.</td>
              </tr>
            ) : (
              filteredSchools.map(school => (
                <tr key={school.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4">{school.name}</td>
                  <td className="px-6 py-4">{school.motto}</td>
                  <td className="px-6 py-4">{school.school_type}</td>
                  <td className="px-6 py-4">{school.email} / {school.phone1}</td>
                  <td className="px-6 py-4">{school.location}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button 
                      onClick={() => handleViewSchool(school)} 
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <Link
                      to={`/schools/${school.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit School"
                    >
                      <FaEdit />
                    </Link>
                    <button 
                      onClick={() => handleDelete(school.id)} 
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete School"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View School Modal */}
      {showViewModal && selectedSchool && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-4 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedSchool.name}
                  </h3>
                  {selectedSchool.motto && (
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 italic">
                      "{selectedSchool.motto}"
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ml-4"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School Type</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {selectedSchool.school_type || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSchool.location || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSchool.email || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Phone</label>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSchool.phone1 || 'Not specified'}
                    </p>
                  </div>
                  
                  {selectedSchool.phone2 && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondary Phone</label>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedSchool.phone2}
                      </p>
                    </div>
                  )}
                  
                  {selectedSchool.website && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                      <p className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
                        <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {selectedSchool.website}
                        </a>
                      </p>
                    </div>
                  )}
                  
                  {selectedSchool.staff_suffix && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Staff Suffix</label>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedSchool.staff_suffix}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
                <Link
                  to={`/schools/${selectedSchool.id}/edit`}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setShowViewModal(false)}
                >
                  Edit School
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllSchools; 