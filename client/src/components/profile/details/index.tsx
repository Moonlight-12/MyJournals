import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { EditProfileButton } from "./edit-profile-button";
import { ChangePasswordButton } from "./change-password-button";

interface User {
  id: string;
  username?: string;
  name?: string | null;
  email?: string | null;
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
  const userEmail = session.user.email || "";
  const userName = session.user.name || "";

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
              initialUsername={userName}
              initialEmail={userEmail}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Username
            </label>
            <div className="text-lg font-medium text-slate-800">
              {userName || "none"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">
              Email
            </label>
            <div className="text-lg font-medium text-slate-800">
              {userEmail || "No email provided"}
            </div>
          </div>

          <div className="pt-2">
            <ChangePasswordButton />
          </div>
        </div>
      </div>
    </div>
  );
}