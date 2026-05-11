import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { classService } from '../../services/class';
import { schoolService } from '../../services/school';
import { useAuth } from '../../context/AuthContext';
import DatePicker from '../../components/common/DatePicker';

const CreateClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    school_id: user?.school_id || '',
    academic_year: new Date().getFullYear().toString(),
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set school_id from current user
    if (user?.school_id) {
      setFormData(prev => ({
        ...prev,
        school_id: user.school_id
      }));
    }
  }, [user?.school_id]);

  useEffect(() => {
    // Fetch schools for dropdown
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const schoolsData = await schoolService.getSchools();
        setSchools(schoolsData);
        
        // If user doesn't have a school_id and there are schools, select the first one
        if (!user?.school_id && schoolsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            school_id: schoolsData[0].id
          }));
        } else if (user?.school_id) {
          // If user has a school_id, use it
          setFormData(prev => ({
            ...prev,
            school_id: user.school_id
          }));
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        if (error.response?.status === 401) {
          toast.error('Please log in to access this feature');
        } else {
          toast.error('Failed to load schools');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [user?.school_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      academic_year: date
    }));
  };

  const validateForm = () => {
    console.log('validateForm called with formData:', formData);
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Class name is required';
    }
    if (!formData.section.trim()) {
      newErrors.section = 'Stream is required';
    }
    if (!formData.school_id) {
      newErrors.school_id = 'School is required';
    }
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSubmit = async (e) => {
    console.log('handleSubmit called!');
    e.preventDefault();
    console.log('Form validation result:', validateForm());
    if (!validateForm()) return;
    
    const payload = {
      name: formData.name,
      section: formData.section,
      school_id: formData.school_id,
      academic_year: formData.academic_year,
      description: formData.description
    };
    
    console.log('Submitting class data:', payload);
    console.log('User data:', user);
    
    try {
      setLoading(true);
      const response = await classService.createClass(payload);
      console.log('Class creation response:', response);
      toast.success('Class created successfully!');
      navigate('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to create class');
      setErrors(prev => ({ 
        ...prev, 
        submit: error.response?.data?.message || 'Failed to create class. Please try again.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/classes')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Classes
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Class</h1>
          <p className="text-gray-600 dark:text-gray-400">Add a new class to your school</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="name" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Class Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="e.g., Primary 1, Form 1"
              />
              {errors.name && (<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>)}
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section</label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Section</option>
                <option value="Lower Primary">Lower Primary</option>
                <option value="Nursery">Nursery</option>
                <option value="Upper Primary">Upper Primary</option>
              </select>
              {errors.section && (<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.section}</p>)}
            </div>

            <div>
              <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School</label>
              <select
                id="school_id"
                name="school_id"
                value={formData.school_id}
                onChange={handleChange}
                required
                disabled={loading}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a school</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              {errors.school_id && (<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.school_id}</p>)}
            </div>

            <div>
              <label htmlFor="academic_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Year</label>
              <DatePicker
                value={formData.academic_year}
                onChange={handleDateChange}
                placeholder="Select academic year"
                className="w-full"
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter class description (optional)"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/classes')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass; 