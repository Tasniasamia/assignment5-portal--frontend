"use client";

import { useQuery } from "@tanstack/react-query";
import { getMemberStats } from "@/service/dashboard.service";
import {
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
} from "lucide-react";
import { useProfile } from "@/actions/user.action";

const StatCard = ({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  sub?: string;
}) => (
  <div className="bg-white rounded-2xl border border-green-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${accent}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-gray-800">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const IdeaStatusBadge = ({
  label,
  value,
  icon: Icon,
  bg,
  text,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  bg: string;
  text: string;
}) => (
  <div className={`${bg} rounded-2xl p-4 flex items-center justify-between border`}>
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${text}`} />
      <span className={`text-sm font-semibold ${text}`}>{label}</span>
    </div>
    <span className={`text-xl font-extrabold ${text}`}>{value}</span>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-green-50" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-green-50 rounded w-16" />
        <div className="h-3 bg-green-50 rounded w-24" />
      </div>
    </div>
  </div>
);

export default function MemberDashboard() {
    const {data:user,isLoading:userLoading}=useProfile()
  const { data, isLoading } = useQuery({
    queryKey: ["member-stats"],
    queryFn: getMemberStats,
  });

  const stats = data?.data as any;

  const mainStats = [
    {
      label: "My Ideas",
      value: stats?.totalIdeas ?? 0,
      icon: Lightbulb,
      accent: "bg-green-100 text-green-600",
      sub: "Total submitted",
    },
    {
      label: "My Votes",
      value: stats?.totalVotes ?? 0,
      icon: ThumbsUp,
      accent: "bg-emerald-100 text-emerald-600",
      sub: "Ideas voted on",
    },
    {
      label: "My Comments",
      value: stats?.totalComments ?? 0,
      icon: MessageSquare,
      accent: "bg-teal-100 text-teal-600",
      sub: "Comments posted",
    },
    {
      label: "My Purchases",
      value: stats?.totalPayments ?? 0,
      icon: CreditCard,
      accent: "bg-cyan-100 text-cyan-600",
      sub: "Ideas purchased",
    },
  ];

  const ideaStats = [
    {
      label: "Draft",
      value: stats?.ideaStats?.draft ?? 0,
      icon: FileEdit,
      bg: "bg-gray-50 border-gray-100",
      text: "text-gray-600",
    },
    {
      label: "Under Review",
      value: stats?.ideaStats?.underReview ?? 0,
      icon: Clock,
      bg: "bg-blue-50 border-blue-100",
      text: "text-blue-600",
    },
    {
      label: "Approved",
      value: stats?.ideaStats?.approved ?? 0,
      icon: CheckCircle,
      bg: "bg-emerald-50 border-emerald-100",
      text: "text-emerald-600",
    },
    {
      label: "Rejected",
      value: stats?.ideaStats?.rejected ?? 0,
      icon: XCircle,
      bg: "bg-red-50 border-red-100",
      text: "text-red-500",
    },
  ];

  const approvedPercent =
    stats?.totalIdeas > 0
      ? Math.round((stats.ideaStats?.approved / stats.totalIdeas) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-md">
        <p className="text-green-200 text-sm font-medium">Welcome back 👋</p>
        <h1 className="text-2xl font-extrabold mt-1">
          {user?.name ?? "Member"}
        </h1>
        <p className="text-green-100 text-sm mt-2">
          Here's a summary of your activity on the platform.
        </p>

        {/* Progress bar */}
        {!isLoading && stats?.totalIdeas > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-green-200 mb-1">
              <span>Approval rate</span>
              <span>{approvedPercent}%</span>
            </div>
            <div className="w-full bg-green-400/40 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-700"
                style={{ width: `${approvedPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Main Stats ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Your Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : mainStats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── Idea Status Breakdown ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Your Ideas by Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : ideaStats.map((s) => (
                <IdeaStatusBadge key={s.label} {...s} />
              ))}
        </div>
      </div>

      {/* ── Quick Tips ── */}
      {!isLoading && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-green-700 mb-3">💡 Quick Tips</h3>
          <div className="space-y-2">
            {(stats?.ideaStats?.draft ?? 0) > 0 && (
              <p className="text-sm text-green-800">
                You have <strong>{stats.ideaStats.draft}</strong> draft idea(s). Submit them for review!
              </p>
            )}
            {(stats?.ideaStats?.rejected ?? 0) > 0 && (
              <p className="text-sm text-green-800">
                <strong>{stats.ideaStats.rejected}</strong> idea(s) were rejected. Check feedback and revise.
              </p>
            )}
            {(stats?.totalVotes ?? 0) === 0 && (
              <p className="text-sm text-green-800">
                You haven't voted yet. Explore ideas and support your favorites!
              </p>
            )}
            {(stats?.ideaStats?.approved ?? 0) > 0 && (
              <p className="text-sm text-green-800">
                🎉 <strong>{stats.ideaStats.approved}</strong> of your idea(s) got approved. Keep it up!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}