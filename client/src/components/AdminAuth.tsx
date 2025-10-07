import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast, Toaster } from "sonner";
import api from "../api/axios"; // import your axios instance
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "signup";

export function AdminAuth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (mode === "signup" && !confirmPassword)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        // Use api instance
        const res = await api.post("/auth/login", { email, password });
        toast.success("Logged in successfully!");
        localStorage.setItem("adminToken", res.data.token);
        navigate("/dashboard");
        console.log(res.data); // handle token/session
      } else {
        const res = await api.post("/auth/register", { email, password });
        toast.success("Account created successfully!");
        setMode("login");
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <div className="max-w-2xl w-full mx-4 sm:mx-6 md:mx-auto bg-white p-12 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Admin Login" : "Admin Signup"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Signup"}
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
