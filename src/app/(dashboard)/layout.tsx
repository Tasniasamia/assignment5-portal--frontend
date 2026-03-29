
import Footer from "@/components/modules/dashboard/layout/footer";
import Header from "@/components/modules/dashboard/layout/header";
import Sidebar from "@/components/modules/dashboard/layout/sidebar";
import { getUserInfo } from "@/service/auth.service";


interface DashboardLayoutProps {
  children: React.ReactNode;

}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const data=await getUserInfo();
  let role =data?.role === "ADMIN" ? "admin":data?.role==="MEMBER"?"member":"member"
  console.log("data",data);

  
  
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#eceae0" }}>
      <Sidebar role={role as string} userName={data?.name} userEmail={data?.email}  image={data?.image}/>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <Header role={role as string} userName={data?.name} image={data?.image} />
 
      <main className="flex-1 overflow-y-auto p-6" style={{ background: "#eceae0", scrollbarWidth: "none" }}>
          {children}
        </main>
        <Footer role={role as string} />
      </div>
    </div>
  );
}