"use client";

import { useEffect, useState } from 'react';

interface Journal {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface DisplayListProps {
  userId: string;
}

async function getJournals(userId: string) {
  try {
    const response = await fetch(
      `http://localhost:4000/api/journals?userID=${userId}`,
      {
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const journals: Journal[] = await response.json();
    return journals;
  } catch (error) {
    console.error('Failed to fetch journals:', error);
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
        setError(err instanceof Error ? err.message : 'Failed to fetch journals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, [userId]);

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
          className="p-4 rounded-md shadow-sm bg-[rgb(72,166,155)] hover:shadow-md transition-shadow overflow-hidden"
        >
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
      ))}
    </div>
  );
}