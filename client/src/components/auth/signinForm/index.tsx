import Link from "next/link";

export default function SigninForm() {
  return (
    <div className="grid place-items-center h-screen">
      <div className="rounded-md border-[#48A6A7] p-4 shadow-lg border-t-4">
        <div className="text-lg font-semibold my-4">Signin</div>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="rounded" />
          <input type="password" placeholder="Password" className="rounded" />
          <button className="border bg-[#48A6A7]/90 py-2 cursor-pointer">
            Signin
          </button>
          <div className="bg-red-500 w-fit text-sm py-1 px-3 rounded-md text-white mt-2">
            Error message
          </div>
          <Link className="text-sm mt-3 text-right" href={"/signup"}>
            Don't have an account? <span className="underline">Signup</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
