import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NewClass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    className: '',
    section: '', // e.g., A, B, C or Day, Boarding
    classTeacher: '',
    description: '',
    capacity: '',
    academicYear: new Date().getFullYear().toString()
  });

  const [teachers] = useState([]);

  useEffect(() => {
    // Fetch teachers from API
    const fetchTeachers = async () => {
      try {
        // const response = await api.getTeachers();
        // setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to create class will go here
      toast.success('Class created successfully!');
      navigate('/dashboard/classes');
    } catch (error) {
      toast.error('Failed to create class');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Class</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., Form 1, Class 2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., A, B, C or Day, Boarding"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class Teacher</label>
            <select
              name="classTeacher"
              value={formData.classTeacher}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Class Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Academic Year</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Optional: Add any additional information about the class"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/classes')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Class
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewClass; 