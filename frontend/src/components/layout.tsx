import { Outlet } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <ModeToggle />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
