import DisplayList from "@/components/home/listOfJournals";

export default function ListOfJournals() {
    return (
        <main className="min-h-screen bg-[#F2EFE7] text-neutral-900">
            <header className="flex justify-center h-12 items-center mb-12">
                List of journals
            </header>
            <div className="w-[80%] mx-auto bg-[#9ACBD0] items-center rounded-lg px-4 py-4">
            List of journals
                <div className=" rounded-md px-2 py-2">
                    <DisplayList />
                </div>
                
            </div>
        </main>
    );
}