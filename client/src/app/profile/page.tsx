import { Header } from "@/components/header";
import { Profile } from "@/components/profile";

export default function ProfilePage() {
  return (
    <main className="w-screen mx-auto min-h-screen  px-4 ">
      <Header title="Profile" signOut={true}/>
      <Profile />
    </main>
  );
}
