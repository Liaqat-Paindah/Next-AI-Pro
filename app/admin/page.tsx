import { auth } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await auth();
  const firstName = session?.user?.first_name ?? "Admin";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          Admin Section
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300">
          This is the admin landing page. Role-based redirects now send admin
          accounts here instead of the user dashboard.
        </p>
      </div>
    </main>
  );
}
