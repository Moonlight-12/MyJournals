"use client";

import { useState } from "react";
import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface EditProfileButtonProps {
  userId: string;
  initialUsername: string;
  initialEmail: string;
}

export function EditProfileButton({
  userId,
  initialUsername,
  initialEmail,
}: EditProfileButtonProps) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSave = async () => {
    if (!session?.accessToken) {
      setError("Authentication required");
      console.log("No access token:", session);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Send the update request to your API
      const response = await fetch("http://localhost:4000/api/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Set success state
      setUpdateSuccess(true);
      setIsEditing(false);

      // Wait a moment before refreshing to allow session update to complete
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
    // Reset form values to original values
    setUsername(initialUsername);
    setEmail(initialEmail);
    setIsEditing(false);
    setError("");
  };

  if (updateSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Profile Updated</h2>
          <p className="mb-4">Your profile has been updated successfully!</p>
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
      <div
        className="cursor-pointer hover:text-blue-500"
        onClick={() => setIsEditing(true)}
      >
        <IconEdit />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-500 rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
