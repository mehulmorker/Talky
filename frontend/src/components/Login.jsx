import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        const from = location.state?.from?.pathname || "/chat";
        navigate(from, { replace: true });
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's talk</h1>
          <p className="text-gray-600 text-sm">
            Sign in to your account to continue
          </p>
        </div>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
      </div>
    </div>
  );
};
