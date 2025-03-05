import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
function LogIn() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [user, setUser] = useState({});
  const [token, setToken] = useState("token");
  const { decodedToken, isExpired } = useJwt(token);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (email === "") {
      setErrorMsg("E-mail field cannot be empty.");
    } else if (password === "") {
      setErrorMsg("Password field cannot be empty.");
    } else {
      setUser({
        email: email,
        password: password,
      });
    try {
      const response = await axios.post("http://100.86.72.40:5000/login", { email, password });
  
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);
  
      // Ensure response.data is correctly structured
      if (response.status === 200) {
        const token = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        const role =response.data.role;
  
        // Store token
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("refreshToken", refreshToken, {
          expires: 7,
        });
        setToken(token);
                  // get the user's information
                  const userResponse = await axios.get(
                    "http://100.86.72.40:5000/auth/redirect",
                    {
                      headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                      },
                    }
                  );
                  setUser(userResponse.data);

        // Redirect based on role
        if (role === "admin" ) {
          console.log("Admin");
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        console.error("Missing access_token or role in response");
        alert("Unexpected response format. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
  
      if (error.response) {
        console.log("Error Response Data:", error.response.data);
        alert(error.response.data.msg || "Login failed. Please try again.");
      } else {
        alert("An error occurred. Please check your connection.");
      }
    }}
  };
  
  
const buttonStyles = {
    backgroundColor: '#18B2B2',
    color: 'white',
};
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
<div className="w-full max-w-md bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl p-8">
<div className="text-center mb-8">
<h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h1>
<p className="text-gray-600">Please enter your details to sign in</p>
</div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>

          </div>

          <button
  type="submit"
  className="w-full h-full pt-2 pb-2 rounded bg-[#18B2B2] text-white hover:bg-teal-600  border border-[#18B2B2]"
>
  Sign in
</button>



        </form>
      </div>
    </div>
  );
}

export default LogIn;
