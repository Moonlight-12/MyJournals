import { getRecentJournal } from "@/app/api/get-recent-journal";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { cn } from "@/utils/cn";
import { RecentCarousel } from "./recent-carousel";

export async function RecentJournalComponent({
  className,
}: {
  className?: string;
}) {
  const session = await getServerSession(options);
  if (!session?.user?.id) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        Please login first
      </div>
    );
  }
  const data = await getRecentJournal(session.user.id);

  return (
    <div className={cn(" max-w-screen-xl mx-auto", className)}>
      <div className="container bg-[#2973B2] text-white rounded-md mt-4 py-4 px-2">
        <h2 className="text-2xl font-semibold">Recent Journal</h2>
      </div>
      
      <RecentCarousel data={data} className="bg-[#71b8d5] rounded-md"/>
    </div>
  );
}
