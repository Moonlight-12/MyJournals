import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Journal } from "../../../types/journal";

export async function getAllJournals(userId: string): Promise<Journal[]> {
  const session = await getServerSession(options);

  if (!session || !session.accessToken) {
    throw new Error("No authentication token available");
  }

  if (session.user.id !== userId) {
    throw new Error("Access denied");
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