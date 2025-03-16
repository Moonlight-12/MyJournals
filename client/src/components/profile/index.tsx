import { ProfileDetails } from "./details";
import ProfileStats from "./stats";

export function Profile() {
  return (
    <div className="min-h-screen py-8">
      <div className="flex flex-col justify-center items-center space-y-6">
        <ProfileDetails />

        <div className=" grid grid-cols-1 md:grid-cols-2 bg-white p-6 shadow-md rounded-lg gap-4">
          <ProfileStats />
        </div>
      </div>
    </div>
  );
}
