"use client";

import { Home, MessageSquare, BookOpen, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const allItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, roles: ["user", "caregiver"] },
  { title: "Milo AI", url: "/miloai", icon: MessageSquare, roles: ["user"] },
  { title: "Daily Diary", url: "/dailydiary", icon: BookOpen, roles: ["user", "caregiver"] },
  { title: "Reminders", url: "/reminders", icon: Bell, roles: ["user", "caregiver"] },
];

export default function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const [items, setItems] = useState<typeof allItems>([]);

  useEffect(() => {
    const userRole = JSON.parse(localStorage.getItem("userInfo") || "{}")?.role;
    setItems(allItems.filter(item => item.roles.includes(userRole)));
  }, []);

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent>
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold ">
            {open ? "Milo Dashboard" : "MD"}
          </h1>
        </div>

        <SidebarGroup>
          {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary/20 text-primary font-medium text-2xl shadow-[0_0_20px_hsl(263_70%_60%/0.3)]"
                            : "hover:bg-sidebar-accent"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {open && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
