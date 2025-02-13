import apiClient from '../utils/api'

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

// Register user function
export const registerUser = async (userData: RegisterUserData) => {
  try {
    const response = await apiClient.post("/user/register", userData);
    return response.data; // Return success response
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
