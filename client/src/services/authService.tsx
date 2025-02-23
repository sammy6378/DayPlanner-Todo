import apiClient from '../utils/api'

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

interface loginData {
  email: string;
  password: string;
}

// Register user function
export const registerUser = async (userData: RegisterUserData) => {
  try {
    const response = await apiClient.post("/user/user-register", userData);
    return response.data; // Return success response
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};


// login user
export const loginUser = async (userData: loginData) =>{
try {
    const response = await apiClient.post("/user/user-login", userData);
    return response.data; // Return success response
} catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
}
}