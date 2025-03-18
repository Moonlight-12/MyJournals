import React from "react";
import Link from "next/link";

export function RecentJournalCard({
  _id,
  title,
  content,
  createdAt,
  isFavourite,
}: {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  isFavourite: boolean;
}) {
  return (
    <Link href={`/next-home/journal/${_id}`}>
      <div className="relative w-[140px] h-[200px] md:w-[300px] md:h-[400px] cursor-pointer rounded-md group">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[url('/blueprint.jpg')] bg-cover bg-center border border-black rounded-md transition-opacity duration-500 opacity-100 group-hover:opacity-0">
          <div className="absolute top-2 left-2 bg-white/80 rounded-md px-2 py-1 text-xs text-black">
            {new Date(createdAt).toLocaleDateString()}
          </div>
          <div className="relative h-full w-full flex justify-center items-center">
            <div className="title bg-white rounded-md p-2 text-lg font-bold text-black text-center">
              {title}
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-blue-300 p-6 overflow-y-auto rounded-md transition-opacity duration-500 opacity-0 group-hover:opacity-100 text-black">
          {content}
        </div>
      </div>
    </Link>
  );
}
