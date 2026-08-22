"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageUp, Save, Star } from "lucide-react";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type {
  ProjectPayload,
  ProjectStatus,
} from "@/types/project";

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
  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Resposta inválida da API:", text);

    throw new Error(
      `A API retornou uma resposta inválida. HTTP ${response.status}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      data.details ?? data.error ?? "Erro inesperado.",
    );
  }

  return data;
}

export default function NewProjectPage() {
  const router = useRouter();

  const [project, setProject] =
    useState<ProjectPayload>(initialProject);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ProjectPayload>(
    field: K,
    value: ProjectPayload[K],
  ) {
    setProject((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("A imagem deve ser JPG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.set("title", project.title);
      formData.set("area", project.area);
      formData.set("status", project.status);
      formData.set("responsible", project.responsible);
      formData.set("summary", project.summary);
      formData.set("description", project.description);
      formData.set("startDate", project.startDate);
      formData.set("endDate", project.endDate ?? "");
      formData.set(
        "featured",
        project.featured ? "true" : "false",
      );

      if (image) {
        formData.set("image", image);
      }

      await parseResponse(
        await fetch("/api/projetos", {
          method: "POST",
          body: formData,
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
            <h1 className="text-2xl font-bold tracking-tight">
              Novo projeto
            </h1>

            <p className="mt-1 text-sm text-[#667a77]">
              Cadastre um novo projeto do Grupo Lumière.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_12px_rgba(7,26,43,0.06)]">
            <h2 className="text-lg font-bold">
              Informações do projeto
            </h2>

            <p className="mt-1 text-sm text-[#667a77]">
              Preencha os dados que serão usados no painel e no
              site público.
            </p>

            <div className="mt-7 space-y-6">
              <Field label="Nome do projeto">
                <input
                  required
                  value={project.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  className={inputClass}
                  placeholder="Ex.: Monitoramento Inteligente de Ambientes Urbanos"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Área">
                  <input
                    required
                    value={project.area}
                    onChange={(event) =>
                      updateField("area", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Ex.: IoT"
                  />
                </Field>

                <Field label="Responsável">
                  <input
                    required
                    value={project.responsible}
                    onChange={(event) =>
                      updateField(
                        "responsible",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                    placeholder="Ex.: Prof. Marcílio Correia"
                  />
                </Field>
              </div>

              <Field label="Resumo">
                <textarea
                  required
                  maxLength={300}
                  rows={4}
                  value={project.summary}
                  onChange={(event) =>
                    updateField("summary", event.target.value)
                  }
                  className={textareaClass}
                  placeholder="Breve resumo do projeto..."
                />

                <p className="mt-1 text-right text-xs text-[#7a8e8c]">
                  {project.summary.length}/300
                </p>
              </Field>

              <Field label="Descrição completa">
                <textarea
                  required
                  rows={9}
                  value={project.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  className={textareaClass}
                  placeholder="Descreva objetivos, metodologia e resultados esperados..."
                />
              </Field>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_12px_rgba(7,26,43,0.06)]">
            <h2 className="text-lg font-bold">Publicação</h2>

            <p className="mt-1 text-sm text-[#667a77]">
              Defina status, período, imagem e destaque.
            </p>

            <div className="mt-6 space-y-5">
              <Field label="Status">
                <select
                  value={project.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as ProjectStatus,
                    )
                  }
                  className={inputClass}
                >
                  <option value="Planejado">Planejado</option>
                  <option value="Em andamento">
                    Em andamento
                  </option>
                  <option value="Concluído">Concluído</option>
                </select>
              </Field>

              <Field label="Data de início">
                <input
                  required
                  type="date"
                  value={project.startDate}
                  onChange={(event) =>
                    updateField(
                      "startDate",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Data de término">
                <input
                  type="date"
                  value={project.endDate ?? ""}
                  onChange={(event) =>
                    updateField(
                      "endDate",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                />
              </Field>

              <div>
                <span className="mb-2 block text-sm font-medium text-[#334b49]">
                  Imagem do projeto
                </span>

                <label className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#27877d]/30 p-3 text-center transition hover:border-[#27877d]">
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-lg">
                      <Image
                        src={imagePreview}
                        alt="Prévia da imagem"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-32 flex-col items-center justify-center">
                      <ImageUp
                        size={30}
                        className="text-[#72ad99]"
                      />

                      <span className="mt-3 text-sm font-medium text-[#334b49]">
                        Selecionar imagem
                      </span>

                      <span className="mt-1 text-xs text-[#72ad99]">
                        PNG, JPG ou WebP · máx. 5 MB
                      </span>
                    </div>
                  )}

                  {image && (
                    <span className="mt-3 max-w-full truncate text-xs text-[#526866]">
                      {image.name}
                    </span>
                  )}

                  {imagePreview && (
                    <span className="mt-2 text-xs font-semibold text-[#27877d]">
                      Trocar imagem
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Star
                    size={18}
                    className="text-[#27877d]"
                  />
                  <span className="text-sm font-medium">
                    Projeto em destaque
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={project.featured}
                  onChange={(event) =>
                    updateField(
                      "featured",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-[#27877d]"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#28a745] text-sm font-semibold text-white transition hover:bg-[#218838] disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Criando..." : "Criar projeto"}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

const textareaClass =
  "w-full resize-y rounded-xl border border-black/15 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#334b49]">
        {label}
      </span>

      {children}
    </label>
  );
}