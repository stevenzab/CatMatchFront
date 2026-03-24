"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function CatCard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch("https://localhost:7269/api/CatMatch/GetAllCat");
        
        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          return;
        }
        
        const cats = await response.json();
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
        {data.map((cat: any) => {
          let imageUrl = cat;
          
          if (cat.url) {
            if (cat.url.startsWith('http')) {
              imageUrl = cat.url;
            }
          }          
          return (
          <div key={cat.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <Image
              src={imageUrl}
              alt="Cat Image"
              width={300}
              height={500}
              className="w-full h-48 object-cover rounded"
            />
          </div>
          );
        })}
      </div>
    </div>
  );
}
