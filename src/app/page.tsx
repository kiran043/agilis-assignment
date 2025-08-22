"use client";

import Input from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./store/slice/authSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ username: "", password: "" });

    let hasError = false;

    if (!username.trim()) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      hasError = true;
    }
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const result = await dispatch(
        loginUser({ username, password }) as any
      ).unwrap();

      toast.success(`Login Successful`);
      router.push("/productlist");
    
    } catch (err: any) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
