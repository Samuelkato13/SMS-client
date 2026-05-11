import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NewSubject = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    class: '',
    teacher: '',
    assignedClasses: [],
    teachers: {}
  });

  useEffect(() => {
    // Fetch classes and teachers from API
    const fetchData = async () => {
      try {
        // TODO: Uncomment when API is ready
        // const [classesResponse, teachersResponse] = await Promise.all([
        //   api.getClasses(),
        //   api.getTeachers()
        // ]);
        // setClasses(classesResponse.data);
        // setTeachers(teachersResponse.data);

        // Temporary mock data for development
        const mockClasses = [
          { id: 1, className: 'Form 1', section: 'A' },
          { id: 2, className: 'Form 1', section: 'B' },
          { id: 3, className: 'Form 2', section: 'A' }
        ];
        const mockTeachers = [
          { id: 1, name: 'John Smith', subjects: ['Mathematics', 'Physics'] },
          { id: 2, name: 'Jane Doe', subjects: ['English', 'Literature'] },
          { id: 3, name: 'Mike Johnson', subjects: ['Chemistry', 'Biology'] }
        ];
        setClasses(mockClasses);
        setTeachers(mockTeachers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassAssignment = (classId, isChecked) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: isChecked
        ? [...prev.assignedClasses, classId]
        : prev.assignedClasses.filter(id => id !== classId)
    }));
  };

  const handleTeacherAssignment = (classId, teacherId) => {
    setFormData(prev => ({
      ...prev,
      teachers: {
        ...prev.teachers,
        [classId]: teacherId
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to create subject will go here
      toast.success('Subject created successfully!');
      navigate('/dashboard/subjects');
    } catch (error) {
      toast.error('Failed to create subject');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Subject</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Subject Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
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
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Assign to Classes</h2>
          <div className="space-y-4">
            {classes.map(cls => (
              <div key={cls.id} className="border rounded p-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`class-${cls.id}`}
                    checked={formData.assignedClasses.includes(cls.id)}
                    onChange={(e) => handleClassAssignment(cls.id, e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={`class-${cls.id}`} className="font-medium">
                    {cls.className} - {cls.section}
                  </label>
                </div>

                {formData.assignedClasses.includes(cls.id) && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium mb-1">
                      Assign Teacher
                    </label>
                    <select
                      value={formData.teachers[cls.id] || ''}
                      onChange={(e) => handleTeacherAssignment(cls.id, e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/subjects')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Subject
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSubject; 