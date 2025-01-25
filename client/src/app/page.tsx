import Journals from "@/components/apiCall";

export default function Home() {
    return (  
      <main className=" min-h-screen bg-[#FBF5DD] text-[#16404D]">
        
        <header className="flex items-center justify-center h-12 ">
          <h1>Journal</h1>
        </header>
        <div className="  w-[90%] mx-auto min-h-screen">
          <div className="flex justify-center p-16">
            <div className="h-64 w-64 flex items-center justify-center bg-gray-500">
                <Journals />
                Gallery
            </div>
          </div>
  
          <div className="bg-[#A6CDC6] items-center rounded-lg">
            <div className="flex justify-between mt-16 px-8 h-64 items-center md:px-32 md:mt-64">
              <h1>Create Journal</h1>
              <h1>List of Journals</h1>
              <h1>Calendar View</h1>
            </div>
          </div>
        </div>
      </main>
    );
  }