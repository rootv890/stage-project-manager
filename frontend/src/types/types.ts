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
export type OrderByType = keyof CoursesType;

export type CoursesType = {
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

export type UsersType = {
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

export type MentorsType = {
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

export type UserCourseType = {
  id: number;
  userId: number;
  courseId: number;
  mentorId: number;
  status?: string;
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ResponseType = {
  data: any;
  success: boolean;
  message: string;
};

// Type for the metadata object
export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// Main response type for user courses data
export interface UserCoursesResponse {
  data: UserCourseType[];
  metadata: PaginationMetadata;
}
