"use client";

import { IconHome, IconPlus, IconUser } from "@tabler/icons-react";
import { FloatingDock } from "../ui/floating-dock";
import { useState } from "react";
import CreateJournal from "../home/new-journal";

export default function NavBar() {
  const [showJournalModal, setShowJournalModal] = useState(false);

  const items = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/next-home",
    },
    {
      title: "Add",
      icon: (
        <IconPlus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => setShowJournalModal(true),
    },
    {
        title: "Profile",
        icon: (
            <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "/profile"
    },
  ];

  return (
    <>
      <div className="fixed top-14 right-4 md:bottom-4 md:left-1/2 md:transform md:-translate-x-1/2 md:top-auto md:right-auto w-fit mx-auto z-50">
        <FloatingDock items={items} />
      </div>

      <CreateJournal
        showJournalModal={showJournalModal}
        setShowJournalModal={setShowJournalModal}
      />
    </>
  );
}
