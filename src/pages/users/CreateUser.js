import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { creatableUserRoles } from '../../utils/schoolStaffUserPolicy';

const CreateUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const creatableRoles = creatableUserRoles(currentUser?.role);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    school_id: '',
    class_id: '',
    subject_id: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    profile_picture: null,
    designation: '',
    emergency_contact: '',
    national_id: '',
    notes: ''
  });

  // Fetch schools
  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: () => api.schools.getAll().then(res => res.data)
  });

  const schoolsList = useMemo(() => {
    if (!schools) return [];
    if (currentUser?.role === 'admin') return schools;
    if (currentUser?.school_id != null) {
      return schools.filter((s) => Number(s.id) === Number(currentUser.school_id));
    }
    return schools;
  }, [schools, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'director' || currentUser.role === 'head_teacher') {
      if (currentUser.school_id != null) {
        setFormData((prev) => ({
          ...prev,
          school_id: String(currentUser.school_id)
        }));
      }
    }
  }, [currentUser]);

  // Debug: Log schools data when it changes
  useEffect(() => {
    if (schools) {
      console.log('Schools data loaded:', schools);
    }
  }, [schools]);

  // Debug: Log form data when school_id changes
  useEffect(() => {
    if (formData.school_id) {
      console.log('School ID selected:', formData.school_id, typeof formData.school_id);
      const selectedSchool = schoolsList.find(s => Number(s.id) === Number(formData.school_id));
      console.log('Selected school:', selectedSchool);
    }
  }, [formData.school_id, schools]);

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ['classes', formData.school_id],
    queryFn: () => api.classes.getAll({ school_id: formData.school_id }).then(res => res.data),
    enabled: formData.school_id !== ''
  });

  // Fetch subjects
  const { data: subjects } = useQuery({
    queryKey: ['subjects', formData.school_id],
    queryFn: () => api.subjects.getAll({ school_id: formData.school_id }).then(res => res.data),
    enabled: formData.school_id !== ''
  });

  // Role short codes mapping
  const roleShortMap = useMemo(() => ({
    director: 'DR',
    head_teacher: 'HT',
    bursar: 'BU',
    class_teacher: 'CT',
    subject_teacher: 'ST',
  }), []);

  // State for tracking current user count
  const [currentUserCount, setCurrentUserCount] = useState(0);

  // Generate a unique username
  const generateUsername = useCallback(async (schoolId, role) => {
    if (!schoolId || !role || !schoolsList?.length) return '';
    
    try {
      // Get school data
      const selectedSchool = schoolsList.find(school => Number(school.id) === Number(schoolId));
      if (!selectedSchool) return '';
      
      // Get school suffix (fallback to school name if no suffix)
      const schoolSuffix = selectedSchool.staff_suffix || selectedSchool.name.substring(0, 3).toUpperCase();
      const roleShort = roleShortMap[role] || '';
      
      if (!schoolSuffix || !roleShort) return '';
      
      // Get current count for this school + role combination
      let currentCount = 0;
      try {
        const res = await api.users.getCount(schoolId, role);
        currentCount = res.data.count || 0;
        setCurrentUserCount(currentCount); // Update the state for display
      } catch (error) {
        console.warn('Could not fetch user count, using 0:', error);
        currentCount = 0;
        setCurrentUserCount(0);
      }
      
      // Generate username with retry logic for uniqueness
      let username = '';
      let attempt = 0;
      const maxAttempts = 10;
      
      do {
        const nextNumber = (currentCount + attempt + 1).toString().padStart(3, '0');
        username = `${schoolSuffix}-${roleShort.toLowerCase()}${nextNumber}`;
        attempt++;
        
        // Check if username already exists (only if we have the count endpoint working)
        if (attempt > 1) {
          try {
            // We could add a username check endpoint here if needed
            // For now, we'll rely on the count being accurate
            break;
          } catch (error) {
            console.warn('Username check failed, continuing:', error);
          }
        }
      } while (attempt < maxAttempts);
      
      return username;
    } catch (error) {
      console.error('Error generating username:', error);
      return '';
    }
  }, [schoolsList, roleShortMap]);

  // Generate username when school or role changes
  useEffect(() => {
    const updateUsername = async () => {
      if (formData.school_id && formData.role) {
        const username = await generateUsername(formData.school_id, formData.role);
        if (username) {
          setFormData(prev => ({ ...prev, username }));
        }
      } else {
        setFormData(prev => ({ ...prev, username: '' }));
      }
    };
    
    updateUsername();
  }, [formData.school_id, formData.role, generateUsername]);

  // Create user mutation
  const createUser = useMutation({
    mutationFn: (userData) => api.users.create(userData).then(res => res.data),
    onSuccess: (data, variables) => {
      console.log('User created successfully:', data);
      toast.success(`User "${variables.name}" created successfully with username: ${variables.username}`);
      queryClient.invalidateQueries(['users']);
      navigate('/users');
    },
    onError: (error) => {
      console.error('Create user error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error || 'Validation error';
        toast.error(errorMessage);
      } else if (error.response?.status === 409) {
        toast.error('User with this email or username already exists');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again or contact support.');
      } else {
        toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to create user. Please try again.');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'role', 'school_id'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    // Validate role-specific requirements
    if (formData.role === 'class_teacher' && !formData.class_id) {
      toast.error('Please select a class for class teacher role');
      return;
    }
    
    if (formData.role === 'subject_teacher' && !formData.subject_id) {
      toast.error('Please select a subject for subject teacher role');
      return;
    }
    
    // Create a clean data object without the file
    const submitData = { ...formData };
    delete submitData.profile_picture; // Remove file for now, handle separately if needed
    
    // Ensure username is generated
    if (!submitData.username) {
      toast.error('Username generation failed. Please try again.');
      return;
    }
    
    console.log('Submitting user data:', submitData);
    createUser.mutate(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New User</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              required
              placeholder="Enter full name (e.g., John Doe)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              required
            />
          </div>

          {/* Username Preview Section */}
          {(formData.school_id || formData.role) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">Username Preview</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">School ID:</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {formData.school_id || 'Not selected'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">School:</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {schoolsList.find(s => Number(s.id) === Number(formData.school_id))?.name || 'Not selected'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">School Suffix:</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {(() => {
                      const selectedSchool = schoolsList.find(s => Number(s.id) === Number(formData.school_id));
                      return selectedSchool?.staff_suffix || 
                             selectedSchool?.name?.substring(0, 3).toUpperCase() || 
                             'N/A';
                    })()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Role:</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {formData.role ? formData.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Role Code:</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {roleShortMap[formData.role] || 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Current Users:</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {formData.school_id && formData.role ? currentUserCount : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Next Sequence:</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {formData.school_id && formData.role ? (currentUserCount + 1).toString().padStart(3, '0') : 'N/A'}
                  </span>
                </div>
                
                <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Generated Username:</span>
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                      {formData.username || 'Pending...'}
                    </span>
                  </div>
                  
                  {/* Username breakdown */}
                  {formData.username && (
                    <div className="bg-white dark:bg-blue-800/50 rounded p-2 border border-blue-200 dark:border-blue-700">
                      <div className="text-xs text-blue-600 dark:text-blue-300 mb-1">Username Breakdown:</div>
                      <div className="flex items-center space-x-1 text-xs">
                        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-1 rounded">
                          {(() => {
                            const selectedSchool = schoolsList.find(s => Number(s.id) === Number(formData.school_id));
                            return selectedSchool?.staff_suffix || 
                                   selectedSchool?.name?.substring(0, 3).toUpperCase() || 
                                   'N/A';
                          })()}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-1 rounded">
                          {roleShortMap[formData.role]?.toLowerCase()}
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-1 rounded">
                          {(currentUserCount + 1).toString().padStart(3, '0')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
                required
                readOnly
                placeholder={formData.school_id && formData.role ? "Generating username..." : "Select school and role first"}
              />
              {formData.school_id && formData.role && !formData.username && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formData.username 
                ? `Final username: ${formData.username}`
                : formData.school_id && formData.role 
                  ? "Generating username..." 
                  : "Username will be automatically generated based on school, role, and sequence"
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">School</label>
            <select
              name="school_id"
              value={formData.school_id}
              onChange={handleChange}
              disabled={currentUser?.role === 'director' || currentUser?.role === 'head_teacher'}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400 disabled:opacity-60 disabled:cursor-not-allowed"
              required
            >
              <option value="">Select School</option>
              {schoolsList.map(school => (
                <option key={school.id} value={school.id} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              required
            >
              <option value="">Select Role</option>
              {creatableRoles === null ? (
                <>
                  <option value="director">Director</option>
                  <option value="head_teacher">Head Teacher</option>
                  <option value="bursar">Bursar</option>
                  <option value="class_teacher">Class Teacher</option>
                  <option value="subject_teacher">Subject Teacher</option>
                </>
              ) : (
                creatableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))
              )}
            </select>
          </div>

          {formData.role === 'class_teacher' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Class</label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              >
                <option value="">Select Class</option>
                {classes?.map(classItem => (
                  <option key={classItem.id} value={classItem.id} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.role === 'subject_teacher' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Subject</label>
                <select
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
                >
                  <option value="">Select Subject</option>
                  {subjects?.map(subject => (
                    <option key={subject.id} value={subject.id} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Classes</label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
                >
                  <option value="">Select Class</option>
                  {classes?.map(classItem => (
                    <option key={classItem.id} value={classItem.id} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-900 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</label>
            <input
              type="tel"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">National ID</label>
            <input
              type="text"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUser.isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
              {createUser.isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser; 