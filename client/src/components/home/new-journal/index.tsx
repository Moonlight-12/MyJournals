"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Import Shadcn UI Button
import { cn } from "@/utils/cn";

interface JournalData {
  success: boolean;
  message: string;
}

async function NewJournal(
  title: string,
  content: string,
  userId: string
): Promise<JournalData> {
  const response = await fetch("http://localhost:4000/api/journals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, userId }),
  });

  const data = await response.json();
  console.log("Server response:", data);
  return data;
}

interface CreateJournalProps {
  showJournalModal: boolean;
  setShowJournalModal: (value: boolean) => void;
}

export default function CreateJournal({
  showJournalModal,
  setShowJournalModal,
}: CreateJournalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session) {
      const data = await NewJournal(title, content, session.user.id);
      if (data.success) {
        setMessage("Journal created successfully");
        setShowJournalModal(false);
        setTimeout(() => window.location.reload(), 500);
      } else {
        setMessage("Failed to create journal");
      }
    }
  };

  if (!showJournalModal) return null; 

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={() => setShowJournalModal(false)}
    >
      <div
        className="relative bg-white border w-[90%] h-[90%] max-w-5xl rounded-lg p-4 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={() => setShowJournalModal(false)}
        >
          ✕
        </div>

        {/* Modal Title */}
        <h2 className="font-semibold text-3xl mb-4">Create Journal</h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-lg font-semibold">Title</label>
            <input
              type="text"
              className="w-full rounded px-2 py-1 border"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-1">Content</label>
            <textarea
              className="w-full px-2 py-1 border"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-[#2973B2] text-white rounded px-4 py-2">
            Save
          </Button>
        </form>

        {/* Success/Error Message */}
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
