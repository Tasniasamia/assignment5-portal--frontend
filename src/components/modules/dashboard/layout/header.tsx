"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  Shield,
  Leaf,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/actions/user.action";
import { useLogout } from "@/actions/logout.action";

interface HeaderProps {
  role: string;
  userName?: string;
  image?: string;
}

export default function Header() {
  const { logout, isLoggingOut } = useLogout();
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
    const { data, isLoading } = useProfile();
  console.log("data",data);
   const userData={ role:data?.role === "ADMIN" ? "admin":data?.role==="MEMBER"?"member":"member", userName:data?.name, image:data?.image } as  HeaderProps
  const adminNotifs = [
    { id: 1, text: "New user registered", time: "2m ago", color: "#3a6647" },
    { id: 2, text: "Server usage at 89%", time: "10m ago", color: "#c97a20" },
    { id: 3, text: "Monthly report ready", time: "1h ago", color: "#4e8a5e" },
  ];
  const memberNotifs = [
    { id: 1, text: "New course available", time: "5m ago", color: "#4e8a5e" },
    {
      id: 2,
      text: "Your message was replied",
      time: "30m ago",
      color: "#3a6647",
    },
  ];
  const notifs = userData?.role === "admin" ? adminNotifs : memberNotifs;

  const pillStyle = {
    background: "#d4e8d8",
    color: "#2d5a3d",
    border: "1px solid rgba(78,138,94,0.2)",
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-5"
      style={{
        background: "#fff",
        borderBottom: "1px solid rgba(44,78,52,0.12)",
        boxShadow: "0 2px 12px rgba(28,56,41,0.08)",
      }}
    >
      {/* Title */}
      <div>
        <h1 className="font-bold text-sm" style={{ color: "#1a2b1f" }}>
          Dashboard
        </h1>
        <p className="text-[10px]" style={{ color: "#8a9e8e" }}>
          {userData?.role === "admin" ? "Admin Control Panel" : "Member Dashboard"}
        </p>
      </div>

      {/* Search */}
      <div
        className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 w-60"
        style={{
          background: "#f4f2e8",
          border: "1.5px solid rgba(44,78,52,0.12)",
        }}
      >
        <Search size={13} style={{ color: "#8a9e8e" }} />
        <input
          type="text"
          placeholder={
            userData?.role === "admin"
              ? "Search users, reports..."
              : "Search courses, content..."
          }
          className="bg-transparent text-sm outline-none flex-1 w-full"
          style={{ color: "#1a2b1f" }}
        />
        <kbd
          className="text-[10px] rounded px-1 py-0.5 font-mono"
          style={{ color: "#8a9e8e", border: "1px solid rgba(44,78,52,0.12)" }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Role pill */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full"
          style={pillStyle}
        >
          {userData?.role === "admin" ? <Shield size={11} /> : <Leaf size={11} />}
          {data?.role}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{ color: "#4a5e4e" }}
          >
            <Bell size={15} />
            {notifs.length > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#4e8a5e" }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-68 rounded-xl overflow-hidden z-50"
              style={{
                width: "272px",
                background: "#fff",
                border: "1px solid rgba(44,78,52,0.12)",
                boxShadow: "0 8px 24px rgba(28,56,41,0.12)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(44,78,52,0.08)" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#1a2b1f" }}
                >
                  Notifications
                </span>
                <span
                  className="text-xs cursor-pointer"
                  style={{ color: "#4e8a5e" }}
                >
                  Mark all read
                </span>
              </div>
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[#f4f2e8]"
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: n.color }}
                  />
                  <div>
                    <p className="text-xs" style={{ color: "#1a2b1f" }}>
                      {n.text}
                    </p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "#8a9e8e" }}
                    >
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}
              <div
                className="px-4 py-2.5"
                style={{ borderTop: "1px solid rgba(44,78,52,0.08)" }}
              >
                <span
                  className="text-xs cursor-pointer"
                  style={{ color: "#4e8a5e" }}
                >
                  View all
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Settings (admin only) */}
        {userData?.role === "admin" && (
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{ color: "#4a5e4e" }}
          >
            <Settings size={15} />
          </button>
        )}

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg transition-all"
            style={{ border: "1px solid rgba(44,78,52,0.12)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#4e8a5e,#2d5a3d)" }}
            >
              {userData?.image ? (
                <img
                  src={userData?.image}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                userData?.userName?.charAt(0).toUpperCase()
              )}
            </div>
            <span
              className="text-sm hidden sm:block"
              style={{ color: "#4a5e4e" }}
            >
              {userData?.userName?.split(" ")[0]}
            </span>
            <ChevronDown size={12} style={{ color: "#8a9e8e" }} />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50"
              style={{
                background: "#fff",
                border: "1px solid rgba(44,78,52,0.12)",
                boxShadow: "0 8px 24px rgba(28,56,41,0.12)",
              }}
            >
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid rgba(44,78,52,0.08)" }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1a2b1f" }}
                >
                  {userData?.userName}
                </p>
                <p className="text-xs capitalize" style={{ color: "#8a9e8e" }}>
                  {userData?.role}
                </p>
              </div>
              <div className="py-1">
                {[
                  {
                    label: "Profile",
                    href: "/my-profile",
                    icon: <User size={13} />,
                  },
                  {
                    label: "Settings",
                    href: "/changePassword",
                    icon: <Settings size={13} />,
                  },
                ].map((item) => (
                  <Link
                    key={item?.label}
                    href={item?.href}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-[#f4f2e8]"
                    style={{ color: "#4a5e4e" }}
                  >
                    {item.icon} {item?.label}
                  </Link>
                ))}
              </div>
              <div
                className="py-1"
                style={{ borderTop: "1px solid rgba(44,78,52,0.08)" }}
              >
                <button
                  className="w-full cursor-pointer flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                  style={{ color: "#b91c1c" }}
                  onClick={()=>{logout()}}
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
