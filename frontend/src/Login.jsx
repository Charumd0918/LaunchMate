import { useState } from "react";
import api from "./api";

function Login({ setPage, intendedPage, setIntendedPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  );

  const handleReset = async () => {
    setApiError("");
    setApiSuccess("");
    let newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!newPassword) {
        newErrors.newPassword = "New password is required";
    } else {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordPattern.test(newPassword)) {
          newErrors.newPassword = "Min 8 chars, include uppercase, lowercase & number";
        }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const response = await api.post("/auth/reset-password", { 
        email, 
        new_password: newPassword 
      });
      setApiSuccess(response.data.message);
      setTimeout(() => {
        setIsForgot(false);
        setIsLogin(true);
        setApiSuccess("");
      }, 2000);
    } catch (error) {
      setApiError(error.response?.data?.detail || "Could not reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};
    setApiError("");
    setApiSuccess("");

    // Name (only signup)
    if (!isLogin && !name) {
      newErrors.name = "Name is required";
    }

    // Email
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        newErrors.email = "Enter a valid email";
      }
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordPattern.test(password)) {
        newErrors.password =
          "Min 8 chars, include uppercase, lowercase & number";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("launchmate_token", response.data.access_token);
        localStorage.setItem("launchmate_is_logged_in", "true");
      } else {
        const response = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("launchmate_token", response.data.access_token);
        localStorage.setItem("launchmate_is_logged_in", "true");
      }
      
      const activeIdea = localStorage.getItem("launchmate_active_idea");
      
      if (intendedPage) {
        setPage(intendedPage);
        setIntendedPage(null);
      } else if (activeIdea) {
        setPage("dashboard");
      } else {
        setPage("input");
      }
      
    } catch (error) {
      console.error("Auth error:", error);
      if (!error.response) {
        setApiError("Cannot connect to server. Is the backend running?");
      } else if (error.response.data && error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          setApiError(error.response.data.detail[0].msg);
        } else {
          setApiError(error.response.data.detail);
        }
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#0d001a] via-black to-[#200040]">

      {/* Glass Card */}
      <div className="backdrop-blur-md bg-purple-900/10 
      border border-purple-500/20 
      p-8 rounded-xl shadow-lg w-[90%] max-w-md transition-all duration-500">

        {/* Title */}
        <h2 className="text-2xl font-bold text-purple-300 text-center mb-6">
          {isForgot ? "Reset Password 🔐" : (isLogin ? "Welcome to LaunchMate 🚀" : "Create Account 🚀")}
        </h2>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-2 rounded mb-4 text-sm text-center">
            {apiError}
          </div>
        )}

        {apiSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-2 rounded mb-4 text-sm text-center">
            {apiSuccess}
          </div>
        )}

        {/* Name (Signup Only) */}
        {!isLogin && !isForgot && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`w-full p-3 mb-1 rounded-md 
              bg-black/40 text-white 
              border ${errors.name ? "border-red-500" : "border-purple-500/20"}
              focus:outline-none focus:ring-2 focus:ring-purple-600`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mb-2">{errors.name}</p>
            )}
          </>
        )}

        {/* Email (All Modes) */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          className={`w-full p-3 mb-1 rounded-md 
          bg-black/40 text-white 
          border ${errors.email ? "border-red-500" : "border-purple-500/20"}
          focus:outline-none focus:ring-2 focus:ring-purple-600`}
        />
        {errors.email && (
          <p className="text-red-400 text-xs mb-2">{errors.email}</p>
        )}

        {/* Password (Login/Signup Only) */}
        {!isForgot && (
          <>
            <div className="relative mb-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full p-3 rounded-md 
                bg-black/40 text-white 
                border ${errors.password ? "border-red-500" : "border-purple-500/20"}
                focus:outline-none focus:ring-2 focus:ring-purple-600`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/60 hover:text-purple-300 transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mb-2">
                {errors.password}
              </p>
            )}
            
            <p 
                onClick={() => setIsForgot(true)}
                className="text-right text-xs text-purple-400 cursor-pointer mb-4 hover:underline"
            >
              Forgot password?
            </p>
          </>
        )}

        {/* New Password (Forgot Mode Only) */}
        {isForgot && (
            <>
                <div className="relative mb-1">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, newPassword: "" }));
                        }}
                        className={`w-full p-3 rounded-md 
                        bg-black/40 text-white 
                        border ${errors.newPassword ? "border-red-500" : "border-purple-500/20"}
                        focus:outline-none focus:ring-2 focus:ring-purple-600`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/60 hover:text-purple-300 transition-colors"
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
                {errors.newPassword && (
                    <p className="text-red-400 text-xs mb-2">{errors.newPassword}</p>
                )}
                
                <p 
                    onClick={() => setIsForgot(false)}
                    className="text-right text-xs text-purple-400 cursor-pointer mb-4 hover:underline"
                >
                    Back to Login
                </p>
            </>
        )}

        {/* Primary Action Button */}
        <button
          onClick={isForgot ? handleReset : handleSubmit}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-md font-semibold 
          text-purple-300 
          bg-purple-500/10 backdrop-blur-md 
          border border-purple-400/20 
          hover:bg-purple-500/20 
          hover:shadow-[0_0_25px_rgba(128,0,255,0.4)] 
          transition duration-300
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
        >
          {isLoading ? "Processing..." : (isForgot ? "Update Password" : (isLogin ? "Login" : "Sign Up"))}
        </button>

        {/* Toggle between Login/Signup */}
        {!isForgot && (
            <p className="text-gray-400 text-sm text-center mt-4">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-400 cursor-pointer ml-1 hover:underline"
            >
                {isLogin ? "Sign up" : "Login"}
            </span>
            </p>
        )}

      </div>
    </div>
  );
}

export default Login;