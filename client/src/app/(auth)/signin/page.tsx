import SigninForm from "@/components/auth/signinForm";

export default function SignIn() {
  return (
    <main className="min-h-screen bg-[#FBF5DD] text-[#16404D]">
      <header className="flex items-center justify-center h-12">
        <h1>Journal</h1>
      </header>
      <SigninForm />
    </main>
  );
}
