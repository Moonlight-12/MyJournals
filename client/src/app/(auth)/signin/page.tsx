import SigninForm from "@/components/auth/signinForm";
import { Header } from "@/components/header";

export default function SignIn() {
  return (
    <main className="min-h-screen">
      <Header icon={true}/>
      <SigninForm />
    </main>
  );
}
