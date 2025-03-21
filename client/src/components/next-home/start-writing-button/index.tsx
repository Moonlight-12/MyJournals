"use client"

import CreateJournal from "@/components/home/new-journal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function StartWritingButton() {
  const [showJournalModal, setShowJournalModal] = useState(false);
  return (
    <>
      <Button
        variant="destructive"
        className="border border-slate-300 px-6 py-4 bg-[#2973B2]"
        onClick={() => {
          setShowJournalModal(true);
        }}
      >
        Start Writing
      </Button>

      <CreateJournal
        showJournalModal={showJournalModal}
        setShowJournalModal={setShowJournalModal}
      />
    </>
  );
}
