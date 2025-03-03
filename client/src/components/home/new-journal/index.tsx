"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
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

export default function CreateJournal({className}:{className: string}) {
  const [displayPage, setDisplayPage] = useState(false);
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
      } else {
        setMessage("Failed to create journal");
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(className)}
        onClick={() => setDisplayPage(true)}
      >
        <div className="border rounded-full p-1 bg-white">
          <Plus className="h-6 w-6 text-gray-500" />
        </div>

        <span>Create Journal</span>
      </Button>

      <Button
        variant="outline" 
        className={cn(className)}
        onClick={() => setDisplayPage(true)}
      >
        <div className="border rounded-full p-1 bg-white">
          <Plus className="h-4 w-4 text-gray-500" />
        </div>

        <span className="text-wrap">Create Journal</span>
      </Button>

      {displayPage && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setDisplayPage(false)}
        >
          <div
            className="relative bg-neutral-100 border w-[90%] h-[90%] max-w-5xl rounded-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute top-2 right-2 text-[#16404D] hover:text-[#122b31]"
              onClick={() => setDisplayPage(false)}
            >
              ✕
            </div>

            <h2 className="font-semibold text-3xl mb-4">Create Journal</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-lg font-semibold">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full rounded px-2 py-1 border"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-semibold mb-1">
                  Content
                </label>
                <textarea
                  className="w-full px-2 py-1 border"
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="bg-[#2973B2] text-white rounded px-4 py-2"
              >
                Save
              </Button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}
