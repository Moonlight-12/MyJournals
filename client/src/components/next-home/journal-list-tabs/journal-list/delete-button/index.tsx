"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface DeleteButtonProps {
  className?: string;
  journalId: string;
  onDeleteSuccess?: () => void; // Add callback prop
}

export default function DeleteButton({
  className,
  journalId,
  onDeleteSuccess, // Use the callback
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this journal?")) {
      setIsDeleting(true);
      setError(null);

      try {
        if (!session?.accessToken) {
          throw new Error("Unauthorized: No access token");
        }

        const response = await fetch(
          `${process.env.APP_API_URL}/api/delete/${journalId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            cache: 'no-store', 
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || errorData.message || "Failed to delete journal"
          );
        }

        
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
        
        
        router.refresh();
        
      } catch (err) {
        console.error("Delete error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to delete journal"
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="xs"
        onClick={handleDelete}
        disabled={isDeleting}
        className={cn("rounded-full hover:bg-gray-200", className)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </Button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}