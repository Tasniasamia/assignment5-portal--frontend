import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Leaf,
  Zap,
  Recycle,
  Car,
  Droplets,
  Sprout,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
  Lightbulb,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import IdeaCard from "@/components/shared/IdeaCard";
import Hero from "@/components/modules/home/hero";
import AboutSection from "@/components/common/about";
import ServicesSection from "@/components/common/service";
import ContactSection from "@/components/common/contact";

// Demo data — replace with actual API calls
const featuredIdeas = [
  {
    id: "1",
    title: "Solar-Powered Community Water Purification System",
    description:
      "Installing solar-powered water purification units in rural communities to provide clean drinking water without electricity costs.",
    images: [],
    type: "FREE" as const,
    category: { name: "Energy" },
    author: { name: "Rahim Khan" },
    _count: { votes: 142, comments: 38 },
    viewCount: 1240,
    userVote: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Zero-Waste Marketplace for Local Farmers",
    description:
      "An online platform connecting local farmers directly with consumers, reducing packaging waste and transportation emissions.",
    images: [],
    type: "PAID" as const,
    price: 99,
    category: { name: "Waste" },
    author: { name: "Sumaiya Ahmed" },
    _count: { votes: 98, comments: 21 },
    viewCount: 876,
    userVote: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Electric Rickshaw Sharing Network",
    description:
      "A city-wide electric rickshaw sharing program to reduce carbon emissions from last-mile transportation in urban areas.",
    images: [],
    type: "FREE" as const,
    category: { name: "Transportation" },
    author: { name: "Farhan Hossain" },
    _count: { votes: 211, comments: 54 },
    viewCount: 2100,
    userVote: null,
    createdAt: new Date().toISOString(),
  },
];

const topVotedIdeas = [
  {
    id: "4",
    title: "Rooftop Rain Harvesting Grid",
    votes: 311,
    category: "Water",
    author: "Nadia Islam",
  },
  {
    id: "1",
    title: "Solar-Powered Water Purification",
    votes: 142,
    category: "Energy",
    author: "Rahim Khan",
  },
  {
    id: "3",
    title: "Electric Rickshaw Sharing Network",
    votes: 211,
    category: "Transportation",
    author: "Farhan Hossain",
  },
];

const stats = [
  { label: "Ideas Shared", value: "1,240+", icon: Lightbulb },
  { label: "Active Members", value: "8,400+", icon: Users },
  { label: "Votes Cast", value: "32K+", icon: TrendingUp },
  { label: "Categories", value: "12", icon: Leaf },
];

const categories = [
  { name: "Energy", icon: Zap, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { name: "Waste", icon: Recycle, color: "bg-green-50 text-green-600 border-green-200" },
  { name: "Transportation", icon: Car, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { name: "Water", icon: Droplets, color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  { name: "Agriculture", icon: Sprout, color: "bg-lime-50 text-lime-600 border-lime-200" },
  { name: "Community", icon: Users, color: "bg-purple-50 text-purple-600 border-purple-200" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[var(--cream)]">
      {/* ── Hero ── */}
<Hero/>
<AboutSection/>
<ServicesSection/>
<ContactSection/>
      
    </main>
  );
}