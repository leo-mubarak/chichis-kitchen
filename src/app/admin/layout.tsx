import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900 md:rounded-l-2xl">
        {children}
      </main>
    </div>
  );
}