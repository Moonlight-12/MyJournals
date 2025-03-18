import { getProfile } from "@/app/api/get-profile";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function AccountAge() {
  const session = await getServerSession(options);
  if (!session?.user?.id) {
    return <div>Please Login First</div>;
  }
  const result = await getProfile(session?.user?.id);

  const startDate = result.createdAt;
  const start = new Date(startDate);
  const currentDate = new Date();

  const ageInMs = currentDate.getTime() - start.getTime();

  const diffDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));

  return (
    <div className="text-center">
      <div className="p-4">
        <span className="text-2xl font-bold text-neutral-700">{diffDays}</span>
        <span className="text-xs block text-gray-500">days</span>
      </div>
      <p className="text-sm text-gray-500 mt-4">Keep up the good work!</p>
    </div>
  );
}
