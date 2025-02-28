"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Journal {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isFavourite: boolean;
}

export default function DisplayList() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchJournals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/journals?userId=${userId}`,
          {
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }

        const data: Journal[] = await response.json();
        setJournals(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch journals"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, [userId]);

  const handleFavoriteToggle = async (
    journalId: string,
    currentStatus: boolean
  ) => {
    if (!userId) return;

    try {
      setJournals((prevJournals) =>
        prevJournals.map((journal) =>
          journal._id === journalId
            ? { ...journal, isFavourite: !currentStatus }
            : journal
        )
      );

      const response = await fetch(
        `http://localhost:4000/api/favourite/${journalId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFavourite: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);

      setJournals((prevJournals) =>
        prevJournals.map((journal) =>
          journal._id === journalId
            ? { ...journal, isFavourite: currentStatus }
            : journal
        )
      );
    }
  };

  if (status === "loading") {
    return <div className="p-4 text-center">Loading journals...</div>;
  }

  if (!session?.user?.id) {
    return (
      <div className="p-4 text-center">
        Please sign in to view your journals
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading journals...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!journals.length) {
    return (
      <div className="p-4 text-center text-gray-600">
        No journals found. Start writing your first journal!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {journals.map((journal) => (
        <div
          key={journal._id}
          className="h-64 p-6 bg-white rounded-lg shadow-md flex flex-col justify-between hover:bg-slate-50"
        >
          <div className="flex-1 overflow-hidden">
            <h3 className="text-xl font-semibold mb-2">
              {journal.title || "Untitled Journal"}
            </h3>
            <p className="text-gray-600 line-clamp-6">
              {journal.content || "No content available"}
            </p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              {new Date(journal.createdAt).toLocaleDateString()}
            </span>
            <button
              onClick={() =>
                handleFavoriteToggle(journal._id, journal.isFavourite)
              }
              className="px-4 py-2  text-white rounded-lg transition-colors"
            >
              <img
                src={
                  journal.isFavourite
                    ? "/red-heart-icon.svg"
                    : "/heart-svgrepo-com.svg"
                }
                alt="Favorite Icon"
                className="h-8 w-8 fill-current min-w-6 md:min-w-8"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
