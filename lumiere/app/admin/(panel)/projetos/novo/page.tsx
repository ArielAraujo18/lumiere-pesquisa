"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import type { ProjectPayload } from "@/types/project";

const initialProject: ProjectPayload = {
  title: "",
  area: "",
  status: "Planejado",
  responsible: "",
  summary: "",
  description: "",
  startDate: "",
  endDate: "",
  imageUrl: "",
  featured: false,
};

async function parseResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details ?? data.error ?? "Erro inesperado.");
  }

  return data;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [project, setProject] = useState<ProjectPayload>(initialProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await parseResponse(
        await fetch("/api/projetos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(project),
        }),
      );

      router.push("/admin/projetos");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível criar o projeto.",
      );
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-2xl font-bold tracking-tight">Novo projeto</h1>
            <p className="mt-1 text-sm text-[#667a77]">
              Cadastre um novo projeto do Grupo Lumière.
            </p>
          </div>
        </div>

        <ProjectForm
          value={project}
          onChange={setProject}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Criar projeto"
          error={error}
        />
      </div>
    </main>
  );
}
