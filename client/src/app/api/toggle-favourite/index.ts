import type { Journal } from "../../../types/journal"

export async function toggleFavorite(
  journalId: string,
  isFavorite: boolean,
  userId: string,
): Promise<{ success: boolean; data: Journal }> {
  if (!userId) {
    throw new Error("Authentication required")
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;
    const response = await fetch(`${API_URL}/api/favourite/${journalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isFavourite: isFavorite,
        userId: userId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `Failed to update favorite status: ${response.status} ${
          errorData ? JSON.stringify(errorData) : response.statusText
        }`,
      )
    }
    const updatedJournal: Journal = await response.json()

    return {
      success: true,
      data: updatedJournal,
    }
  } catch (error) {
    console.error("Failed to toggle favorite status:", error)
    throw error
  }
}