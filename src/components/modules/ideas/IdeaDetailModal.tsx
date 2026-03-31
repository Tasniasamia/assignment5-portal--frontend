// "use client";

// import { useState, useEffect } from "react";
// import { getVoteCount } from "@/service/public.idea.service";
// import VoteButtons from "./VoteButtons";
// import CommentSection from "./CommentSection";
// import type { IIdea } from "./IdeaCard";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { Button } from "@/components/ui/button";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createPayment } from "@/service/payment.service";
// import { toast } from "sonner";

// dayjs.extend(relativeTime)


// interface IdeaDetailModalProps {
//   idea: IIdea;
//   onClose: () => void;
// }

// export default function IdeaDetailModal({ idea, onClose }: IdeaDetailModalProps) {
//   const [imgIndex, setImgIndex] = useState(0);



//   // // Close on backdrop click
//   const handleBackdrop = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) onClose();
//   };



//   const images = idea.images || [];


//   const queryClient = useQueryClient();

// const { mutateAsync: handlePayment, isPending } = useMutation({
//     mutationFn: createPayment,
//     onSuccess: () => {
//       toast.success("Payment initiated successfully");

//       queryClient.invalidateQueries({ queryKey: ["admin-ideas"] }); // ✅ FIX

  
//     },
//     onError: (error: any) => {
//       toast.error(error?.message || "Failed to create category"); // ✅ FIX
//     },
//   });




//   return (
//     <div
//       onClick={handleBackdrop}
//       className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
//     >
//       <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
//         {/* ── Modal Header ── */}
//         <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-green-900 to-green-700 relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
//           >
//             ✕
//           </button>

//           <div className="flex gap-2 mb-2 flex-wrap pr-10">
//             {idea.category?.name && (
//               <span className="bg-green-600/60 text-green-100 text-[10px] font-semibold px-3 py-0.5 rounded-full border border-green-500/40">
//                 {idea.category.name}
//               </span>
//             )}
//             <span className={`text-[10px] font-semibold px-3 py-0.5 rounded-full border ${
//               idea.type === "PAID"
//                 ? "bg-amber-400/30 text-amber-200 border-amber-400/40"
//                 : "bg-green-600/40 text-green-200 border-green-400/40"
//             }`}>
//               {idea.type}
//             </span>
//             {idea.type === "PAID" && idea.price && (
//               <span className="bg-amber-400/30 text-amber-200 text-[10px] font-bold px-3 py-0.5 rounded-full border border-amber-400/40">
//                 ৳ {idea.price}
//               </span>
//             )}
//           </div>

//           <h2 className="text-xl font-extrabold text-white leading-snug pr-10">
//             {idea.title}
//           </h2>

//           <div className="flex items-center gap-3 mt-2">
//             <div className="flex items-center gap-2">
          
//               <span className="text-green-200 text-xs font-medium">
//                 {idea?.author?.name}
//               </span>
//             </div>
//             <span className="text-green-400 text-xs">•</span>
//             <span className="text-green-300 text-xs">{dayjs(idea.createdAt).fromNow(true)}</span>
//             <span className="text-green-400 text-xs">•</span>
//             <span className="text-green-300 text-xs flex items-center gap-1">
//               👁 {idea.viewCount}
//             </span>
//           </div>
//         </div>

    
//         <div className="flex-1 overflow-y-auto">
//           <div className="px-6 py-5 space-y-5">

          
//             {images.length > 0 && (
//               <div>
//                 <img
//                   src={images[imgIndex]}
//                   alt={idea.title}
//                   className="w-full h-52 object-cover rounded-xl"
//                 />
//                 {images.length > 1 && (
//                   <div className="flex gap-2 mt-2">
//                     {images.map((img, i) => (
//                       <img
//                         key={i}
//                         src={img}
//                         onClick={() => setImgIndex(i)}
//                         className={`w-14 h-10 object-cover rounded-lg cursor-pointer transition-all ${
//                           i === imgIndex
//                             ? "ring-2 ring-green-500 opacity-100"
//                             : "opacity-60 hover:opacity-90"
//                         }`}
//                         alt=""
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

           
      

      
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="bg-green-50 border border-green-100 rounded-xl p-4">
//                 <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-2">
//                   🔍 Problem Statement
//                 </p>
//                 <p className="text-sm text-gray-700 leading-relaxed">
//                   {idea.problemStatement}
//                 </p>
//               </div>
//               <div className="bg-green-50 border border-green-100 rounded-xl p-4">
//                 <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-2">
//                   💡 Proposed Solution
//                 </p>
//                 <p className="text-sm text-gray-700 leading-relaxed">
//                   {idea.proposedSolution}
//                 </p>
//               </div>
//             </div>

 
//             <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
//               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">
//                 📄 Description
//               </p>
//               <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
//                 {idea.description}
//               </p>
//             </div>

     
//        <Button onClick={async()=>{ const res=await handlePayment({ideaId:idea?.id}); if(!res?.success){toast.error(res?.message)} toast.success(res?.message)}}  variant="outlline" type="button">Pay Now</Button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import type { IIdea } from "./IdeaCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "@/service/payment.service";
import { toast } from "sonner";

