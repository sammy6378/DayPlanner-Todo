"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/authService";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import './globals.css'
import { SyncLoader } from "react-spinners";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser(userData);
      setMessage(response.message);
      setUserData({ email: "", password: "" }); // Clear form on success
      // Redirect to home page
      router.push("/home-page"); 
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message || "An unexpected error occurred. Please try again.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-6">Sign In</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              required
              className="w-full border text-black border-gray-300 rounded-md p-3 text-lg pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {/* Eye Icon for Toggle */}
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition duration-300 flex justify-center items-center"
          >
            {isLoading ? <SyncLoader color="white" size={8} /> : "Sign In"}
          </button>
        </form>

        {/* Display error/success message */}
        {message && (
          <p className="text-red-600 mt-4 text-center bg-red-100 py-2 px-4 rounded-md">
            {message}
          </p>
        )}

        {/* Register Link */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Not Registered?{" "}
          <Link href="/user-register" className="text-purple-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
