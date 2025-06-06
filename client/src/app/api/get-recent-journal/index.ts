export async function getRecentJournal(userId: string) {
  try {
    const response = await fetch(
      `${process.env.APP_API_URL}/api/recents?userId=${userId}`,
      {
        cache: "no-store",
        headers: { "Content-type": "application-json" },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const recents = await response.json();
    return recents;
  } catch (error) {
    console.error("Failed to fetch recent journals:", error);
    throw error;
  }
}
