import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute, { RouteAccessGuard } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import ViewAllStudents from './pages/students/ViewAllStudents';
import CreateStudent from './pages/students/CreateStudent';
import EditStudent from './pages/students/EditStudent';
import StudentAnalytics from './pages/students/StudentAnalytics';
import PromoteStudents from './pages/students/PromoteStudents';
import Classes from './pages/classes/Classes';
import Subjects from './pages/subjects/Subjects';
import CreateSubject from './pages/subjects/CreateSubject';
import EditSubject from './pages/subjects/EditSubject';
import SubjectAnalytics from './pages/subjects/SubjectAnalytics';
import Exams from './pages/exams/Exams';
import CreateExam from './pages/exams/CreateExam';
import EditExam from './pages/exams/EditExam';
import ExamAnalytics from './pages/exams/ExamAnalytics';
import Marks from './pages/marks/Marks';
import MarksAnalytics from './pages/marks/MarksAnalytics';
import Attendance from './pages/attendance/Attendance';
import AttendanceAnalytics from './pages/attendance/AttendanceAnalytics';
import FeeStructure from './pages/fees/FeeStructure';
import StudentFees from './pages/fees/StudentFees';
import Payments from './pages/fees/Payments';
import FeeAnalytics from './pages/fees/FeeAnalytics';
import UserList from './pages/users/UserList';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
import Schools from './pages/schools/Schools';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Reports from './pages/reports/Reports';
import AcademicReports from './pages/reports/AcademicReports';
import FinancialReports from './pages/reports/FinancialReports';
import AttendanceReports from './pages/reports/AttendanceReports';
import CustomReports from './pages/reports/CustomReports';

// Route protection component that checks both authentication and role access
const RoleProtectedRoute = ({ children, path }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <RouteAccessGuard path={path}>{children}</RouteAccessGuard>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Route */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Students Routes */}
        <Route path="students" element={<RoleProtectedRoute path="/students"><ViewAllStudents /></RoleProtectedRoute>} />
        <Route path="students/create" element={<RoleProtectedRoute path="/students/create"><CreateStudent /></RoleProtectedRoute>} />
        <Route path="students/:id/edit" element={<RoleProtectedRoute path="/students"><EditStudent /></RoleProtectedRoute>} />
        <Route path="students/analytics" element={<RoleProtectedRoute path="/students/analytics"><StudentAnalytics /></RoleProtectedRoute>} />
        <Route path="students/promote" element={<RoleProtectedRoute path="/students/promote"><PromoteStudents /></RoleProtectedRoute>} />

        {/* Classes Routes */}
        <Route path="classes/*" element={<RoleProtectedRoute path="/classes"><Classes /></RoleProtectedRoute>} />

        {/* Subjects Routes */}
        <Route path="subjects" element={<RoleProtectedRoute path="/subjects"><Subjects /></RoleProtectedRoute>} />
        <Route path="subjects/create" element={<RoleProtectedRoute path="/subjects/create"><CreateSubject /></RoleProtectedRoute>} />
        <Route path="subjects/:id/edit" element={<RoleProtectedRoute path="/subjects"><EditSubject /></RoleProtectedRoute>} />
        <Route path="subjects/analytics" element={<RoleProtectedRoute path="/subjects/analytics"><SubjectAnalytics /></RoleProtectedRoute>} />

        {/* Exams Routes */}
        <Route path="exams" element={<RoleProtectedRoute path="/exams"><Exams /></RoleProtectedRoute>} />
        <Route path="exams/create" element={<RoleProtectedRoute path="/exams/create"><CreateExam /></RoleProtectedRoute>} />
        <Route path="exams/:id/edit" element={<RoleProtectedRoute path="/exams"><EditExam /></RoleProtectedRoute>} />
        <Route path="exams/analytics" element={<RoleProtectedRoute path="/exams/analytics"><ExamAnalytics /></RoleProtectedRoute>} />

        {/* Marks Routes */}
        <Route path="marks" element={<RoleProtectedRoute path="/marks"><Marks /></RoleProtectedRoute>} />
        <Route path="marks/analytics" element={<RoleProtectedRoute path="/marks/analytics"><MarksAnalytics /></RoleProtectedRoute>} />

        {/* Attendance Routes */}
        <Route path="attendance" element={<RoleProtectedRoute path="/attendance"><Attendance /></RoleProtectedRoute>} />
        <Route path="attendance/analytics" element={<RoleProtectedRoute path="/attendance/analytics"><AttendanceAnalytics /></RoleProtectedRoute>} />

        {/* Fees Routes */}
        <Route path="fees/structure/create" element={<RoleProtectedRoute path="/fees/structure/create"><FeeStructure /></RoleProtectedRoute>} />
        <Route path="fees/students" element={<RoleProtectedRoute path="/fees/students"><StudentFees /></RoleProtectedRoute>} />
        <Route path="fees/payments" element={<RoleProtectedRoute path="/fees/payments"><Payments /></RoleProtectedRoute>} />
        <Route path="fees/analytics" element={<RoleProtectedRoute path="/fees/analytics"><FeeAnalytics /></RoleProtectedRoute>} />

        {/* User Management Routes */}
        <Route path="users" element={<RoleProtectedRoute path="/users"><UserList /></RoleProtectedRoute>} />
        <Route path="users/create" element={<RoleProtectedRoute path="/users/create"><CreateUser /></RoleProtectedRoute>} />
        <Route path="users/:id/edit" element={<RoleProtectedRoute path="/users"><EditUser /></RoleProtectedRoute>} />

        {/* Schools Routes */}
        <Route path="schools/*" element={<RoleProtectedRoute path="/schools"><Schools /></RoleProtectedRoute>} />

        {/* Profile and Settings Routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />

        {/* Reports Routes */}
        <Route path="reports" element={<RoleProtectedRoute path="/reports"><Reports /></RoleProtectedRoute>} />
        <Route path="reports/academic" element={<RoleProtectedRoute path="/reports/academic"><AcademicReports /></RoleProtectedRoute>} />
        <Route path="reports/financial" element={<RoleProtectedRoute path="/reports/financial"><FinancialReports /></RoleProtectedRoute>} />
        <Route path="reports/attendance" element={<RoleProtectedRoute path="/reports/attendance"><AttendanceReports /></RoleProtectedRoute>} />
        <Route path="reports/custom" element={<RoleProtectedRoute path="/reports/custom"><CustomReports /></RoleProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 