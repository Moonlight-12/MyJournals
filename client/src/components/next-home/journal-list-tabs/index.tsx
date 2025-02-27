import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DisplayList from "@/components/next-home/journal-list-tabs/journal-list";

export function JournalsListTabs() {
  return (
    <Tabs defaultValue="Journal list" className="w-full">
      <TabsList className="flex shrink-0 border rounded-md mb-8 py-6">
        <TabsTrigger
          value="Journal list"
          className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-md transition-all text-lg flex flex-1 h-[45px]"
        >
          Journal list
        </TabsTrigger>
        <TabsTrigger
          value="Favourite Journal"
          className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-md  transition-all text-lg flex flex-1 h-[45px]"
        >
          Favourite Journal
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Journal list" className="overflow-y-auto h-[400px] md:h-[600px]">
        <DisplayList />
      </TabsContent>
      <TabsContent value="Favourite Journal">Favourite Journal</TabsContent>
    </Tabs>
  );
}
