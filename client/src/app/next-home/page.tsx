import SignoutComponent from "@/components/header/Signout";
import { RecentJournalComponent } from "@/components/next-home/recent-journal";

export default function HomePage() {
  return (
    <main className="w-screen h-screen bg-[#FBF5DD] text-[#16404D]">
      <header className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
        <h1 className="text-3xl font-semibold">MyJournal</h1>
        <SignoutComponent />
      </header>

      <div className="space-y-4 pb-4">
        <RecentJournalComponent />
      </div>
    </main>
  );
}
