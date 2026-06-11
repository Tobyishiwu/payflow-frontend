import type { ReactNode } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";

interface Props {
  children: ReactNode;
}

function AdminLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <AdminSidebar />

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;