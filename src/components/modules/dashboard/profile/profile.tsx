"use client";
import { useProfile } from "@/actions/user.action";
import {
  Edit,
  Mail,
  Phone,
  Shield,
  Clock,
  CheckCircle,
  User,
  Hash,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import UpdateProfile from "../../auth/updateProfileForm";
import { useRouter } from "next/navigation";

/* ─── helpers ─── */
const formatDate = (iso:string | number | Date) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ─── skeleton ─── */
const Skeleton = () => (
  <div className="animate-pulse p-8 space-y-6">
    <div className="flex items-center gap-5">
      <div className="h-24 w-24 rounded-full bg-[#c8d5c0]" />
      <div className="space-y-3">
        <div className="h-5 w-36 rounded-md bg-[#c8d5c0]" />
        <div className="h-3.5 w-24 rounded-md bg-[#dde6d8]" />
      </div>
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 rounded-xl bg-[#dde6d8]" />
    ))}
  </div>
);

/* ─── info card row ─── */
interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
}
const InfoCard = ({ icon: Icon, label, value }:InfoCardProps) => (
  <div className="flex items-center gap-4 rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-[#dde6d8]">
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#1a4a2e]/10">
      <Icon size={16} className="text-[#1a4a2e]" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6b8f71]">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-[#1a2e1d]">
        {value ?? "—"}
      </p>
    </div>
  </div>
);

/* ─── badge ─── */
const Badge = ({ children, color = "green" }:{children:React.ReactNode,color?: "green" | "teal" | "amber";}) => {
  const colors = {
    green: "bg-[#1a4a2e]/10 text-[#1a4a2e] ring-[#1a4a2e]/20",
    teal: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${colors[color]}`}
    >
      {children}
    </span>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Profile = () => {
  const { data, isLoading } = useProfile();
  const [isEdit, setIsEdit] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ hydration fix
  const {push}=useRouter();
  useEffect(() => {
    setMounted(true); // ✅ client-side mount হলে true হবে
  }, []);

  // Server ও Client উভয়ই প্রথমে Skeleton দেখাবে — hydration match থাকবে
  if (!mounted || isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-[#f0ece4] shadow-md">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isMember = data?.role === "MEMBER";
  const roleData = isMember ? data?.member : data?.admin;
  const roleLabel = isMember ? "Member" : "Admin";

  /* ── edit mode ── */
  if (isEdit) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl bg-[#f0ece4] shadow-md">
          <div className="flex items-center justify-between border-b border-[#d4cfc6] bg-[#e8e2d8] px-6 py-4">
            <h2 className="text-base font-semibold text-[#1a2e1d]">
              Edit Profile
            </h2>
            <button
              onClick={() => setIsEdit(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#1a4a2e] hover:bg-[#d4cfc6] transition-colors"
            >
              ← Cancel
            </button>
          </div>
          <div className="p-6">
            <UpdateProfile />
          </div>
        </div>
      </div>
    );
  }

  /* ── view mode ── */
  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-2xl bg-[#f0ece4] shadow-md">

        {/* ── dark green header ── */}
        <div className="relative bg-[#1a4a2e] px-6 pt-6 pb-16">
          {/* subtle dot texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6db87a]">
                My Account
              </p>
              <h1 className="mt-0.5 text-xl font-bold text-white">
                Profile Overview
              </h1>
            </div>
            <button
              onClick={() => setIsEdit(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/20 transition-all"
            >
              <Edit size={13} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── avatar overlapping header ── */}
        <div className="px-6">
          <div className="flex items-end gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={roleData?.profilePhoto ? data.image : "/default.jpg"}
                alt={data.name}
                className="h-24 w-24 rounded-2xl -mt-9 border-4 border-[#f0ece4] object-cover shadow-lg"
              />
              {data.status === "ACTIVE" && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#f0ece4] bg-emerald-500" />
              )}
            </div>
            <div className="mb-1 min-w-0">
              <h2 className="truncate text-lg font-bold text-[#1a2e1d]">
                {roleData?.name ?? data.name}
              </h2>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge color="green">{roleLabel}</Badge>
                <Badge color={data.status === "ACTIVE" ? "teal" : "amber"}>
                  {data.status === "ACTIVE" && <CheckCircle size={9} />}
                  {data.status}
                </Badge>
                {data.emailVerified && (
                  <Badge color="teal">
                    <CheckCircle size={9} />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── contact info ── */}
        <div className="mt-6 px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#6b8f71]">
            Contact Information
          </p>
          <div className="space-y-2.5">
            <InfoCard icon={Mail} label="Email Address" value={roleData?.email ?? data.email} />
            {roleData?.contactNumber && (
              <InfoCard icon={Phone} label="Contact Number" value={roleData.contactNumber} />
            )}
            <InfoCard icon={User} label="Username" value={data.name} />
          </div>
        </div>

        {/* ── account details ── */}
        <div className="mt-5 px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#6b8f71]">
            Account Details
          </p>
          <div className="space-y-2.5">
            <InfoCard icon={Shield} label="Role" value={roleLabel} />
            <InfoCard
              icon={Hash}
              label={`${roleLabel} ID`}
              value={roleData?.id ? roleData.id.slice(0, 24) + "…" : "—"}
            />
            <InfoCard
              icon={Clock}
              label="Member Since"
              value={formatDate(roleData?.createdAt ?? data.createdAt)}
            />
          </div>
        </div>

        {/* ── password warning ── */}
        
          <div onClick={()=>{push("/changePassword")}} className="cursor-pointer mx-6 mt-5 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
            <div>
              <p className="text-sm font-semibold text-amber-700">
                Password change 
              </p>
              <p className="text-xs text-amber-600">
                Please update your password to keep your account secure.
              </p>
            </div>
          </div>
      

        {/* ── footer ── */}
        <div className="mt-6 border-t border-[#d4cfc6] px-6 py-4">
          <p className="text-center text-[11px] text-[#9aab97]">
            Last updated:{" "}
            <span className="font-medium text-[#6b8f71]">
              {formatDate(data.updatedAt)}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;