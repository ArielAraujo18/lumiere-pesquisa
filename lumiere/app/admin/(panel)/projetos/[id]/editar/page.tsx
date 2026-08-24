"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import ProjectForm from "@/components/admin/ProjectForm";
import type {
  Project,
  ProjectPayload,
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

function toDateInput(
  value?: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().slice(0, 10);
}

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] =
    useState<ProjectPayload | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const data =
          await parseResponse<Project>(
            await fetch(
              `/api/projetos/${params.id}`,
              {
                cache: "no-store",
              },
            ),
          );

        setProject({
          title: data.title ?? "",
          area: data.area ?? "",
          status: data.status ?? "Planejado",

          responsible:
            data.responsible ?? "",

          summary: data.summary ?? "",

          description:
            data.description ?? "",

          startDate: toDateInput(
            data.startDate,
          ),

          endDate: toDateInput(
            data.endDate,
          ),

          imageUrl:
            data.imageUrl ?? "",

          featured:
            Boolean(data.featured),

          // Membros vinculados ao projeto
          memberIds:
            Array.isArray(data.memberIds)
              ? data.memberIds
              : [],
        });
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!project) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await parseResponse(
        await fetch(
          `/api/projetos/${params.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(project),
          },
        ),
      );

      router.push("/admin/projetos");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível atualizar o projeto.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center gap-3 bg-[#f7f9f7] text-sm text-[#667a77]">
        <LoaderCircle
          size={20}
          className="animate-spin"
        />

        Carregando projeto...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f7f9f7] p-8 text-[#071a2b]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error ||
            "Projeto não encontrado."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] p-5 text-[#071a2b] sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/admin/projetos"
            aria-label="Voltar"
            className="rounded-xl border border-black/10 bg-white p-3 text-[#27877d] transition hover:bg-[#edf7f4]"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Editar projeto
            </h1>

            <p className="mt-1 text-sm text-[#667a77]">
              Atualize as informações do projeto.
            </p>
          </div>
        </div>

        <ProjectForm
          value={project}
          onChange={setProject}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Salvar alterações"
          error={error}
        />
      </div>
    </main>
  );
}