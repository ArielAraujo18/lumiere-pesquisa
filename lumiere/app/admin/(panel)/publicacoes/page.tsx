"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Eye,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type {
  Publication,
  PublicationStatus,
  PublicationType,
} from "@/types/publication";

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 120)}`);
  }

  const data = (await response.json()) as T & {
    error?: string;
    details?: string;
  };

  if (!response.ok) {
    throw new Error(data.details ?? data.error ?? "Erro inesperado.");
  }

  return data;
}

const statusClasses: Record<PublicationStatus, string> = {
  Publicado: "bg-[#e8f4e8] text-[#2f9b45]",
  Rascunho: "bg-[#f2f3f2] text-[#607472]",
};

const typeClasses: Record<PublicationType, string> = {
  Artigo: "bg-[#e8f2f0] text-[#27877d]",
  Evento: "bg-[#e8f2f0] text-[#27877d]",
  Relatório: "bg-[#e8f2f0] text-[#27877d]",
  Resumo: "bg-[#e8f2f0] text-[#27877d]",
  Livro: "bg-[#e8f2f0] text-[#27877d]",
  Capítulo: "bg-[#e8f2f0] text-[#27877d]",
  Outro: "bg-[#e8f2f0] text-[#27877d]",
};

export default function PublicationsAdminPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadPublications = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await parseResponse<Publication[]>(
        await fetch("/api/publicacoes", { cache: "no-store" }),
      );
      setPublications(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as publicações.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPublications();
  }, [loadPublications]);

  const filteredPublications = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return publications;

    return publications.filter((publication) =>
      [
        publication.title,
        publication.authors,
        publication.year,
        publication.type,
        publication.venue,
        publication.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [publications, search]);

  async function deletePublication(publication: Publication) {
    const confirmed = window.confirm(
      `Excluir a publicação “${publication.title}”? Esta ação não poderá ser desfeita.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(publication.id);
      setError("");
      await parseResponse<{ success: boolean }>(
        await fetch(`/api/publicacoes/${publication.id}`, {
          method: "DELETE",
        }),
      );
      setPublications((current) =>
        current.filter((item) => item.id !== publication.id),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Não foi possível excluir a publicação.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex flex-col gap-4 border-b border-black/5 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Gerenciar Publicações
          </h1>
          <p className="mt-1 text-sm text-[#667a77]">
            Cadastre e organize a produção científica do grupo.
          </p>
        </div>

        <Link
          href="/admin/publicacoes/nova"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2f9b45] px-5 text-sm font-semibold text-white transition hover:bg-[#27863b]"
        >
          <Plus size={18} />
          Nova publicação
        </Link>
      </header>

      <section className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_12px_rgba(7,26,43,0.06)]">
          <div className="flex flex-col gap-4 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6f928d]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar publicações..."
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f8faf8] pl-11 pr-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-4 focus:ring-[#27877d]/10"
              />
            </div>

            <span className="text-sm text-[#667a77]">
              {filteredPublications.length} publicação(ões)
            </span>
          </div>

          {error ? (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void loadPublications()}
                  className="mt-2 font-semibold underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#667a77]">
              <LoaderCircle size={20} className="animate-spin" />
              Carregando publicações...
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <p className="font-medium text-[#334b49]">
                Nenhuma publicação encontrada.
              </p>
              <p className="mt-1 text-sm text-[#7a8e8c]">
                Cadastre a primeira publicação ou altere sua busca.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-[#f4f7f4] text-xs font-semibold uppercase tracking-wide text-[#67a68d]">
                    <tr>
                      <th className="px-5 py-4">Título</th>
                      <th className="px-5 py-4">Autores</th>
                      <th className="px-5 py-4">Ano</th>
                      <th className="px-5 py-4">Tipo</th>
                      <th className="px-5 py-4">Evento / Periódico</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPublications.map((publication) => (
                      <tr
                        key={publication.id}
                        className="border-t border-black/5 text-sm transition hover:bg-[#fbfcfb]"
                      >
                        <td className="max-w-[300px] px-5 py-4 font-semibold text-[#071a2b]">
                          <span className="block truncate" title={publication.title}>
                            {publication.title}
                          </span>
                        </td>
                        <td className="max-w-[240px] px-5 py-4 text-[#536965]">
                          <span className="block truncate" title={publication.authors}>
                            {publication.authors}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#536965]">
                          {publication.year}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${typeClasses[publication.type]}`}
                          >
                            {publication.type}
                          </span>
                        </td>
                        <td className="max-w-[250px] px-5 py-4 text-[#536965]">
                          <span className="block truncate" title={publication.venue}>
                            {publication.venue}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses[publication.status]}`}
                          >
                            {publication.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <ActionLink
                              href={`/admin/publicacoes/${publication.id}/editar`}
                              label="Editar"
                            >
                              <Pencil size={17} />
                            </ActionLink>
                            <ActionLink
                              href={`/admin/publicacoes/${publication.id}`}
                              label="Visualizar"
                            >
                              <Eye size={17} />
                            </ActionLink>
                            <button
                              type="button"
                              aria-label="Excluir"
                              title="Excluir"
                              onClick={() => void deletePublication(publication)}
                              disabled={deletingId === publication.id}
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === publication.id ? (
                                <LoaderCircle size={17} className="animate-spin" />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-black/5 lg:hidden">
                {filteredPublications.map((publication) => (
                  <article key={publication.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-[#071a2b]">
                          {publication.title}
                        </h2>
                        <p className="mt-1 text-sm text-[#607472]">
                          {publication.authors}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusClasses[publication.status]}`}
                      >
                        {publication.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-[#e8f2f0] px-3 py-1 text-[#27877d]">
                        {publication.type}
                      </span>
                      <span className="rounded-full bg-[#f2f4f3] px-3 py-1 text-[#536965]">
                        {publication.year}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-[#536965]">
                      {publication.venue}
                    </p>

                    <div className="mt-4 flex justify-end gap-1">
                      <ActionLink
                        href={`/admin/publicacoes/${publication.id}/editar`}
                        label="Editar"
                      >
                        <Pencil size={17} />
                      </ActionLink>
                      <ActionLink
                        href={`/admin/publicacoes/${publication.id}`}
                        label="Visualizar"
                      >
                        <Eye size={17} />
                      </ActionLink>
                      <button
                        type="button"
                        onClick={() => void deletePublication(publication)}
                        disabled={deletingId === publication.id}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        aria-label="Excluir"
                      >
                        {deletingId === publication.id ? (
                          <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function ActionLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-[#27877d] transition hover:bg-[#eaf5f2]"
    >
      {children}
    </Link>
  );
}
