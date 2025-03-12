import { ProfileDetails } from "./details";
import ProfileStats from "./stats";

export function Profile() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-xl mx-auto px-4 bg-slate-300 py-6 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Profile
        </h1>

        <div className="flex flex-col justify-center items-center space-y-6">
          <ProfileDetails />

          <div className=" grid grid-cols-1 md:grid-cols-2 bg-white p-6 shadow-md rounded-lg gap-4">
            <ProfileStats />
          </div>
        </div>
      </div>
    </div>
  );
}