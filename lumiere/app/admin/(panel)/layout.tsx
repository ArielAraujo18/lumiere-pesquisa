import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f8faf8] lg:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}