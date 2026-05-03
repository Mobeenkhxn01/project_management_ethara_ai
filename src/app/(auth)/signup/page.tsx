import RegisterForm from "@/components/register-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-slate-950 p-6 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl md:grid-cols-2 md:p-8">
        <div className="hidden md:block">
          <Image
            src="/auth-illustration.svg"
            alt="Team task management illustration"
            width={900}
            height={700}
            className="h-auto w-full rounded-xl border border-slate-800"
            priority
          />
        </div>
        <div className="flex justify-center">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
