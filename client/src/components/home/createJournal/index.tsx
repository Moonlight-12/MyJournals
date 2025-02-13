"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

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

export default function CreateJournal() {
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
      <div
        className="hidden md:flex w-52 h-52 p-6 rounded-lg bg-gray-400 shadow-sm items-center justify-center"
        onClick={() => setDisplayPage(true)}
      >
        <h1>Create Journal</h1>
      </div>

      <div
        className="flex md:hidden flex-1 rounded-full h-24 bg-gray-400 shadow-sm hover:shadow-sm items-center justify-center"
        onClick={() => setDisplayPage(true)}
      >
        CreateJournal
      </div>

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
                  className="w-full rounded px-2 py-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-semibold mb-1">
                  Content
                </label>
                <textarea
                  className="w-full px-2 py-1"
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <button className="bg-[#2973B2] px-2 rounded" type="submit">
                Save
              </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}
