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

  const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;

  try {
    const response = await fetch(
      `${API_URL}/api/journals?userId=${userId}`,
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