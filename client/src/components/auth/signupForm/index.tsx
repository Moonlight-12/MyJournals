"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignupData {
  email: string;
  password: string;
  username?: string;
  createdAt: string;
}

interface SignupResponse {
  success?: boolean;
  userId?: string;
  error?: string;
  message?: string;
}

async function Signup(data: SignupData): Promise<SignupResponse> {
  const { email, password, username, createdAt } = data;

  const response = await fetch("http://localhost:4000/api/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, email, password, createdAt }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { error: result.error };
  }

  return result;
}

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in the email and password field");
      return;
    }

    const createdAt = new Date().toISOString();

    const response = await Signup({ email, password, username, createdAt });
    if (response.error) {
      setError(response.error);
    } else if (response.success) {
      setEmail("");
      setPassword("");
      setUsername("");
      setSuccess(response.message ?? "");
      router.push("/signin");
      console.log(response.userId, response.message);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="rounded-md border-[#48A6A7] p-4 shadow-lg border-t-4">
        <div className="text-lg font-semibold my-4">Signup</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
              setSuccess("");
            }}
            type="text"
            placeholder="Username(optional)"
            className="rounded"
          />
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setSuccess("");
            }}
            type="email"
            placeholder="Email"
            className="rounded"
          />
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
              setSuccess("");
            }}
            type="password"
            placeholder="Password"
            className="rounded"
          />
          <button
            type="submit"
            className="border bg-[#48A6A7]/90 py-2 cursor-pointer"
          >
            Signup
          </button>

          {error && (
            <div className="bg-red-500 w-fit text-sm py-1 px-3 rounded-md text-white mt-2">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 w-fit text-sm py-1 px-3 rounded-md text-white mt-2">
              {success}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={"/signin"}>
            Already have an account? <span className="underline">Signin</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
