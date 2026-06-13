import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Desktop sidebar */}
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900 md:rounded-l-2xl pb-20 md:pb-0">
        {/* Mobile top bar */}
        <AdminMobileNav />
        {children}
      </main>
    </div>
  );
}
