"use client";

import type { FormEvent, ReactNode } from "react";
import { BookOpen, ExternalLink, Save, Star } from "lucide-react";
import type { PublicationPayload } from "@/types/publication";

interface PublicationFormProps {
  value: PublicationPayload;
  onChange: (value: PublicationPayload) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving?: boolean;
  error?: string;
  submitLabel?: string;
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8a9a99] transition focus:border-[#27877d] focus:ring-4 focus:ring-[#27877d]/10";

const textareaClass =
  "w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-[#071a2b] outline-none placeholder:text-[#8a9a99] transition focus:border-[#27877d] focus:ring-4 focus:ring-[#27877d]/10";

export default function PublicationForm({
  value,
  onChange,
  onSubmit,
  saving = false,
  error = "",
  submitLabel = "Salvar publicação",
}: PublicationFormProps) {
  function updateField<K extends keyof PublicationPayload>(
    field: K,
    fieldValue: PublicationPayload[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_330px]"
    >
      <section className="space-y-6 rounded-2xl border border-black/5 bg-white p-5 text-[#071a2b] shadow-[0_2px_12px_rgba(7,26,43,0.06)] sm:p-7">
        <div>
          <h2 className="text-lg font-semibold">Dados da publicação</h2>
          <p className="mt-1 text-sm text-[#607472]">
            Informações que serão exibidas no site público.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <Field label="Título">
          <input
            className={inputClass}
            value={value.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Título completo da publicação"
            required
          />
        </Field>

        <Field label="Autores">
          <input
            className={inputClass}
            value={value.authors}
            onChange={(event) => updateField("authors", event.target.value)}
            placeholder="Ex.: CORREIA, M.; SANTOS, A. B.; LIMA, C."
            required
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tipo">
            <select
              className={inputClass}
              value={value.type}
              onChange={(event) =>
                updateField(
                  "type",
                  event.target.value as PublicationPayload["type"],
                )
              }
              required
            >
              <option value="Artigo">Artigo</option>
              <option value="Evento">Evento</option>
              <option value="Relatório">Relatório</option>
              <option value="Resumo">Resumo</option>
              <option value="Livro">Livro</option>
              <option value="Capítulo">Capítulo</option>
              <option value="Outro">Outro</option>
            </select>
          </Field>

          <Field label="Ano">
            <input
              type="number"
              min="1900"
              max="2100"
              className={inputClass}
              value={value.year}
              onChange={(event) => updateField("year", event.target.value)}
              placeholder="2026"
              required
            />
          </Field>
        </div>

        <Field label="Evento / Periódico / Instituição">
          <input
            className={inputClass}
            value={value.venue}
            onChange={(event) => updateField("venue", event.target.value)}
            placeholder="Ex.: IEEE SmartCity Conference"
            required
          />
        </Field>

        <Field label="Resumo / Abstract">
          <textarea
            className={`${textareaClass} min-h-52`}
            value={value.abstract}
            onChange={(event) => updateField("abstract", event.target.value)}
            placeholder="Resumo opcional da publicação."
          />
        </Field>
      </section>

      <aside className="h-fit space-y-6 rounded-2xl border border-black/5 bg-white p-5 text-[#071a2b] shadow-[0_2px_12px_rgba(7,26,43,0.06)] sm:p-6 xl:sticky xl:top-6">
        <div>
          <h2 className="text-lg font-semibold">Publicação</h2>
          <p className="mt-1 text-sm text-[#607472]">
            Status, links acadêmicos e destaque.
          </p>
        </div>

        <Field label="Status">
          <select
            className={inputClass}
            value={value.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as PublicationPayload["status"],
              )
            }
          >
            <option value="Publicado">Publicado</option>
            <option value="Rascunho">Rascunho</option>
          </select>
        </Field>

        <Field label="DOI">
          <div className="relative">
            <BookOpen
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8e8c]"
            />
            <input
              className={`${inputClass} pl-11`}
              value={value.doi}
              onChange={(event) => updateField("doi", event.target.value)}
              placeholder="10.xxxx/xxxxx"
            />
          </div>
        </Field>

        <Field label="Link externo">
          <div className="relative">
            <ExternalLink
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8e8c]"
            />
            <input
              type="url"
              className={`${inputClass} pl-11`}
              value={value.url}
              onChange={(event) => updateField("url", event.target.value)}
              placeholder="https://..."
            />
          </div>
        </Field>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-black/10 bg-[#f8faf8] px-4 py-3">
          <span className="flex items-center gap-3 text-sm font-medium">
            <Star size={17} className="text-[#27877d]" />
            Destacar no site
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-[#071a2b]">
      <span className="mb-2 block text-sm font-medium text-[#334b49]">
        {label}
      </span>
      {children}
    </label>
  );
}
