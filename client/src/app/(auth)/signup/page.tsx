import SignupForm from "@/components/auth/signupForm";

export default function Signup() {
  return (
    <main className="min-h-screen ">
      <header className="flex items-center justify-center h-12">
        <h1>Journal</h1>
      </header>
      <SignupForm />
    </main>
  );
}
