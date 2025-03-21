"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleIsLoading, setGoogleIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        setError("invalid credentials");
        return;
      }
      router.replace("next-home");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGitHubSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("github", { callbackUrl: "/next-home" });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setGoogleIsLoading(true);

    try {
      await signIn("google", { callbackUrl: "/next-home" });
    } catch (error) {
      console.error("Google sign-in error", error);
      setGoogleIsLoading(false);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="rounded-md  p-4 shadow-lg ">
        <div className="text-lg font-semibold my-4 text-">Signin</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="rounded bg-white text-black"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="rounded bg-white text-black"
          />
          <button
            type="submit"
            className="border bg-[#2973B2]/90 py-2 cursor-pointer"
          >
            Signin
          </button>
          <div className="flex items-center my-2">
            <hr className="flex-grow"></hr>
            <span className="px-3">OR</span>
            <hr className="flex-grow"></hr>
          </div>
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-2 rounded flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.24c-3.338.727-4.033-1.415-4.033-1.415-.546-1.385-1.334-1.756-1.334-1.756-1.091-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.304 3.495.998.108-.775.419-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3.002-.403c1.018.005 2.04.137 3.002.403 2.295-1.552 3.3-1.23 3.3-1.23.645 1.653.24 2.873.105 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.921.43.372.81 1.103.81 2.223v3.293c0 .323.22.693.825.577C20.565 22.092 24 17.592 24 12c0-6.627-5.373-12-12-12" />
                </svg>
                Sign in with GitHub
              </>
            )}
          </button>

          {/* not working yet, need to provide credentials in auth nextJS */}
          <button
            disabled={googleIsLoading}
            className="w-full bg-neutral-100 text-black py-2 rounded flex items-center justify-center"
            onClick={handleGoogleSignIn}
          >
            {googleIsLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <img
                  src="/google-icon.svg"
                  alt="GitHub Logo"
                  className="w-6 h-6 mr-2"
                />
                Sign in with Google
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-500 w-fit text-sm py-1 px-3 rounded-md text-white mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right" href={"/signup"}>
            Don't have an account? <span className="underline">Signup</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
