// Client-side shared types (mirrors server-side schema types)
export type UserRole =
  | "super_admin"
  | "admin"
  | "director"
  | "head_teacher"
  | "class_teacher"
  | "subject_teacher"
  | "bursar";

export type School = {
  id: string;
  name: string;
  abbreviation: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  subdomain?: string;
  motto?: string;
  schoolType?: "nursery" | "primary" | "secondary" | "nursery_primary" | "primary_secondary" | "all";
  sectionType?: "day" | "boarding" | "day_boarding";
  bankAccountTitle?: string;
  bankAccountType?: "savings" | "current" | "fixed_deposit";
  bankAccountNumber?: string;
  bankName?: string;
  status?: "active" | "trial" | "suspended" | "expired";
  createdAt: Date;
  updatedAt: Date;
};

export type InsertSchool = Omit<School, "id" | "createdAt" | "updatedAt">;

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  schoolId: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertUser = Omit<User, "id" | "createdAt" | "updatedAt">;

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth: Date;
  gender: "male" | "female";
  classId: string;
  schoolId: string;
  paymentCode: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  address: string;
  section?: "day" | "boarding";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertStudent = Omit<Student, "id" | "paymentCode" | "createdAt" | "updatedAt">;

export type Class = {
  id: string;
  name: string;
  level: string;
  section?: string;
  schoolId: string;
  classTeacherId?: string;
  academicYear: string;
  maxStudents?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertClass = Omit<Class, "id" | "createdAt" | "updatedAt">;

export type Subject = {
  id: string;
  name: string;
  code: string;
  description?: string;
  schoolId: string;
  teacherId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertSubject = Omit<Subject, "id" | "createdAt" | "updatedAt">;

export type Exam = {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  classId: string;
  schoolId: string;
  date: Date;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  examType: "quiz" | "midterm" | "final" | "assignment";
  createdAt: Date;
  updatedAt: Date;
};

export type InsertExam = Omit<Exam, "id" | "createdAt" | "updatedAt">;

export type Mark = {
  id: string;
  examId: string;
  studentId: string;
  schoolId: string;
  marksObtained: number;
  remarks?: string;
  gradedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertMark = Omit<Mark, "id" | "createdAt" | "updatedAt">;

export type Attendance = {
  id: string;
  studentId: string;
  classId: string;
  schoolId: string;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertAttendance = Omit<Attendance, "id" | "createdAt" | "updatedAt">;

export type FeeStructure = {
  id: string;
  name: string;
  description?: string;
  amount: number;
  dueDate: Date;
  classId?: string;
  schoolId: string;
  academicYear: string;
  isOptional: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertFeeStructure = Omit<FeeStructure, "id" | "createdAt" | "updatedAt">;

export type Payment = {
  id: string;
  studentId: string;
  feeStructureId: string;
  schoolId: string;
  paymentCode: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "mobile_money" | "card";
  provider?: "mtn" | "airtel" | "bank" | "other";
  phoneNumber?: string;
  transactionRef?: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paidAt?: Date;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertPayment = Omit<Payment, "id" | "createdAt" | "updatedAt">;

