import { cn } from "@/utils/cn";
import Signout from "./Signout";

export function Header({
  title,
  className,
  signOut,
  icon,
}: {
  title?: string;
  className?: string;
  signOut?: boolean;
  icon?: boolean;
}) {
  return (
    <header
      className={cn(
        className,
        "px-4 py-2 flex items-center"
      )}
    >
      
      <div className="w-20 flex justify-start">
        {icon && (
          <img src="/icon.svg" alt="Icon" />
        )}
      
      </div>
      
      <div className="flex-grow flex justify-center">
        <h1 className="text-4xl font-bold">
          {title || "MyJournal"}
        </h1>
      </div>
      
      <div className="w-20 flex justify-end">
        {signOut && <Signout />}
      </div>
    </header>
  );
}
