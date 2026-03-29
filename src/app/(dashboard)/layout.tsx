
import Footer from "@/components/modules/dashboard/layout/footer";
import Header from "@/components/modules/dashboard/layout/header";
import Sidebar from "@/components/modules/dashboard/layout/sidebar";
import { getUserInfo } from "@/service/auth.service";

type Role = "admin" | "member";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  pageTitle?: string;
}

export default async function DashboardLayout({ children, role, userName, userEmail, userAvatar, pageTitle }: DashboardLayoutProps) {
  const data=await getUserInfo();
  console.log("data",data);

  
  
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#eceae0" }}>
      <Sidebar role={role} userName={userName} userEmail={userEmail} userAvatar={userAvatar} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header role={role} userName={userName} userAvatar={userAvatar} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "#eceae0", scrollbarWidth: "none" }}>
          {children}
        </main>
        <Footer role={role} />
      </div>
    </div>
  );
}