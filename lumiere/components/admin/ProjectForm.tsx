"use client";

import { ImageIcon, Save, Star } from "lucide-react";
import type { ProjectPayload } from "@/types/project";

interface ProjectFormProps {
  value: ProjectPayload;
  onChange: (value: ProjectPayload) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  submitLabel: string;
  error?: string;
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8a9a99] transition focus:border-[#27877d] focus:ring-4 focus:ring-[#27877d]/10";

const textareaClass =
  "w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-[#071a2b] outline-none placeholder:text-[#8a9a99] transition focus:border-[#27877d] focus:ring-4 focus:ring-[#27877d]/10";

export default function ProjectForm({
  value,
  onChange,
  onSubmit,
  saving,
  submitLabel,
  error,
}: ProjectFormProps) {
  function updateField<K extends keyof ProjectPayload>(
    field: K,
    fieldValue: ProjectPayload[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <section className="space-y-6 rounded-2xl border border-black/5 bg-white p-5 text-[#071a2b] shadow-[0_2px_12px_rgba(7,26,43,0.06)] sm:p-7">
        <div>
          <h2 className="text-lg font-semibold">Informações do projeto</h2>
          <p className="mt-1 text-sm text-[#607472]">
            Preencha os dados que serão usados no painel e no site público.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <Field label="Nome do projeto">
          <input
            className={inputClass}
            value={value.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Ex.: Monitoramento inteligente de ambientes urbanos"
            required
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Área">
            <input
              className={inputClass}
              value={value.area}
              onChange={(event) => updateField("area", event.target.value)}
              placeholder="Ex.: IoT, Dados, Sustentabilidade"
              required
            />
          </Field>

          <Field label="Responsável">
            <input
              className={inputClass}
              value={value.responsible}
              onChange={(event) =>
                updateField("responsible", event.target.value)
              }
              placeholder="Ex.: Prof. Marcílio Correia"
              required
            />
          </Field>
        </div>

        <Field label="Resumo">
          <textarea
            className={`${textareaClass} min-h-28`}
            value={value.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            placeholder="Descrição curta exibida nos cards do site."
            maxLength={300}
            required
          />
          <p className="mt-2 text-right text-xs text-[#7a8e8c]">
            {value.summary.length}/300
          </p>
        </Field>

        <Field label="Descrição completa">
          <textarea
            className={`${textareaClass} min-h-64`}
            value={value.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Detalhe objetivos, metodologia, resultados e participantes."
            required
          />
        </Field>
      </section>

      <aside className="h-fit space-y-6 rounded-2xl border border-black/5 bg-white p-5 text-[#071a2b] shadow-[0_2px_12px_rgba(7,26,43,0.06)] sm:p-6 xl:sticky xl:top-6">
        <div>
          <h2 className="text-lg font-semibold">Publicação</h2>
          <p className="mt-1 text-sm text-[#607472]">
            Defina status, período e destaque.
          </p>
        </div>

        <Field label="Status">
          <select
            className={inputClass}
            value={value.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as ProjectPayload["status"],
              )
            }
          >
            <option value="Planejado">Planejado</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
          </select>
        </Field>

        <Field label="Data de início">
          <input
            type="date"
            className={inputClass}
            value={value.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
            required
          />
        </Field>

        <Field label="Data de término">
          <input
            type="date"
            className={inputClass}
            value={value.endDate}
            onChange={(event) => updateField("endDate", event.target.value)}
          />
        </Field>

        <Field label="URL da imagem">
          <div className="relative">
            <ImageIcon
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8e8c]"
            />
            <input
              type="url"
              className={`${inputClass} pl-11`}
              value={value.imageUrl}
              onChange={(event) => updateField("imageUrl", event.target.value)}
              placeholder="https://..."
            />
          </div>
        </Field>

        {value.imageUrl ? (
          <div className="overflow-hidden rounded-xl border border-black/10 bg-[#f3f7f5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.imageUrl}
              alt="Prévia da imagem do projeto"
              className="h-36 w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : null}

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-black/10 bg-[#f8faf8] px-4 py-3">
          <span className="flex items-center gap-3 text-sm font-medium">
            <Star size={17} className="text-[#27877d]" />
            Projeto em destaque
          </span>
          <input
            type="checkbox"
            checked={value.featured}
            onChange={(event) => updateField("featured", event.target.checked)}
            className="h-4 w-4 accent-[#27877d]"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2f9b45] px-5 text-sm font-semibold text-white transition hover:bg-[#27863b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? "Salvando..." : submitLabel}
        </button>
      </aside>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[#071a2b]">
      <span className="mb-2 block text-sm font-medium text-[#334b49]">
        {label}
      </span>
      {children}
    </label>
  );
}
