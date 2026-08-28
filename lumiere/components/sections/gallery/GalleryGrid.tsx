"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2 } from "lucide-react";

type GalleryItem = {
  id: string;
  title?: string;
  alt?: string;
  category: string;
  imageUrl?: string;
  image?: string;
  status?: string;
};

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Todos");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/galeria", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              "Não foi possível carregar a galeria.",
          );
        }

        const galleryItems = Array.isArray(data)
          ? data
          : [];

        // Se existir status, mostra somente os ativos/publicados.
        const visibleItems = galleryItems.filter(
          (item: GalleryItem) =>
            !item.status ||
            item.status === "Ativo" ||
            item.status === "Publicado",
        );

        setItems(visibleItems);
      } catch (err) {
        console.error(
          "Erro ao carregar galeria:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar a galeria.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadGallery();
  }, []);

  const categories = useMemo(() => {
    const availableCategories = Array.from(
      new Set(
        items
          .map((item) => item.category)
          .filter(Boolean),
      ),
    );

    return [
      "Todos",
      ...availableCategories,
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "Todos") {
      return items;
    }

    return items.filter(
      (item) =>
        item.category === selectedCategory,
    );
  }, [items, selectedCategory]);

  if (loading) {
    return (
      <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-64 max-w-7xl items-center justify-center gap-3 text-sm text-[#526866]">
          <Loader2
            size={20}
            className="animate-spin text-[#27877d]"
          />

          Carregando galeria...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {items.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const active =
                category === selectedCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${
                    active
                      ? "border-[#27877d] bg-[#27877d] text-white shadow-md"
                      : "border-black/10 bg-white text-[#526866] hover:border-[#27877d] hover:text-[#27877d]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {filteredItems.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const imageSrc =
                item.imageUrl ||
                item.image ||
                null;

              return (
                <figure
                  key={item.id}
                  className="group overflow-hidden rounded-2xl bg-[#e8f2f0] shadow-sm"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={
                          item.alt ||
                          item.title ||
                          "Imagem da galeria"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        unoptimized={imageSrc.startsWith(
                          "data:",
                        )}
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon
                          size={36}
                          className="text-[#72ad99]"
                        />
                      </div>
                    )}
                  </div>

                  {(item.title ||
                    item.category) && (
                    <figcaption className="bg-white px-4 py-4">
                      {item.title && (
                        <p className="text-sm font-semibold text-[#071a2b]">
                          {item.title}
                        </p>
                      )}

                      {item.category && (
                        <p className="mt-1 text-xs text-[#27877d]">
                          {item.category}
                        </p>
                      )}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-black/5 bg-white px-6 text-center">
            <ImageIcon
              size={38}
              className="text-[#72ad99]"
            />

            <p className="mt-4 text-sm font-medium text-[#526866]">
              Nenhuma imagem cadastrada.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}