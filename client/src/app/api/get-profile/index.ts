import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { user } from "@/types/user";
import { redirect } from "next/navigation";

export async function getProfile(userId: string): Promise<user> {
  const session = await getServerSession(options);

  if (!session || !session.accessToken) {
    redirect("/signin");
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
      redirect("/signin");
    }

    return response.json();
  } catch (error) {
    console.error("failed to fetch user profile", error);
    throw error;
  }
}
