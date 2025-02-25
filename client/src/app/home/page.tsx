import CreateJournal from "@/components/home/new-journal";
import GalleryView from "@/components/home/gallery";
import SignoutComponent from "@/components/header/Signout";
import ListButton from "@/components/home/journal-list-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FBF5DD] text-[#16404D]">
      <header className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
        <h1 className="text-3xl font-semibold">MyJournal</h1>
        <SignoutComponent />
      </header>
      <div className="container mx-auto py-10 px-4 flex flex-col items-center">
        <div className="bg-white rounded-md px-6 py-2 mb-4">
          <h1 className="text-2xl font-semibold ">Favourites</h1>
        </div>
        
        <div className="border md:max-w-screen-xl bg-white/20 flex justify-center items-center rounded-md mb-6">
          <div className="flex justify-center items-center max-w-[800px]">
            <GalleryView />
          </div>
        </div>

        <div className="bg-[#9ACBD0] rounded-lg max-w-[500px] min-w-[100px] mx-auto p-6">
          <div className="flex md:flex-row justify-center md:justify-between gap-6">
            <CreateJournal />
            <ListButton />
          </div>
        </div>
      </div>
    </main>
  );
}
