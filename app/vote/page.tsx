"use client";

import Link from "next/dist/client/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";

type VotePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type Cat = {
  id: string;
  url: string;
	vote: number;
};

export default function Vote({ searchParams }: VotePageProps) {
  const params = use(searchParams);
  const rawCatId = params.catId;
  const rawImageUrl = params.imageUrl;

  const catId = Array.isArray(rawCatId) ? rawCatId[0] : rawCatId;
  const imageUrl = Array.isArray(rawImageUrl) ? rawImageUrl[0] : rawImageUrl;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

	const [data, setData] = useState<Cat | null>(null);

	const fetchCat = async () => {
		if (!catId) return;
		try {
			const response = await fetch(`https://localhost:7269/api/CatMatch/GetCatById/${catId}`);
			if (!response.ok) throw new Error("Erreur GetCatById");
			const cat = await response.json();
			setData(cat);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Erreur inconnue");
		}
	};

	useEffect(() => {
		fetchCat().catch((e) => setError(e.message));
	}, [catId]);

	const handleDislikeVote = () => {
		try {
			handleSubmitVote(-1);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Erreur inconnue");
		}
	}

  const handleSubmitVote = async (voteCat: 1 | -1) => {
  setLoading(true);
  setError(null);

  try {
			const response = await fetch("https://localhost:7269/api/CatMatch/VoteCat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: catId,
					url: imageUrl,
					vote: voteCat,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.title || "Erreur lors du vote");
			}

			await fetchCat();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

  if (!catId || !imageUrl) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          Aucun chat sélectionné. Retourne à l'accueil et clique sur une image.
      </div>
    );
  }

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
            onClick={() => handleSubmitVote(1)}
            disabled={loading}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Vote en cours..." : "Like"}
          </button>
          <button
            type="button"
            onClick={() => handleDislikeVote()}
            disabled={loading}
            className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Vote en cours..." : "Dislike"}
          </button>
					<Link href="/" className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700">
						<button>
							Back
						</button>
					</Link>
        </div>
					<p>
						Score actuel: {data?.vote ?? 0} pts
					</p>
        {error && (
          <p className="mt-4 text-lg font-semibold text-red-600">
            Erreur: {error}
          </p>
        )}
      </>
    </div>
  );
}