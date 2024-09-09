import { AuthForm } from "@/components/auth-form";

export default function Page() {
  return (
    <div className="flex max-md:flex-col min-h-[100lvh]">
      <div className="bg-accent flex-1 flex flex-col md:items-end md:justify-center justify-end p-8 md:p-10 space-y-4">
        <h1 className="font-black text-6xl">Sign in</h1>
        <p className="text-muted-foreground">
          Enter your username and password
        </p>
      </div>
      <div className="flex-[2] p-8 md:p-10 flex md:items-center">
        <AuthForm />
      </div>
    </div>
  );
}
