import {
  OrderBy,
  OrderByType,
  OrderType,
  ResponseType,
  UserCourseType,
  UsersType,
} from "@/types/types";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  HttpStatusCode,
} from "axios";

const API_URL = "http://localhost:5050/api";

// Configure Axios instance to avoid repeating `API_URL`
const api = axios.create({
  baseURL: API_URL,
});

// Common type for fetched data
type AxiosFetchedDataType<T = any> = {
  data: T;
  status: HttpStatusCode;
  headers: AxiosRequestHeaders;
  config: AxiosRequestConfig;
  request: XMLHttpRequest | any;
};

// User data type for creating users
interface UserData {
  username: string;
  email: string;
  clerkUserID: string;
  firstName?: string;
  image_url?: string;
  lastName?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

// Course data type
type CourseType = {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  status: string;
  duration: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

// Utility function to handle errors for logging and throwing
const handleError = (error: any) => {
  console.error("API error:", error);
  throw error;
};

// 1. Fetch user ID using Clerk ID
export const fetchStageIdByClerkId = async (clerkId: string) => {
  try {
    const response = await api.get(`/users/clerk/${clerkId}`);
    if (response.status === 200 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("User not found for the provided Clerk ID.");
    }
  } catch (error) {
    handleError(error);
    throw new Error(
      "Error fetching user by Clerk ID. Please ensure the Clerk ID is valid."
    );
  }
};

// 2. Create a new user
export const createNewUser = async (
  userData: UserData
): Promise<AxiosFetchedDataType<UsersType> | void> => {
  // Check if the user data is valid
  if (!userData) {
    throw new Error("User data is required to create a new user.");
  }
  // Check the user is already existing
  const existingUser = await fetchStageIdByClerkId(userData.clerkUserID);
  if (existingUser) {
    throw new Error("User already exists with the provided Clerk ID.");
  }
  // Create a new user
  try {
    const response = await api.post("/clerk-webhook", userData);
    if (response.status === 201 && response.data) {
      return response.data;
    } else {
      throw new Error("Error creating new user.");
    }
  } catch (error) {
    handleError(error);
    throw new Error("Error creating new user. Please try again.");
  }
};

// await createNewUser({
//   username: "testuser2",
//   email: "testemaily@gm.com2",
//   clerkUserID: "user_2oMt2SbypnGE0HNAnTr0OP4ht20",
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   firstName: "test",
//   image_url: "www.test.com",
//   lastName: "test 2",
// });

// 3. Get paginated user courses with sorting options
export const fetchUserCoursesById = async ({
  userId,
  page = 1,
  limit = 10,
  order = "desc",
  orderBy = "createdAt",
}: {
  userId: string;
  page?: number;
  limit?: number;
  order?: OrderType;
  orderBy?: OrderByType;
}) => {
  try {
    const response = await fetch(
      `${API_URL}/user-courses/${userId}?page=${page}&limit=${limit}&order=${order}&orderBy=${orderBy}`
    );

    const data = await response.json();
    return data as ResponseType;
  } catch (error) {
    handleError(error);
    throw new Error(
      "Error fetching user courses. Please check the user ID and try again."
    );
  }
};

// 4. Fetch mentor details by mentor ID
export const fetchMentorDetails = async (mentorId: string) => {
  try {
    const response = await api.get(`/mentors/${mentorId}`);
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error("Mentor not found for the provided ID.");
    }
  } catch (error) {
    handleError(error);
    throw new Error(
      "Error fetching mentor details. Please ensure the mentor ID is valid."
    );
  }
};

// 5. Fetch course details by course ID
export const fetchCourseDetails = async (courseId: string) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error("Course not found for the provided ID.");
    }
  } catch (error) {
    handleError(error);
    throw new Error(
      "Error fetching course details. Please ensure the course ID is valid."
    );
  }
};

// 6. Fetch specific course by user ID and course ID
export const fetchSpecificCourseByUser = async (
  userId: string,
  courseId: string
) => {
  try {
    const response = await api.get(`/user-courses/${userId}/${courseId}`);
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(
        "No matching course found for the specified user and course ID."
      );
    }
  } catch (error) {
    handleError(error);
    throw new Error(
      "Error fetching specific course. Please verify the user and course IDs."
    );
  }
};
