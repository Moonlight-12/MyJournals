"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DisplayList from "@/components/next-home/journal-list-tabs/journal-list";
import { FavouriteList } from "./favourite-list";

export function JournalsListTabs() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (value: string) => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Tabs
      defaultValue="Journal list"
      className="w-full mb-10"
      onValueChange={handleTabChange}
    >
      <TabsList className="flex shrink-0 border rounded-md mb-8 py-6 ">
        <TabsTrigger
          value="Journal list"
          className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-md transition-all text-lg flex flex-1 h-[45px]"
        >
          Journal list
        </TabsTrigger>
        <TabsTrigger
          value="Favourite Journal"
          className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-md transition-all text-lg flex flex-1 h-[45px]"
        >
          Favourite Journal
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="Journal list"
        className=" bg-[#5ba3bf] rounded-lg p-4"
      >
        <DisplayList />
      </TabsContent>
      <TabsContent
        value="Favourite Journal"
        className=" bg-[#5ba3bf] rounded-lg p-4"
      >
        <FavouriteList key={refreshKey} />
      </TabsContent>
    </Tabs>
  );
}
