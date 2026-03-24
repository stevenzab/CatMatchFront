"use client";

import Image from "next/image";
import { use, useState } from "react";

type VotePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function Vote({ searchParams }: VotePageProps) {
  const params = use(searchParams);
  const rawCatId = params.catId;
  const rawImageUrl = params.imageUrl;

  const catId = Array.isArray(rawCatId) ? rawCatId[0] : rawCatId;
  const imageUrl = Array.isArray(rawImageUrl) ? rawImageUrl[0] : rawImageUrl;
  const [vote, setVote] = useState<"like" | "dislike" | null>(null);
	console.log(window.location.href);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-3xl font-bold mb-4">Vote for Your Favorite Cat</h1>
      <>
        <Image
          src={imageUrl}
          alt={`Cat ${catId}`}
          width={500}
          height={500}
          className="w-full max-w-md h-72 object-cover rounded-lg shadow"
        />
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setVote("like")}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Like
          </button>
          <button
            type="button"
            onClick={() => setVote("dislike")}
            className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700"
          >
            Dislike
          </button>
        </div>
        {vote && (
          <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Ton vote: {vote === "like" ? "Like" : "Dislike"}
          </p>
        )}
      </>
    </div>
  );
}