dayjs.extend(relativeTime);

interface IdeaDetailModalProps {
  idea: IIdea;
  onClose: () => void;
}

export default function IdeaDetailModal({
  idea,
  onClose,
}: IdeaDetailModalProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = idea?.images || [];

  const queryClient = useQueryClient();

  // const { mutateAsync: handlePayment, isPending } = useMutation({
  //   mutationFn: createPayment,
  //   onSuccess: (res: any) => {

  //     queryClient.invalidateQueries({ queryKey: ["ideas"] }); // ✅ better key
  //   },
  //   onError: (error: any) => {
  //     toast.error(error?.message || "Payment failed");
  //   },
  // });


  const { mutateAsync: handlePayment, isPending } = useMutation({
  mutationFn: createPayment,
  onError: (error: any) => {
    toast.error(error?.message || "Payment failed");
  },
});

const handlePay = async () => {
  try {
    const res: any = await handlePayment({ ideaId: idea?.id });

    console.log("payment res =>", res); // 🔍 MUST check

    if (!res?.success) {
      toast.error(res?.message || "Payment failed");
      return;
    }

    const url =
      res?.data?.paymentUrl ||
      res?.data?.url ||
      res?.paymentUrl;

    if (!url) {
      toast.error("Payment URL not found");
      return;
    }

    // ✅ redirect (best)
    window.location.href = url;

  } catch (err: any) {
    toast.error(err?.message);
  }
};
  // backdrop click close
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // const handlePay = async () => {
  //   try {
  //     const res = await handlePayment({ ideaId: idea?.id });

  //     if (!res?.success) {
  //       toast.error(res?.message || "Payment failed");
  //     }
  //     window.open(res?.data?.paymentUrl, "_blank");
  //   } catch (err: any) {
  //     toast.error(err?.message);
  //   }
  // };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-green-900 to-green-700 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            ✕
          </button>

          <div className="flex gap-2 mb-2 flex-wrap pr-10">
            {idea?.category?.name && (
              <span className="bg-green-600/60 text-green-100 text-[10px] px-3 py-0.5 rounded-full border">
                {idea.category.name}
              </span>
            )}

            <span
              className={`text-[10px] px-3 py-0.5 rounded-full border ${
                idea?.type === "PAID"
                  ? "bg-amber-400/30 text-amber-200"
                  : "bg-green-600/40 text-green-200"
              }`}
            >
              {idea?.type}
            </span>

            {idea?.type === "PAID" && idea?.price && (
              <span className="bg-amber-400/30 text-amber-200 text-[10px] px-3 py-0.5 rounded-full border">
                ৳ {idea.price}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-white">{idea?.title}</h2>

          <div className="flex items-center gap-2 mt-2 text-xs text-green-200">
            <span>{idea?.author?.name}</span>
            <span>•</span>
            <span>{dayjs(idea?.createdAt).fromNow()}</span>
            <span>•</span>
            <span>👁 {idea?.viewCount}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          
          {/* Images */}
          {images.length > 0 && (
            <div>
              <img
                src={images[imgIndex]}
                alt={idea?.title}
                className="w-full h-52 object-cover rounded-xl"
              />

              {images.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setImgIndex(i)}
                      className={`w-14 h-10 rounded cursor-pointer ${
                        i === imgIndex
                          ? "ring-2 ring-green-500"
                          : "opacity-60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Problem + Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-green-600 mb-2">
                Problem
              </p>
              <p>{idea?.problemStatement}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-green-600 mb-2">
                Solution
              </p>
              <p>{idea?.proposedSolution}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs font-bold text-gray-500 mb-2">
              Description
            </p>
            <p className="whitespace-pre-wrap">{idea?.description}</p>
          </div>

          {/* Payment Button */}
          {idea?.type === "PAID" && (
            <Button
              onClick={handlePay}
              disabled={isPending}
              className="bg-green-600 text-white text-base rounded-lg cursor-pointer   w-full py-4"
            >
              {isPending ? "Processing..." : "Pay Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}