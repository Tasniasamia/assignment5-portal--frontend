"use client"
import { useProfile } from "@/actions/user.action";

type Role = "admin" | "member";

export default function Footer() {
      const { data, isLoading } = useProfile();
  
  const year = new Date().getFullYear();
  const links = data?.role === "ADMIN"
    ? ["System Status", "API Docs", "Changelog"]
    : ["Help Center", "Community", "Contact Us"];

  return (
    <footer
      className="h-10 px-5 flex items-center justify-between shrink-0"
      style={{ background: "#fff", borderTop: "1px solid rgba(44,78,52,0.1)" }}
    >
      <p className="text-[11px]" style={{ color: "#8a9e8e" }}>
        © {year} EcoSpark Hub &nbsp;·&nbsp;
        <span style={{ color: "#3a6647", fontWeight: 600 }}>
          {data?.role === "ADMIN" ? "Admin Portal" : "Member Portal"}
        </span>
      </p>
      <div className="flex items-center gap-4">
        {links.map((link) => (
          <a key={link} href="#" className="text-[11px] transition-colors hover:text-[#3a6647]" style={{ color: "#8a9e8e" }}>
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}