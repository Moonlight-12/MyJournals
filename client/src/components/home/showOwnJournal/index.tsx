"use client";

import { useSession } from "next-auth/react";
import DisplayList from "./listOfJournals";

export default function ShowJournals() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="rounded-md px-2 py-2">
        <div className="text-center">Loading journals...</div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="rounded-md px-2 py-2">
        <div className="text-center">Please sign in to view your journals</div>
      </div>
    );
  }

  return (
    <div className="rounded-md px-2 py-2">
      <DisplayList userId={session.user.id} />
    </div>
  );
}
