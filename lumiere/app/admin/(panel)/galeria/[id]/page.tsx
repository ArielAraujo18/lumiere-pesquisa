"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";

export default function ViewGalleryItemPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/galeria/${params.id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Não foi possível carregar a foto.");
        }

        setItem(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar foto.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#27877d]" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8 text-sm text-red-600">
        {error || "Foto não encontrada."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center justify-between border-b border-black/5 bg-white px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/galeria"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-[#506260] hover:bg-[#f5f8f7]"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold">Detalhes da foto</h1>
        </div>

        <Link
          href={`/admin/galeria/${item.id}/editar`}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#27877d] px-4 text-sm font-medium text-white hover:bg-[#21766d]"
        >
          <Pencil size={16} />
          Editar
        </Link>
      </header>

      <div className="p-5 sm:p-8">
        <article className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="bg-[#e8f0ef]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-h-[620px] w-full object-contain"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-[#27877d]">
                  {item.category}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  item.status === "Publicado"
                    ? "bg-green-50 text-green-700"
                    : "bg-[#eef1f0] text-[#61706e]"
                }`}
              >
                {item.status}
              </span>
            </div>

            {item.description && (
              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[#506260]">
                {item.description}
              </p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
