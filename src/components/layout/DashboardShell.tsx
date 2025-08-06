import { ReactNode } from "react";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow p-4 text-xl font-semibold text-center">
        HRS Certification DApp
      </header>
      <main className="max-w-3xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}
