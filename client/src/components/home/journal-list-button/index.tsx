"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

export default function ListButton() {
  const router = useRouter();
  return (
    <>
      {/** Desktop View */}
      <Button
        variant="outline"
        className="hidden md:flex w-52 h-52 p-6 rounded-lg shadow-sm items-center justify-center space-x-2 pl-4" // Simplified className, space-x-2 for icon/text spacing, pl-4 for icon padding
        onClick={() => router.push("/home/journal-list")}
      >
        <div className="border rounded-full p-1 bg-white">
          <List className="h-5 w-5 text-gray-500" />
        </div>

        <span>Journals</span>
      </Button>

      {/** Mobile View */}
      <Button
        variant="outline"
        className="flex md:hidden w-32 h-32 p-6 rounded-lg shadow-sm items-center justify-center space-x-2 pl-4" // Simplified className, space-x-2 for icon/text spacing, pl-4 for icon padding
        onClick={() => router.push("/home/journal-list")}
      >
        <div className="border rounded-full p-1 bg-white">
          <List className="h-5 w-5 text-gray-500" />
        </div>

        <span>Journals</span>
      </Button>
    </>
  );
}
