import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Journal } from "../../../types/journal";

export async function getAllJournals(userId: string): Promise<Journal[]> {
  // Get the server-side session
  const session = await getServerSession(options);

  // Check if session and token exist
  if (!session || !session.accessToken) {
    throw new Error("No authentication token available");
  }

  try {
    const response = await fetch(
      `http://localhost:4000/api/journals?userId=${userId}`,
      {
        cache: "no-store",
        headers: { 
          "content-type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch journals: ", error);
    throw error;
  }
}