"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStats, TAdminStats } from "@/service/dashboard.service";
import {
  Users,
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
}) => (
  <div className="bg-white rounded-2xl border border-green-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${accent}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-gray-800">{value.toLocaleString()}</p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── Idea Status Bar ──────────────────────────────────────────────────────────
const IdeaStatusCard = ({
  label,
  value,
  total,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  total: number;
  icon: React.ElementType;
  color: string;
}) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <span className="text-lg font-extrabold text-gray-800">{value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color.replace("text-", "bg-")}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5">{percent}% of total ideas</p>
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  const stats: TAdminStats | undefined = data?.data as any;
  const totalIdeas = stats?.totalIdeas ?? 0;

  const mainStats = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      accent: "bg-green-100 text-green-600",
    },
    {
      label: "Total Ideas",
      value: stats?.totalIdeas ?? 0,
      icon: Lightbulb,
      accent: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total Votes",
      value: stats?.totalVotes ?? 0,
      icon: ThumbsUp,
      accent: "bg-teal-100 text-teal-600",
    },
    {
      label: "Total Comments",
      value: stats?.totalComments ?? 0,
      icon: MessageSquare,
      accent: "bg-cyan-100 text-cyan-600",
    },
    {
      label: "Total Payments",
      value: stats?.totalPayments ?? 0,
      icon: CreditCard,
      accent: "bg-green-100 text-green-700",
    },
  ];

  const ideaStats = [
    {
      label: "Pending",
      value: stats?.ideaStats?.pending ?? 0,
      icon: AlertCircle,
      color: "text-yellow-500",
    },
    {
      label: "Under Review",
      value: stats?.ideaStats?.underReview ?? 0,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Approved",
      value: stats?.ideaStats?.approved ?? 0,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Rejected",
      value: stats?.ideaStats?.rejected ?? 0,
      icon: XCircle,
      color: "text-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform overview at a glance
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow">
          Admin Panel
        </div>
      </div>

      {/* ── Main Stats ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : mainStats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── Idea Status Breakdown ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Idea Status Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : ideaStats.map((s) => (
                <IdeaStatusCard
                  key={s.label}
                  {...s}
                  total={totalIdeas}
                />
              ))}
        </div>
      </div>

      {/* ── Summary Banner ── */}
      {!isLoading && stats && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold">Platform Health</h3>
              <p className="text-green-100 text-sm mt-1">
                {stats.ideaStats.approved} approved ideas out of {totalIdeas} total submissions
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-extrabold">{stats.totalUsers}</p>
                <p className="text-green-200 text-xs">Users</p>
              </div>
              <div className="w-px bg-green-400" />
              <div className="text-center">
                <p className="text-2xl font-extrabold">{stats.totalPayments}</p>
                <p className="text-green-200 text-xs">Payments</p>
              </div>
              <div className="w-px bg-green-400" />
              <div className="text-center">
                <p className="text-2xl font-extrabold">{stats.totalVotes}</p>
                <p className="text-green-200 text-xs">Votes</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}