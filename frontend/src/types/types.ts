export type StatusType =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "ARCHIVED"
  | "FUTURE"
  | "OUTDATED"
  | "ON_HOLD"
  | "CANCELLED";

export type OrderType = "desc" | "asc";
export type OrderBy = keyof Courses;

export type Courses = {
  id: number;
  mentorId: number;
  title: string;
  description?: string;
  websiteLink: string;
  imageUrl?: string;
  duration?: string;
  status?: string;
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Users = {
  id: number;
  clerkUserID: string;
  username: string;
  email: string;
  image_url?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Mentors = {
  id: number;
  name: string;
  imageUrl?: string;
  bio?: string;
  websiteLink: string;
  instagram?: string;
  linkedinLink?: string;
  twitterLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserCourse = {
  id: number;
  userId: number;
  courseId: number;
  mentorId: number;
  status?: string;
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
