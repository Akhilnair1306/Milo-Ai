"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
// import {  useRouter } from "next/router"

const BotFace3D = dynamic(() => import("@/components/milo-bot/bot-face"), { ssr: false })

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
    patient_email: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
//   const router = new Router();
const router = useRouter();

  const API_BASE = "http://localhost:8000/api/v1" // ⚠️ change to your deployed FastAPI backend URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const endpoint = isSignup
      ? formData.role === "caregiver"
        ? `${API_BASE}/signup/caregiver`
        : `${API_BASE}/signup/user`
      : `${API_BASE}/login`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Something went wrong");

    if (!isSignup) {
      // Login successful
      localStorage.setItem("token", data.access_token);

      // Save user info to localStorage
      const userInfo = {
        email: data.user?.email || formData.email,
        role: data.user?.role || formData.role,
        id: data.user?.id || "",
        name: data.user?.name || "",
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      setSuccess("Login successful! Redirecting...");
      router.push("/dashboard");
    } else {
      setSuccess("Signup successful! You can now log in.");
      setIsSignup(false);
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F7F5F3] text-[#37322F]">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-[#F7F5F3]">
        <BotFace3D />
        <div className="max-w-md text-center space-y-6 mt-6">
          <h2 className="text-3xl font-semibold">Milo AI</h2>
          <p className="text-sm text-[rgba(55,50,47,0.7)] leading-relaxed">
            Keeping Hearts and Memories Connected — Empowering caregivers and patients with intelligent assistance.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif mb-2">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-[rgba(55,50,47,0.7)]">
              {isSignup ? "Join Milo AI today" : "Log in to continue with Milo AI"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <label className="text-sm" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-[#E0DEDB] bg-[#F7F5F3]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-[#E0DEDB] bg-[#F7F5F3] rounded-md p-2"
                  >
                    <option value="user">User</option>
                    <option value="caregiver">Caregiver</option>
                  </select>
                </div>

                {formData.role === "caregiver" && (
                  <div className="space-y-2">
                    <label className="text-sm" htmlFor="patient_email">
                      Patient Email
                    </label>
                    <Input
                      id="patient_email"
                      name="patient_email"
                      type="email"
                      placeholder="patient@example.com"
                      value={formData.patient_email}
                      onChange={handleChange}
                      className="border border-[#E0DEDB] bg-[#F7F5F3]"
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="border border-[#E0DEDB] bg-[#F7F5F3]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="border border-[#E0DEDB] bg-[#F7F5F3]"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#37322F] hover:bg-[#2F2A28] text-white rounded-full py-2 shadow-sm hover:shadow-md"
            >
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
            </Button>

            <p className="text-center text-sm text-[#605A57]">
              {isSignup ? "Already have an account?" : "New to Milo AI?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-[#37322F] font-medium hover:underline"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
