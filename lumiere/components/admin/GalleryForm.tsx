"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, Link2, UploadCloud, X } from "lucide-react";
import type { GalleryPayload } from "@/types/gallery";

type Props = {
  value: GalleryPayload;
  onChange: (value: GalleryPayload) => void;
  disabled?: boolean;
  compact?: boolean;
};

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#071a2b] outline-none transition placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

const textareaClass =
  "min-h-28 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-[#071a2b] outline-none transition placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

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

export default function GalleryForm({
  value,
  onChange,
  disabled = false,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");

  function update(
    field: keyof GalleryPayload,
    nextValue: string | number,
  ) {
    onChange({
      ...value,
      [field]: nextValue,
    });
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");

    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setFileError("Use uma imagem JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update("imageUrl", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className={compact ? "space-y-5" : "grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"}>
      <section className="space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-base font-semibold text-[#071a2b]">
            Imagem
          </h2>
          <p className="mt-1 text-xs text-[#7b8b89]">
            JPG, PNG ou WEBP com até 5 MB.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={disabled}
          className="hidden"
        />

        {value.imageUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-[#eef4f3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.imageUrl}
              alt={value.title || "Prévia da foto"}
              className="h-56 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => update("imageUrl", "")}
              disabled={disabled}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur hover:bg-black/75"
              aria-label="Remover imagem"
            >
              <X size={17} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#b5d5d1] bg-[#fbfdfc] px-5 text-center transition hover:border-[#27877d] hover:bg-[#f5faf9] disabled:opacity-60"
          >
            <UploadCloud size={34} className="text-[#6dac9f]" />
            <span className="mt-3 text-sm font-medium text-[#334b49]">
              Clique para selecionar uma foto
            </span>
            <span className="mt-1 text-xs text-[#83a09d]">
              JPG, PNG ou WEBP · máx. 5 MB
            </span>
          </button>
        )}

        {fileError && (
          <p className="text-sm text-red-600">{fileError}</p>
        )}

        <Field label="Ou cole a URL da imagem">
          <div className="relative">
            <Link2
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
            />
            <input
              disabled={disabled}
              value={value.imageUrl.startsWith("data:") ? "" : value.imageUrl}
              onChange={(event) => update("imageUrl", event.target.value)}
              placeholder="https://..."
              className={`${inputClass} pl-11`}
            />
          </div>
        </Field>
      </section>

      <section className="space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-base font-semibold text-[#071a2b]">
            Informações
          </h2>
          <p className="mt-1 text-xs text-[#7b8b89]">
            Dados exibidos na galeria pública.
          </p>
        </div>

        <Field label="Título da foto">
          <input
            required
            disabled={disabled}
            value={value.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="Ex.: Reunião de equipe"
            className={inputClass}
          />
        </Field>

        <Field label="Categoria">
          <select
            disabled={disabled}
            value={value.category}
            onChange={(event) => update("category", event.target.value)}
            className={inputClass}
          >
            <option>Equipe</option>
            <option>Projetos</option>
            <option>Eventos</option>
            <option>Extensão</option>
            <option>Visitas técnicas</option>
            <option>Pesquisa</option>
            <option>Outros</option>
          </select>
        </Field>

        <Field label="Descrição curta">
          <textarea
            disabled={disabled}
            value={value.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Contexto da foto..."
            className={textareaClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select
              disabled={disabled}
              value={value.status}
              onChange={(event) =>
                update("status", event.target.value as GalleryPayload["status"])
              }
              className={inputClass}
            >
              <option>Publicado</option>
              <option>Rascunho</option>
            </select>
          </Field>

          <Field label="Ordem">
            <input
              type="number"
              min="0"
              disabled={disabled}
              value={value.order}
              onChange={(event) =>
                update("order", Number(event.target.value || 0))
              }
              className={inputClass}
            />
          </Field>
        </div>
      </section>
    </div>
  );
}
