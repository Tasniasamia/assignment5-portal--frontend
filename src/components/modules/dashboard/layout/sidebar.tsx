"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, Settings, ShieldCheck, BarChart3,
  FileText, Bell, CreditCard, BookOpen, Heart, MessageSquare,
  HelpCircle, ChevronLeft, ChevronRight, LogOut, Leaf,
} from "lucide-react";

type Role = "admin" | "member";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard",     href: "/admin/dashboard",     icon: <LayoutDashboard size={16} /> },

  { label: "Settings",      href: "/admin/settings",      icon: <Settings size={16} /> },
];

const memberNavItems: NavItem[] = [
  { label: "Dashboard",     href: "/member/dashboard",    icon: <LayoutDashboard size={16} /> },

];

interface SidebarProps {
  role: Role;
  userName?: string;
  userEmail?: string;
  image?: string | null;
}

export default function Sidebar({
  role,
  userName ,
  userEmail ,
  image,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = role === "admin" ? adminNavItems : memberNavItems;

  return (
    <aside
      className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out ${collapsed ? "w-[64px]" : "w-[230px]"}`}
      style={{ background: "#1c3829" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#4e8a5e" }}>
          <Leaf size={15} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm text-white tracking-wide truncate">
            Eco<span style={{ color: "#7ec897" }}>Spark</span>
          </span>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: "rgba(126,200,151,0.15)", color: "#7ec897", border: "1px solid rgba(126,200,151,0.25)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7ec897" }} />
            {role === "admin" ? "Administrator" : "Member"}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5" style={{ scrollbarWidth: "none" }}>
        {navItems.map((item) => {
          const isActive = pathname === item?.href;
          return (
            <Link
              key={item?.href}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm"
              style={{
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
              }}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: "#7ec897" }} />
              )}
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(126,200,151,0.2)", color: "#7ec897" }}>
                      {item?.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                  style={{ background: "#1c3829", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {item?.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg,#4e8a5e,#2d5a3d)" }}>
            {image
              ? <img src={image} alt="" className="w-full h-full rounded-full object-cover" />
              : userName?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{userName || 'User'}</p>
                <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{userEmail || 'N/A'}</p>
              </div>
              <button style={{ color: "rgba(255,100,100,0.5)" }} title="Logout">
                <LogOut size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center transition-all z-10"
        style={{ background: "#fff", border: "1px solid rgba(44,78,52,0.2)", color: "#4a5e4e", boxShadow: "0 2px 8px rgba(28,56,41,0.1)" }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}