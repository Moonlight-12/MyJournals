import { cn } from "@/utils/cn";
import Signout from "./Signout";

export function Header({
  title,
  className,
  signOut,
}: {
  title?: string;
  className?: string;
  signOut?: boolean;
}) {
  return (
    <header
      className={cn(
        className,
        "bg-white px-4 py-2 flex items-center"
      )}
    >
      
      <div className="w-20 flex justify-start">
      
      </div>
      
      <div className="flex-grow flex justify-center">
        <h1 className="text-2xl font-semibold">
          {title || "MyJournal"}
        </h1>
      </div>
      
      <div className="w-20 flex justify-end">
        {signOut && <Signout />}
      </div>
    </header>
  );
}
