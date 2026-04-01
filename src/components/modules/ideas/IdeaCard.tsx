"use client";

import { useState } from "react";
import IdeaDetailModal from "./IdeaDetailModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVote } from "@/service/vote.service";
import { toast } from "sonner";
import { useProfile } from "@/actions/user.action";



export interface IIdea {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  images: string[];
  status: string;
  type: "FREE" | "PAID" | string | undefined;
  price?: number;
  isPaid?: boolean;
  viewCount: number;
  createdAt: string;
  category?: { id: string; name: string };
  author?: { id: string; name: string; image?: string | null };
  _count?: { votes: number; comments: number };
  userVote?: string | null;
}

interface IdeaCardProps {
  idea: IIdea;
  onClick: () => void;
}

export default function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const [selectedIdea, setSelectedIdea] = useState<IIdea | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: handleVote, isPending } = useMutation({
    mutationFn: createVote});
        const { data, isLoading } = useProfile();
    
  return (
    <>
    <div className= "bg-white rounded-2xl overflow-hidden border border-green-100 transition-all duration-200 hover:-translat-y-1 hover:shadow-xl hover: shadow-green-100 hover: border - green - 300 group"
    >
    {/* Thumbnail */ }
  {
    idea.images?.length > 0 ? (
      <div className= "relative h-44 overflow-hidden" >
      <img
            src={ idea.images[0] }
    alt = { idea.title }
    className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      { idea?.type === "PAID" && (
        <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full shadow" >
              ৳ { idea.price }
    </div>
          )
  }
  </div>
      ) : (
    <div className= "h-32 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative" >
    <span className="text-4xl" >💡</span>
  {
    idea.type === "PAID" && (
      <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full" >
              ৳ { idea.price }
    </div>
          )
  }
  </div>
      )
}

<div className="p-4" >
  {/* Badges */ }
  < div className = "flex  mb-3 justify-between items-start" >
    <div className="flex gap-1.5 items-center" >
    {
      idea.category?.name && (
        <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
          { idea.category.name }
          </span>
          )
    }
      < span
className = {`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${idea.type === "PAID"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-green-50 text-green-700 border-green-200"
  }`}
          >
  { idea.type }
  </span>
  </div>
{
  idea.type === "PAID" && (<span
            className={
    `text-[12px] cursor-pointer font-semibold px-2.5 py-0.5 rounded-full border 
                 text-green-50 bg-green-700 border-green-200
            }`}
  onClick = {()=> { setSelectedIdea(idea) }
}
          >
  Pay Now
    </span>)}

</div>

{/* Title */ }
<h3 onClick={ onClick } className = "font-bold cursor-pointer text-green-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-green-700 transition-colors" >
  { idea.title }
  </h3>

{/* Description */ }
<p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4" >
  { idea.description }
  </p>

{/* Footer */ }
<div className="flex items-center justify-between pt-3 border-t border-green-50" >
  {/* Author */ }
  < div className = "flex items-center gap-2" >
    {
      idea.author?.image ? (
        <img
                src= { idea.author.image }
                className="w-6 h-6 rounded-full object-cover"
                alt=""
      />
            ) : (
        <img
                src="default.jpg"
                className = "w-6 h-6 rounded-full object-cover"
                alt = "avatar"
        />
            )}
<span className="text-xs text-gray-500 truncate max-w-[80px]" >
  { idea.author?.name }
  </span>
  </div>

{/* Stats */ }
<div className="flex items-center gap-3 text-gray-400 text-xs" >
  <span className="flex items-center gap-1" >
    <span className="text-green-500 cursor-pointer" onClick = { async() => {
  try {
    const res: any = await handleVote({
      id: idea.id,
      payload: { type: "UPVOTE" },
    });
    if(!data){
      toast.success("Please login to vote");
      return;
    }
console.log("res",res);
    if (!res?.success) {
      toast.error("Failed to upvote");
      return;
    }

    toast.success(res?.message || "Upvoted successfully");

      queryClient.invalidateQueries({ queryKey: ["ideas"] }) 
     } 
     catch (err: any) {
    toast.error(err.message);
  }
}}>▲</span>
  < span className = "font-medium text-gray-600" >
    { idea._count?.votes ?? 0 }
    </span>
    </span>
    < span className = "flex items-center gap-1" >
              💬
<span className="font-medium text-gray-600" >
  { idea._count?.comments ?? 0 }
  </span>
  </span>
  < span className = "flex items-center gap-1" >
              👁
<span className="font-medium text-gray-600" >
  { idea.viewCount ?? 0 }
  </span>
  </span>
  </div>
  </div>
  </div>
  </div>
{
  selectedIdea && (
    <IdeaDetailModal
          idea={ selectedIdea }
  onClose = {() => setSelectedIdea(null)
}
        />
      )}
</>
  );
}
