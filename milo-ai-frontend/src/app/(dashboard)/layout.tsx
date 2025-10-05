// import { AppSidebar } from "@/components/dashboard/appsidebar";
import AppSidebar from "@/components/dashboard/appsidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center px-6 bg-card shadow-sm sticky top-0 z-10">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-6 overflow-auto bg-gradient-mesh">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
