import Footer from "@/components/modules/dashboard/layout/footer";
import Header from "@/components/modules/dashboard/layout/header";
import Sidebar from "@/components/modules/dashboard/layout/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#eceae0" }}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: "#eceae0", scrollbarWidth: "none" }}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
