"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Journal {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isFavourite: boolean;
}

export function useJournals() {
  const { data: session, status } = useSession();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = session?.user?.id;
    if (status === "authenticated" && userId) {
      const fetchJournals = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${process.env.APP_API_URL}/api/journals?userId=${userId}`,
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
    } else if (status !== "authenticated") {
      setJournals([]);
      setIsLoading(false);
      setError(null);
    }
  }, [status, session?.user?.id]);

  return { journals, isLoading, error, setJournals };
}