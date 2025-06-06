"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

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

  const response = await fetch(`${process.env.APP_API_URL}/api/signup`, {
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

          <div className="flex items-center my-2">
            <hr className="flex-grow"></hr>
            <span className="px-3">OR</span>
            <hr className="flex-grow"></hr>
          </div>
          <button
            onClick={() => signIn("github")}
            className="w-full bg-gray-900 text-white py-2 rounded flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.24c-3.338.727-4.033-1.415-4.033-1.415-.546-1.385-1.334-1.756-1.334-1.756-1.091-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.304 3.495.998.108-.775.419-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3.002-.403c1.018.005 2.04.137 3.002.403 2.295-1.552 3.3-1.23 3.3-1.23.645 1.653.24 2.873.105 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.921.43.372.81 1.103.81 2.223v3.293c0 .323.22.693.825.577C20.565 22.092 24 17.592 24 12c0-6.627-5.373-12-12-12" />
            </svg>
            Sign in with GitHub
          </button>

          {/* not working yet, need to provide credentials in auth nextJS */}
          <button className="w-full bg-neutral-100 text-black py-2 rounded flex items-center justify-center">
            <img
              src="/google-icon.svg"
              alt="GitHub Logo"
              className="w-6 h-6 mr-2"
            />
            Sign in with Google
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
