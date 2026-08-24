"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

type NewsStatus = "Publicado" | "Rascunho";

type ApiNews = {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  status: NewsStatus;
  slug: string;
};

type News = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: NewsStatus;
  slug: string;
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/noticias",
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              "Erro ao buscar notícias.",
          );
        }

        const formattedNews: News[] = (
          data as ApiNews[]
        ).map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          author: item.author,
          date: formatDate(item.publishedAt),
          status: item.status,
          slug: item.slug,
        }));

        setNews(formattedNews);
      } catch (error) {
        console.error(
          "Erro ao carregar notícias:",
          error,
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as notícias.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadNews();
  }, []);

  const filteredNews = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return news;
    }

    return news.filter((item) =>
      [
        item.title,
        item.category,
        item.author,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [news, search]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta notícia?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/noticias/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Não foi possível excluir a notícia.",
        );
      }

      setNews((current) =>
        current.filter(
          (item) => item.id !== id,
        ),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Erro ao excluir a notícia.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faf8]">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 sm:px-8">
        <h1 className="text-lg font-bold text-[#071a2b]">
          Gerenciar Notícias
        </h1>

        <Link
          href="/admin/noticias/nova"
          className="inline-flex items-center gap-2 rounded-xl bg-[#43a548] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#39913e]"
        >
          <Plus size={18} />

          <span className="hidden sm:inline">
            Nova postagem
          </span>

          <span className="sm:hidden">
            Nova
          </span>
        </Link>
      </header>

      <section className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="border-b border-black/5 p-5">
            <label className="relative block max-w-xs">
              <span className="sr-only">
                Buscar postagens
              </span>

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#72ad99]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar postagens..."
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f8faf8] pl-11 pr-4 text-sm text-[#071a2b] outline-none transition focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-[#f8faf8]">
                <tr className="text-xs uppercase tracking-wide text-[#72ad99]">
                  <th className="px-5 py-4 font-semibold">
                    Título
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Categoria
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Autor
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Data
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12"
                    >
                      <div className="flex items-center justify-center gap-2 text-sm text-[#526866]">
                        <Loader2
                          size={18}
                          className="animate-spin text-[#27877d]"
                        />

                        Carregando notícias...
                      </div>
                    </td>
                  </tr>
                ) : filteredNews.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-[#526866]"
                    >
                      Nenhuma notícia encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-black/5 text-sm"
                    >
                      <td className="max-w-md px-5 py-4 font-medium text-[#071a2b]">
                        {item.title}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#e8f2f0] px-3 py-1 text-xs font-medium text-[#27877d]">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[#526866]">
                        {item.author}
                      </td>

                      <td className="px-5 py-4 text-[#526866]">
                        {item.date}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.status ===
                            "Publicado"
                              ? "bg-[#edf6ec] text-[#39913e]"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/noticias/${item.id}/editar`}
                            aria-label={`Editar ${item.title}`}
                            className="text-[#27877d] transition hover:text-[#1d625c]"
                          >
                            <Pencil
                              size={17}
                            />
                          </Link>

                          <Link
                            href={`/noticias/${item.slug}`}
                            target="_blank"
                            aria-label={`Visualizar ${item.title}`}
                            className="text-[#72ad99] transition hover:text-[#27877d]"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              item.id
                            }
                            onClick={() =>
                              void handleDelete(
                                item.id,
                              )
                            }
                            aria-label={`Excluir ${item.title}`}
                            className="text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId ===
                            item.id ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={17}
                              />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
  ).format(date);
}