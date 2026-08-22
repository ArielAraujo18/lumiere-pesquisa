"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  Project,
  ProjectStatus,
} from "@/types/project";

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const contentType =
    response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();

    throw new Error(
      `HTTP ${response.status}: ${text.slice(0, 120)}`,
    );
  }

  const data = (await response.json()) as T & {
    error?: string;
    details?: string;
  };

  if (!response.ok) {
    throw new Error(
      data.details ??
        data.error ??
        "Erro inesperado.",
    );
  }

  return data;
}

const statusClasses: Record<ProjectStatus, string> = {
  Planejado:
    "bg-[#e8f2ef] text-[#486c66]",
  "Em andamento":
    "bg-[#e8f4e8] text-[#26723a]",
  Concluído:
    "bg-[#e5f3f2] text-[#14766f]",
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const data =
        await parseResponse<Project[]>(
          await fetch("/api/projetos", {
            cache: "no-store",
          }),
        );

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
    const term =
      search.trim().toLowerCase();

    if (!term) {
      return projects;
    }

    return projects.filter((project) =>
      [
        project.title,
        project.area,
        project.responsible,
        project.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [projects, search]);

  async function deleteProject(
    project: Project,
  ) {
    const confirmed = window.confirm(
      `Excluir o projeto "${project.title}"? Esta ação não poderá ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(project.id);
      setError("");

      await parseResponse<{ success: boolean }>(
        await fetch(
          `/api/projetos/${project.id}`,
          {
            method: "DELETE",
          },
        ),
      );

      setProjects((current) =>
        current.filter(
          (item) => item.id !== project.id,
        ),
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
          <h1 className="text-xl font-bold tracking-tight">
            Gerenciar Projetos
          </h1>

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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar projetos..."
                className="h-11 w-full rounded-xl border border-black/10 bg-[#f8faf8] pl-11 pr-4 text-sm outline-none focus:border-[#27877d]"
              />
            </div>

            <span className="text-sm text-[#667a77]">
              {filteredProjects.length} projeto(s)
            </span>
          </div>

          {error && (
            <div className="m-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} />

              <div>
                <p>{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    void loadProjects()
                  }
                  className="mt-2 font-semibold underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#667a77]">
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
              Carregando projetos...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-[#667a77]">
              Nenhum projeto encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-[#f4f7f4] text-xs font-semibold uppercase text-[#67a68d]">
                  <tr>
                    <th className="px-5 py-4">
                      Nome do projeto
                    </th>

                    <th className="px-5 py-4">
                      Área
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Responsável
                    </th>

                    <th className="px-5 py-4">
                      Criado em
                    </th>

                    <th className="px-5 py-4 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map(
                    (project) => (
                      <tr
                        key={project.id}
                        className="border-t border-black/5 text-sm hover:bg-[#fbfcfb]"
                      >
                        <td className="px-5 py-4 font-semibold">
                          {project.title}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#e8f2f0] px-3 py-1 text-xs text-[#27877d]">
                            {project.area}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${statusClasses[project.status]}`}
                          >
                            {project.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {project.responsible}
                        </td>

                        <td className="px-5 py-4">
                          {formatDate(
                            project.createdAt,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/admin/projetos/${project.id}/editar`}
                              title="Editar"
                              className="rounded-lg p-2 text-[#27877d] hover:bg-[#edf7f4]"
                            >
                              <Pencil size={17} />
                            </Link>

                            <Link
                              href={`/admin/projetos/${project.id}`}
                              title="Visualizar"
                              className="rounded-lg p-2 text-[#27877d] hover:bg-[#edf7f4]"
                            >
                              <Eye size={17} />
                            </Link>

                            <button
                              type="button"
                              title="Excluir"
                              disabled={
                                deletingId ===
                                project.id
                              }
                              onClick={() =>
                                void deleteProject(
                                  project,
                                )
                              }
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId ===
                              project.id ? (
                                <LoaderCircle
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
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(
        "pt-BR",
      ).format(date);
}