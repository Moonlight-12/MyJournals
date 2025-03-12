"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DisplayStreaks() {
  const { data: session, status } = useSession();
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      getStreak();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session]);


  const getStreak = async () => {
    if (!session?.user?.id || !session?.accessToken) {
      setError("No user ID or access token");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/streak`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error response: ${response.status}`, errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStreak(data.streak);
    } catch (error) {
      console.error("Error in getStreak", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-gray-500 p-4">Loading streak data...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error loading streak: {error}</div>;

  // Get milestone styles based on streak count
  const getMilestoneStyles = () => {
    if (streak >= 100) {
      return "milestone-legendary";
    }
    if (streak >= 30) {
      return "milestone-master";
    }
    if (streak >= 7) {
      return "milestone-advanced";
    }
    return "milestone-starter";
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Streak</h3>
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-4 animate-bounce">
            <span className="text-2xl">🔥</span>
          </div>
          <div
            className={`relative w-20 h-20 flex items-center justify-center rounded-full ${getMilestoneStyles()}`}
          >
            <div className="text-3xl font-bold text-gray-800">{streak}</div>
          </div>
        </div>
        {streak > 0 && (
          <p className="text-sm text-gray-500 mt-4">Keep up the good work!</p>
        )}
        {streak === 0 && (
          <p className="text-sm text-gray-500 mt-4">
            Start your streak by writing a journal entry today!
          </p>
        )}
      </div>
    </div>
  );
}