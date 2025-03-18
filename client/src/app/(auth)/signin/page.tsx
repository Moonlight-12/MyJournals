import SigninForm from "@/components/auth/signinForm";

export default function SignIn() {
  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-center h-12">
        <h1>Journal</h1>
      </header>
      <SigninForm />
    </main>
  );
}
