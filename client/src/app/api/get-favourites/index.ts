export async function GetFavourite(userId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;
    const response = await fetch(
      `${API_URL}/api/journals?userId=${userId}&isFavourite=true`,
      {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const journals = await response.json();
    return journals;
  } catch (error) {
    console.error("Failed to fetch favorite journals:", error);
    throw error;
  }
}