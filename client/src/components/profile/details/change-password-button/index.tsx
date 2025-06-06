"use client";

import { Button } from "@/components/ui/button";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ChangePasswordButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }
    if (!session?.accessToken) {
      setError("Authentication required");
      console.log("No access token:", session);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;
      const response = await fetch(
        `${API_URL}/api/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      
      setUpdateSuccess(true);
      setIsEditing(false);

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/signin" });
  };

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setIsEditing(false);
    setError("");
  };

  if (updateSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Password Updated</h2>
          <p className="mb-4">Your password has been updated successfully!</p>
          <p className="mb-4 text-sm text-gray-600">
            To ensure all changes are reflected, you may need to sign out and
            sign back in.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleSignOut}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <Button
        className="w-full bg-slate-800 hover:bg-slate-700 text-white"
        onClick={() => setIsEditing(true)}
      >
        Change password
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-500 rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-md flex items-center justify-center"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <IconCheck className="mr-1" size={16} />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md flex items-center justify-center"
            >
              <IconX className="mr-1" size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
