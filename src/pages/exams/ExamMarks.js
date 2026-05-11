import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ExamMarks = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', marks: '' },
    { id: 2, name: 'Jane Smith', marks: '' },
    { id: 3, name: 'Mike Johnson', marks: '' },
  ]);

  const handleMarksChange = (studentId, value) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, marks: value }
          : student
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement marks submission logic
    console.log('Marks submitted:', students);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Exam Marks</h1>
        
        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="number"
                              value={student.marks}
                              onChange={(e) => handleMarksChange(student.id, e.target.value)}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                              min="0"
                              max="100"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Marks
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExamMarks; 