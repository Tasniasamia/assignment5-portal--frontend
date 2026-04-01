"use client";

import { useEffect, useState } from "react";
import type { IIdea } from "./IdeaCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";
import { getIdeaById } from "@/service/idea.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CommentSection from "./CommentSection";
import { useProfile } from "@/actions/user.action";

dayjs.extend(relativeTime);

interface Props {
  idea: IIdea;
}

const IdeaDetailsComponent = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading } = useProfile();

  const { data: ideaData, isLoading: ideaLoading, error } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdeaById(id),
    retry: false, // ⚠️ important (nahole loop hobe)
  });

  // ✅ redirect logic
  useEffect(() => {
    if (error instanceof Error) {
      if (error.message === "Please purchase this idea to view it") {
        toast.error("Please purchase this idea to view it");
        router.push("/idea");
      }
    }
  }, [error, router]);

  const idea = ideaData?.data;

  const [imgIndex, setImgIndex] = useState(0);
  const images: string[] = idea?.images || [];

  // optional loading UI
  if (ideaLoading) {
    return <div className="p-10 text-center" > Loading...</div>;
  }


  return (
    <div className= "max-w-[1200px] mx-auto my-[60px]" >
    <div className="bg-white  w-full  flex flex-col  overflow-hidden" >

      {/* ── Modal Header ── */ }
      < div className = "flex-shrink-0 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 relative" >

        <div className="flex gap-2 mb-2 flex-wrap pr-10" >
          { idea?.category?.name && (
            <span className="bg-green-600/60 text-green-100 text-[10px] font-semibold px-3 py-0.5 rounded-full border border-green-500/40" >
              { idea?.category?.name }
              </span>
            )}

<span
              className={
  `text-[10px] font-semibold px-3 py-0.5 rounded-full border ${idea?.type === "PAID"
    ? "bg-amber-400/30 text-amber-200 border-amber-400/40"
    : "bg-green-600/40 text-green-200 border-green-400/40"
  }`
}
            >
  { idea?.type }
  </span>

{
  idea?.type === "PAID" && idea?.price && (
    <span className="bg-amber-400/30 text-amber-200 text-[10px] font-bold px-3 py-0.5 rounded-full border border-amber-400/40" >
                ৳ { idea?.price }
  </span>
            )
}
</div>

  < h2 className = "text-xl font-extrabold text-white leading-snug pr-10" >
    { idea?.title }
    </h2>

    < div className = "flex items-center gap-3 mt-2" >
      <span className="text-green-200 text-xs font-medium" >
        { idea?.author?.name }
        </span>

        < span className = "text-green-400 text-xs" >•</span>

          < span className = "text-green-300 text-xs" >
            { dayjs(idea?.createdAt).fromNow() }
            </span>

            < span className = "text-green-400 text-xs" >•</span>

              < span className = "text-green-300 text-xs flex items-center gap-1" >
              👁 { idea?.viewCount }
</span>
  </div>
  </div>

{/* ── Body ── */ }
<div className="flex-1 overflow-y-auto" >
  <div className="px-6 py-5 space-y-5" >

  {
    images.length > 0 && (
      <div>
      <img
                  src={ images[imgIndex] }
alt = { idea?.title }
className = "w-full h-52 object-cover rounded-xl"
  />

  { images?.length > 1 && (
    <div className="flex gap-2 mt-2" >
      { images?.map((img, i) => (
        <img
                        key= { i }
src = { img }
onClick = {() => setImgIndex(i)}
className = {`w-14 h-10 object-cover rounded-lg cursor-pointer transition-all ${i === imgIndex
    ? "ring-2 ring-green-500 opacity-100"
    : "opacity-60 hover:opacity-90"
  }`}
alt = ""
  />
                    ))}
</div>
                )}
</div>
            )}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
  <div className="bg-green-50 border border-green-100 rounded-xl p-4" >
    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-2" >
                  🔍 Problem Statement
  </p>
  < p className = "text-sm text-gray-700 leading-relaxed" >
    { idea?.problemStatement }
    </p>
    </div>

    < div className = "bg-green-50 border border-green-100 rounded-xl p-4" >
      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-2" >
                  💡 Proposed Solution
  </p>
  < p className = "text-sm text-gray-700 leading-relaxed" >
    { idea?.proposedSolution }
    </p>
    </div>
    </div>

    < div className = "bg-gray-50 border border-gray-100 rounded-xl p-4" >
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2" >
                📄 Description
  </p>
  < p className = "text-sm text-gray-700 leading-relaxed whitespace-pre-wrap" >
    { idea?.description }
    </p>
    </div>

    < div className = "border-t border-green-100" />

      <CommentSection
  ideaId={ id }
currentUserId = { data?.id }
  />
  </div>
  </div>
  </div>
  </div>
  );
};

export default IdeaDetailsComponent;