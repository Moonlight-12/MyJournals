"use client"

import Link from "next/link";
import CreateJournal from "@/components/home/createJournal";
import GalleryView from "@/components/home/gallery";
import Signout from "@/components/header/Signout";

export default function Home() {

  return (
    <main className="min-h-screen bg-[#FBF5DD] text-[#16404D]">
      <header className="flex items-center justify-center h-12">
        <h1>Journal</h1>
        <Signout />
      </header>
      <div className="w-[90%] mx-auto min-h-screen">
        <div className="flex justify-center p-16">
          <GalleryView />
        </div>

        <div className=" bg-[#9ACBD0] items-center rounded-lg w-full md:w-[50%] mx-auto max-w-md">
          <div className="md:hidden flex flex-col gap-4 p-4 w-full">
            <CreateJournal />
            <Link
              href="/home/listOfJournals"
              className="flex-1 h-48 p-4 rounded-lg bg-gray-400 shadow-sm hover:shadow-sm flex items-center justify-center"
            >
              <h1>See list of journal</h1>
            </Link>
          </div>

          <div className="hidden md:flex justify-between px-4 mt-32 gap-4 py-4 ">
            <CreateJournal />
            <Link
              href="/home/listOfJournals"
              className="w-52 h-52 p-6 rounded-lg bg-gray-400 shadow-sm flex items-center justify-center"
            >
              <h1>See list of journal</h1>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
