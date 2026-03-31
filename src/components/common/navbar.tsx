"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Leaf,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/actions/logout.action";
import { useProfile } from "@/actions/user.action";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Ideas", href: "/idea" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

// Demo — replace with your auth context/hook
// const useAuth = () => {
//   return { user: null, isLoggedIn: false };

// };

export default function Header() {
  const pathname = usePathname();
  // const { user, isLoggedIn } = useAuth();
    const { data, isLoading } = useProfile();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
const { logout, isLoggingOut } = useLogout();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--forest)] flex items-center justify-center group-hover:bg-[var(--forest-light)] transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-[var(--forest)]">
              EcoSpark
              <span className="text-[var(--amber)]"> Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[var(--forest)] bg-[var(--forest)]/8"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest)] hover:bg-[var(--forest)]/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {data && data?.email ? (
              <>
                <Link href={data?.role === "ADMIN"?"/admin/dashboard":"/member/dashboard"}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-[var(--forest)] text-[var(--forest)] hover:bg-[var(--forest)] hover:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                    <Avatar className="w-9 h-9 border-2 border-[var(--sage)]">
                      <AvatarImage src={(data?.image as string)} />
                      <AvatarFallback className="bg-[var(--forest)] text-white text-sm">
                        {(data?.name as string)?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-[var(--ink-muted)]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2 border-b border-[var(--border)]">
                      <p className="text-sm font-medium">{(data?.name as any)}</p>
                      <p className="text-xs text-[var(--ink-faint)]">{(data?.email as any)}</p>
                    </div>
                    <DropdownMenuItem  asChild>
                      <Link href="/my-profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={data?.role === "ADMIN"?"/admin/dashboard":"/member/dashboard"} className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/changePassword" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="text-red-500 cursor-pointer" onClick={()=>{logout()}}>
                      <LogOut className="w-4 h-4 mr-2 cursor-pointer"  /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--ink-muted)] cursor-pointer hover:text-[var(--forest)]"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-[var(--forest)] cursor-pointer hover:bg-[var(--forest-light)] text-white rounded-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
     <SheetTrigger className="lg:hidden p-2 rounded-lg hover:bg-[var(--forest)]/5 transition-colors">
  <Menu className="w-5 h-5 text-[var(--ink-muted)]" />
</SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-[var(--cream)]">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-[var(--forest)] flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-[var(--forest)]">
                  EcoSpark <span className="text-[var(--amber)]">Hub</span>
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-[var(--forest)] bg-[var(--forest)]/10"
                        : "text-[var(--ink-muted)] hover:text-[var(--forest)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="section-divider my-4" />
                {data?.email ? (
                  <>
                    <Link href={data?.role === "ADMIN"?"/admin/dashboard":"/member/dashboard"} onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[var(--forest)] text-white">
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 ">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full cursor-pointer border-[var(--forest)] text-[var(--forest)]">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[var(--forest)] text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}