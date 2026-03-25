"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type Cat = {
  id: string;
  url: string;
	vote: number;
};

export default function CatCard() {
  const [data, setData] = useState<Cat[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch("https://catmatch-dwgtdxf8dffwepa6.francecentral-01.azurewebsites.net/api/CatMatch/GetAllCat");

        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          return;
        }
        
        const cats: Cat[] = await response.json();
        setData(cats);
      } catch (error) {
        console.error("Failed to fetch cats:", error);
      }
    };
    fetchCats();
  }, []);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-3xl font-bold mb-4">All Cats</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((cat) => {
          const imageUrl = cat.url;

          const voteQuery = new URLSearchParams({
            catId: String(cat.id),
            imageUrl,
          }).toString();

          return (
            <Link
              key={cat.id}
              href={`/vote?${voteQuery}`}
              className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-transform hover:scale-[1.02]"
            >
              <Image
                src={imageUrl}
                alt={`Cat ${cat.id}`}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded"
              />
							<p className="flex justify-center text-center mt-5 lg:text-2xl">Score {cat.vote} pts</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
