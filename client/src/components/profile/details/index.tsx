import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import { EditProfileButton } from "./details-client";

// Define types for TypeScript support
interface User {
  id: string;
  username?: string;
  email: string;
}

interface Session {
  user: User;
  accessToken?: string;
}

export async function ProfileDetails() {
  const session = await getServerSession(options);

  if (!session || !session.accessToken) {
    throw new Error("No authentication token available");
  }

  if (!session?.user?.id) {
    throw new Error("Please Login first");
  }

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="h-32 w-32 bg-neutral-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="text-slate-500 text-sm">Avatar Icon</span>
          </div>
        </div>

        <div className="relative space-y-4">
          <div className="absolute top-0 right-4">
            <EditProfileButton 
              userId={session.user.id} 
              initialUsername={session.user.name || ""}
              initialEmail={session.user.email}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Username
            </label>
            <div className="text-lg font-medium text-slate-800">
              {session.user.name || "none"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Email
            </label>
            <div className="text-lg font-medium text-slate-800">
              {session.user.email}
            </div>
          </div>

          <div className="pt-2">
            <Link href="/" className="block">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                Change password
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}