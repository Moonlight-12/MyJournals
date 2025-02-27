import { Journal } from "../../../types/journal";

export async function getAllJournals(userId: string): Promise<Journal[]> {
  try {
    const response = await fetch(
      `http://localhost:4000/api/journals?userId=${userId}`,
      {
        cache: "no-store",
        headers: { "content-type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fail to fetch journals: ", error)
    throw error;
  }
}
