import AccountAge from "./Age";
import DisplayStreaks from "./streaks";

export default function ProfileStats() {
  return (
    <>
      <div className="flex justify-center items-center">
        <DisplayStreaks />
      </div>

      <div className="flex justify-center items-center">
        <div className="bg-white shadow-md py-5 text-center rounded-md w-48 h-52">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Account Age
          </h3>
          <AccountAge />
        </div>
      </div>
    </>
  );
}
