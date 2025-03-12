import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { user } from "@/types/user";

export async function getProfile(userId: string): Promise<user> {
  const session = await getServerSession(options);

  if (!session || !session.accessToken) {
    throw new Error("No authentication token available");
  }

  if (session.user.id !== userId) {
    throw new Error("Access denied");
  }

  try {
    const response = await fetch(
      `http://localhost:4000/api/profile/${userId}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("failed to fetch user profile", error);
    throw error;
  }
}
