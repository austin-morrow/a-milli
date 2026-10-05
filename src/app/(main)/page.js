import LoginForm from "../(auth)/login/page";

export const metadata = { title: "Log in · A Milli" };

export default async function LoginPage({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <aside className="hidden bg-teal-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="text-xl font-semibold">A Milli</p>
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">
            Budgets you can share.
          </h2>
          <p className="mt-4 max-w-sm text-lg text-teal-100">
            Keep a budget to yourself, or invite someone to plan it with you.
          </p>
        </div>
      </aside>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <p className="mb-8 text-xl font-semibold text-teal-900 lg:hidden">
            A Milli
          </p>
          <LoginForm error={error} message={message} />
        </div>
      </section>
    </main>
  );
}