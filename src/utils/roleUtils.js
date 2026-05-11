// Role definitions and permissions
export const ROLES = {
  ADMIN: 'admin',
  DIRECTOR: 'director',
  HEAD_TEACHER: 'head_teacher',
  BURSAR: 'bursar',
  CLASS_TEACHER: 'class_teacher',
  SUBJECT_TEACHER: 'subject_teacher',
  STUDENT: 'student'
};

// Permission definitions
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  
  // User Management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  
  // Student Management
  MANAGE_STUDENTS: 'manage_students',
  VIEW_STUDENTS: 'view_students',
  
  // Class Management
  MANAGE_CLASSES: 'manage_classes',
  VIEW_CLASSES: 'view_classes',
  
  // Subject Management
  MANAGE_SUBJECTS: 'manage_subjects',
  VIEW_SUBJECTS: 'view_subjects',
  
  // Exam Management
  MANAGE_EXAMS: 'manage_exams',
  VIEW_EXAMS: 'view_exams',
  
  // Marks Management
  MANAGE_MARKS: 'manage_marks',
  VIEW_MARKS: 'view_marks',
  
  // Attendance Management
  MANAGE_ATTENDANCE: 'manage_attendance',
  VIEW_ATTENDANCE: 'view_attendance',
  
  // Fees Management
  MANAGE_FEES: 'manage_fees',
  VIEW_FEES: 'view_fees',
  
  // Reports
  VIEW_REPORTS: 'view_reports',
  GENERATE_REPORTS: 'generate_reports',
  
  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  
  // Payments
  VIEW_PAYMENTS: 'view_payments',
  MANAGE_PAYMENTS: 'manage_payments'
};

// Define permissions for each role
const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.MANAGE_SUBJECTS,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.MANAGE_EXAMS,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.MANAGE_MARKS,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_FEES,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.MANAGE_PAYMENTS
  ],
  director: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.MANAGE_SUBJECTS,
    PERMISSIONS.MANAGE_EXAMS,
    PERMISSIONS.MANAGE_MARKS,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.MANAGE_FEES,
    PERMISSIONS.MANAGE_PAYMENTS
  ],
  head_teacher: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.MANAGE_SUBJECTS,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.MANAGE_EXAMS,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.MANAGE_MARKS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  bursar: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.MANAGE_FEES,
    PERMISSIONS.MANAGE_PAYMENTS
  ],
  class_teacher: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.MANAGE_MARKS
  ],
  subject_teacher: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_CLASSES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_MARKS
  ],
  student: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MARKS,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_PAYMENTS
  ]
};

// Check if a role has a specific permission
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

// Get all permissions for a role
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Get all available roles
export const getAvailableRoles = () => {
  return Object.keys(ROLE_PERMISSIONS);
};

// Helper functions
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Navigation items based on role
export const getNavigationItems = (userRole) => {
  const allItems = [
    { name: 'Dashboard', href: '/', icon: 'HomeIcon', permission: PERMISSIONS.VIEW_ANALYTICS },
    { name: 'Students', href: '/students', icon: 'UserGroupIcon', permission: PERMISSIONS.VIEW_STUDENTS },
    { name: 'Classes', href: '/classes', icon: 'AcademicCapIcon', permission: PERMISSIONS.VIEW_CLASSES },
    { name: 'Subjects', href: '/subjects', icon: 'BookOpenIcon', permission: PERMISSIONS.VIEW_SUBJECTS },
    { name: 'Exams', href: '/exams', icon: 'ClipboardDocumentListIcon', permission: PERMISSIONS.VIEW_EXAMS },
    { name: 'Marks', href: '/marks', icon: 'ChartBarIcon', permission: PERMISSIONS.VIEW_MARKS },
    { name: 'Attendance', href: '/attendance', icon: 'CalendarIcon', permission: PERMISSIONS.VIEW_ATTENDANCE },
    { name: 'Fees', href: '/fees', icon: 'CurrencyDollarIcon', permission: PERMISSIONS.VIEW_FEES },
    { name: 'Reports', href: '/reports', icon: 'DocumentTextIcon', permission: PERMISSIONS.VIEW_REPORTS },
    { name: 'Profile', href: '/profile', icon: 'UserCircleIcon' }
  ];

  return allItems.filter(item => !item.permission || hasPermission(userRole, item.permission));
}; 