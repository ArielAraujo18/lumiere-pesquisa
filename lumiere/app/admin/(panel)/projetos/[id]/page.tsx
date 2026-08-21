"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  LoaderCircle,
  Pencil,
  Star,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Project, ProjectStatus } from "@/types/project";

const statusClasses: Record<ProjectStatus, string> = {
  Planejado: "bg-[#e8f2ef] text-[#486c66]",
  "Em andamento": "bg-[#e8f4e8] text-[#26723a]",
  Concluído: "bg-[#e5f3f2] text-[#14766f]",
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details ?? data.error ?? "Erro inesperado.");
  }

  return data;
}

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        setError("");
        setProject(
          await parseResponse<Project>(
            await fetch(`/api/projetos/${params.id}`),
          ),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar o projeto.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProject();
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center gap-3 bg-[#f7f9f7] text-sm text-[#667a77]">
        <LoaderCircle size={20} className="animate-spin" />
        Carregando projeto...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f7f9f7] p-8 text-[#071a2b]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error || "Projeto não encontrado."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] p-5 text-[#071a2b] sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/projetos"
              aria-label="Voltar"
              className="rounded-xl border border-black/10 bg-white p-3 text-[#27877d] transition hover:bg-[#edf7f4]"
            >
              <ArrowLeft size={19} />
            </Link>
            <div>
              <p className="text-sm font-medium text-[#27877d]">Projeto</p>
              <h1 className="text-2xl font-bold tracking-tight">
                {project.title}
              </h1>
            </div>
          </div>

          <Link
            href={`/admin/projetos/${project.id}/editar`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2f9b45] px-5 text-sm font-semibold text-white hover:bg-[#27863b]"
          >
            <Pencil size={17} />
            Editar projeto
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_12px_rgba(7,26,43,0.06)]">
            {project.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-64 w-full object-cover"
              />
            ) : null}

            <div className="space-y-7 p-6 sm:p-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#67a68d]">
                  Resumo
                </h2>
                <p className="mt-3 leading-7 text-[#334b49]">
                  {project.summary}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#67a68d]">
                  Descrição completa
                </h2>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-[#334b49]">
                  {project.description}
                </p>
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_12px_rgba(7,26,43,0.06)]">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses[project.status]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {project.status}
            </span>

            <Info label="Área" value={project.area} />

            <Info
              icon={<UserRound size={17} />}
              label="Responsável"
              value={project.responsible}
            />

            <Info
              icon={<CalendarDays size={17} />}
              label="Período"
              value={`${formatDate(project.startDate)}${
                project.endDate ? ` até ${formatDate(project.endDate)}` : ""
              }`}
            />

            {project.featured ? (
              <div className="flex items-center gap-2 rounded-xl bg-[#fff8df] px-4 py-3 text-sm font-medium text-[#8a6b13]">
                <Star size={17} />
                Projeto em destaque
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-black/5 pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#7a8e8c]">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-[#334b49]">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR").format(date);
}
