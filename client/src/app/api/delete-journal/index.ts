

import { getServerSession } from "next-auth/next"
import { options } from "@/app/api/auth/[...nextauth]/options"
import { revalidatePath } from "next/cache"


export async function deleteJournal(journalId: string, userId: string) {



  const session = await getServerSession(options)

  if (!session?.user?.id) {
    throw new Error("Unauthorized: User not logged in")
  }

  if (session.user.id !== userId) {
    throw new Error("Unauthorized: Cannot delete another user's journal")
  }

  try {
    const response = await fetch(`${process.env.APP_API_URL}/api/delete/${journalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || errorData.message || "Failed to delete journal")
    }

    revalidatePath("/journals")

    return { success: true, message: "Journal deleted successfully" }
  } catch (error) {
    console.error("Journal deletion error:", error)
    throw error
  }
}