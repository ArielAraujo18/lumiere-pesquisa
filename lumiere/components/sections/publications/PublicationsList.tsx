"use client";

import { useEffect, useMemo, useState } from "react";

const categories = ["Todos", "Artigos", "Eventos", "Resumos", "Relatórios"];

type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  category: string;
  year: number;
  url: string;
};

export function PublicationsList() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPublications() {
      try {
        const response = await fetch("/api/publicacoes");

        if (!response.ok) {
          throw new Error("Erro ao carregar publicações");
        }

        const data: Publication[] = await response.json();
        setPublications(data);
      } catch (error) {
        console.error(error);
      }
    }

    void loadPublications();
  }, []);

  const filteredPublications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return publications.filter((publication) => {
      const matchesCategory =
        selectedCategory === "Todos" ||
        publication.category === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        publication.title.toLowerCase().includes(normalizedSearch) ||
        publication.authors.toLowerCase().includes(normalizedSearch) ||
        publication.venue.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [publications, search, selectedCategory]);
  
  return (
    <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Buscar publicações</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#72ad99]"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar publicações..."
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-12 pr-4 text-sm text-[#071a2b] outline-none transition focus:border-[#27877d]"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active = category === selectedCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-xl border px-5 py-3 text-sm font-medium transition ${
                    active
                      ? "border-[#27877d] bg-[#27877d] text-white"
                      : "border-black/10 bg-white text-[#526866] hover:border-[#27877d]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {filteredPublications.map((publication) => (
            <article
              key={publication.id}
              className="flex flex-col gap-5 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-[#e8f2f0] px-3 py-1 font-medium text-[#27877d]">
                    {publication.category}
                  </span>

                  <span className="font-medium text-[#72ad99]">
                    {publication.year}
                  </span>
                </div>

                <h2 className="mt-3 text-sm font-bold leading-6 text-[#071a2b] sm:text-base">
                  {publication.title}
                </h2>

                <p className="mt-1 text-xs text-[#526866]">
                  {publication.authors}
                </p>

                <p className="mt-1 text-xs italic text-[#72ad99]">
                  {publication.venue}
                </p>
              </div>

              <a
                href={publication.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e8f2f0] px-5 py-3 text-xs font-semibold text-[#27877d] transition hover:bg-[#dcebe7]"
              >
                ↗ Acessar
              </a>
            </article>
          ))}

          {filteredPublications.length === 0 && (
            <p className="py-10 text-center text-sm text-[#526866]">
              Nenhuma publicação encontrada.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}