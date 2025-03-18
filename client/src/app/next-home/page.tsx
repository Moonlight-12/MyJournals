import SignoutComponent from "@/components/header/Signout";
import { JournalsListTabs } from "@/components/next-home/journal-list-tabs";
import { RecentJournalComponent } from "@/components/next-home/recent-journal";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import DisplayStreaks from "@/components/profile/stats/streaks";
import { Header } from "@/components/header";
import { StartWritingButton } from "@/components/next-home/start-writing-button";

export default async function HomePage() {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        Please login first
      </div>
    );
  }

  return (
    <main className="w-screen min-h-screen ">
      <Header />

      <div className="flex flex-col items-center text-2xl p-32 w-full mt-18 ">
        <h2>Welcome to your personal journal</h2>
        <h1 className="text-3xl mb-12">
          Hi {session.user.name || session.user.email}
        </h1>

        <StartWritingButton />
      </div>

      <div className="p-4 mb-4">
        <DisplayStreaks />
      </div>

      <section className="max-w-screen-xl mx-auto w-full px-4 pb-10">
        <div className="mb-12 overflow-hidden">
          <RecentJournalComponent />
        </div>

        <div className="px-4 ">
          <JournalsListTabs />
        </div>
      </section>
    </main>
  );
}
