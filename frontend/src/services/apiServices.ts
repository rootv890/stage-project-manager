import {
  OrderBy,
  OrderByType,
  OrderType,
  ResponseType,
  UserCourseType,
  UsersType,
} from "@/types/types";
import axios, {
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
  password: string;
  clerkUserID: string;
  firstName?: string;
  image_url?: string;
  lastName?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

// Course data type
type Course = {
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

export const createNewUser = async (
  userData: UserData
): Promise<AxiosFetchedDataType<UsersType>> => {
  try {
    const response = await api.post(`/clerk-webhook`, {
      type: "user.created",
      data: {
        ...userData,
        createdAt: new Date(),
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw new Error("Error creating user. Please check the provided data.");
  }
};

// 2. Fetch user ID using Clerk ID
export const fetchUserIdByClerkId = async (clerkId: string) => {
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
