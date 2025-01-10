'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Layers, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/src/components/ui/sidebar";

const menuItems = [
  {
    title: "Blog Posts",
    icon: FileText,
    path: "/editor/posts",
  },
  {
    title: "Categories",
    icon: Layers,
    path: "/editor/categories",
  },
  {
    title: "Authors",
    icon: Users,
    path: "/editor/authors",
  },
];

export const EditorSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="h-auto w-64">
      <SidebarHeader className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Editor</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={pathname?.startsWith(item.path)}
              >
                <Link href={item.path} className="flex items-center gap-2 px-4 py-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};