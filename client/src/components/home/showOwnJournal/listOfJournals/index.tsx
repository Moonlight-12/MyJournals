"use client";

import { useEffect, useState } from "react";

interface Journal {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isFavourite: boolean;
}

interface DisplayListProps {
  userId: string;
}

async function getJournals(userId: string) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/journals?userId=${userId}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const journals: Journal[] = await response.json();
    return journals;
  } catch (error) {
    console.error("Failed to fetch journals:", error);
    throw error;
  }
}

async function toggleFavorite(journalId: string, currentStatus: boolean) {
  const fetchUrl = `http://localhost:4000/api/journals/${journalId}`;

  try {
    const response = await fetch(fetchUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isFavourite: !currentStatus }), // Toggle the current status
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to toggle favorite status:", error);
    throw error;
  }
}

export default function DisplayList({ userId }: DisplayListProps) {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setIsLoading(true);
        const data = await getJournals(userId);
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

  const handleFavoriteToggle = async (journalId: string, currentStatus: boolean) => {
    try {
      // Optimistic update - update UI immediately
      setJournals(prevJournals =>
        prevJournals.map(journal =>
          journal._id === journalId
            ? { ...journal, isFavourite: !currentStatus }
            : journal
        )
      );

      // Make API call
      await toggleFavorite(journalId, currentStatus);
    } catch (error) {
      // If API call fails, revert the optimistic update
      setJournals(prevJournals =>
        prevJournals.map(journal =>
          journal._id === journalId
            ? { ...journal, isFavourite: currentStatus }
            : journal
        )
      );
      console.error("Failed to toggle favorite status:", error);
    }
  };

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
    <div className="space-y-4">
      {journals.map((journal) => (
        <div
          key={journal._id}
          className="p-4 rounded-md shadow-sm bg-[rgb(72,166,155)] hover:shadow-md transition-shadow overflow-hidden flex items-center justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold mb-2 text-white">
              {journal.title || "Untitled Journal"}
            </h2>
            <p className="text-gray-100">
              {journal.content || "No content available"}
            </p>
            <div className="mt-2 text-sm text-gray-200">
              {new Date(journal.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={() => handleFavoriteToggle(journal._id, journal.isFavourite)}
            className="text-white font-bold rounded focus:outline-none focus:shadow-outline"
          >
            {journal.isFavourite ? (
              <img
                src="/red-heart-icon.svg"
                alt="Favorite Icon"
                className="h-8 w-8 fill-current text-white"
              />
            ) : (
              <img
                src="/heart-svgrepo-com.svg"
                alt="Favorite Icon"
                className="h-8 w-8 fill-current text-white"
              />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}