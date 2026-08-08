"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Eye,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { Project, ProjectStatus } from "@/types/project";

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

const statusClasses: Record<ProjectStatus, string> = {
  Planejado: "bg-[#e8f2ef] text-[#486c66]",
  "Em andamento": "bg-[#e8f4e8] text-[#26723a]",
  Concluído: "bg-[#e5f3f2] text-[#14766f]",
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await parseResponse<Project[]>(await fetch("/api/projetos"));
      setProjects(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar os projetos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return projects;

    return projects.filter((project) =>
      [project.title, project.area, project.responsible, project.status]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [projects, search]);

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Excluir o projeto “${project.title}”? Esta ação não poderá ser desfeita.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(project.id);
      setError("");
      await parseResponse<{ success: boolean }>(
        await fetch(`/api/projetos/${project.id}`, { method: "DELETE" }),
      );
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Não foi possível excluir o projeto.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex flex-col gap-4 border-b border-black/5 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Gerenciar Projetos</h1>
          <p className="mt-1 text-sm text-[#667a77]">
            Cadastre, edite e acompanhe os projetos do grupo.
          </p>
        </div>

        <Link
          href="/admin/projetos/novo"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2f9b45] px-5 text-sm font-semibold text-white transition hover:bg-[#27863b]"
        >
          <Plus size={18} />
          Novo projeto
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
                placeholder="Buscar projetos..."
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f8faf8] pl-11 pr-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-4 focus:ring-[#27877d]/10"
              />
            </div>

            <span className="text-sm text-[#667a77]">
              {filteredProjects.length} projeto(s)
            </span>
          </div>

          {error ? (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void loadProjects()}
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
              Carregando projetos...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <p className="font-medium text-[#334b49]">
                Nenhum projeto encontrado.
              </p>
              <p className="mt-1 text-sm text-[#7a8e8c]">
                Cadastre o primeiro projeto ou altere sua busca.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-[#f4f7f4] text-xs font-semibold uppercase tracking-wide text-[#67a68d]">
                    <tr>
                      <th className="px-5 py-4">Nome do projeto</th>
                      <th className="px-5 py-4">Área</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Responsável</th>
                      <th className="px-5 py-4">Criado em</th>
                      <th className="px-5 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-t border-black/5 text-sm transition hover:bg-[#fbfcfb]"
                      >
                        <td className="max-w-md px-5 py-4 font-semibold text-[#071a2b]">
                          {project.title}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#e8f2f0] px-3 py-1 text-xs font-medium text-[#27877d]">
                            {project.area}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusClasses[project.status]}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {project.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#536965]">
                          {project.responsible}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-[#536965]">
                          {formatDate(project.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <ActionLink
                              href={`/admin/projetos/${project.id}/editar`}
                              label="Editar"
                            >
                              <Pencil size={17} />
                            </ActionLink>
                            <ActionLink
                              href={`/admin/projetos/${project.id}`}
                              label="Visualizar"
                            >
                              <Eye size={17} />
                            </ActionLink>
                            <button
                              type="button"
                              aria-label="Excluir"
                              title="Excluir"
                              onClick={() => void deleteProject(project)}
                              disabled={deletingId === project.id}
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === project.id ? (
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

              <div className="divide-y divide-black/5 md:hidden">
                {filteredProjects.map((project) => (
                  <article key={project.id} className="space-y-4 p-5">
                    <div>
                      <h2 className="font-semibold text-[#071a2b]">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#667a77]">
                        {project.responsible}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#e8f2f0] px-3 py-1 text-xs font-medium text-[#27877d]">
                        {project.area}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[project.status]}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#7a8e8c]">
                        {formatDate(project.createdAt)}
                      </span>
                      <div className="flex gap-1">
                        <ActionLink
                          href={`/admin/projetos/${project.id}/editar`}
                          label="Editar"
                        >
                          <Pencil size={17} />
                        </ActionLink>
                        <ActionLink
                          href={`/admin/projetos/${project.id}`}
                          label="Visualizar"
                        >
                          <Eye size={17} />
                        </ActionLink>
                        <button
                          type="button"
                          aria-label="Excluir"
                          onClick={() => void deleteProject(project)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
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
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-[#27877d] transition hover:bg-[#edf7f4]"
    >
      {children}
    </Link>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR").format(date);
}
