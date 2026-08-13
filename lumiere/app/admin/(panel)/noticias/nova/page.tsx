"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  ImageUp,
  Save,
  Send,
} from "lucide-react";

export default function NewNewsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const action = submitter?.value;

    const status =
      action === "publish"
        ? "Publicado"
        : action === "draft"
          ? "Rascunho"
          : formData.get("status");

    try {
      setSaving(true);

      const response = await fetch("/api/noticias", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Não foi possível salvar a notícia.",
        );
      }

      router.push("/admin/noticias");
      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar notícia.",
      );
    } finally {
      setSaving(false);
    }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-[#f8faf8]"
    >
      <header className="flex flex-col gap-4 border-b border-black/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/noticias"
            className="inline-flex items-center gap-2 text-sm text-[#72ad99] transition hover:text-[#27877d]"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>

          <h1 className="text-xl font-bold text-[#071a2b]">
            Nova postagem
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              window.alert("A visualização prévia será adicionada depois.")
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 text-sm font-semibold text-[#526866] transition hover:bg-black/5"
          >
            <Eye size={17} />
            Visualizar prévia
          </button>

          <button
            type="submit"
            name="action"
            value="draft"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#e8f2f0] px-5 text-sm font-semibold text-[#27877d] transition hover:bg-[#dcebe7] disabled:opacity-50"
          >
            <Save size={17} />
            Salvar rascunho
          </button>

          <button
            type="submit"
            name="action"
            value="publish"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#43a548] px-5 text-sm font-semibold text-white transition hover:bg-[#39913e] disabled:opacity-50"
          >
            <Send size={17} />
            {saving ? "Salvando..." : "Publicar"}
          </button>
        </div>
      </header>

      <section className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <article className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="space-y-6">
              <FormField label="Título da postagem *">
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Digite o título..."
                  className={inputClass}
                />
              </FormField>

              <FormField label="Resumo">
                <textarea
                  name="summary"
                  required
                  rows={3}
                  placeholder="Breve resumo para aparecer na listagem..."
                  className={textareaClass}
                />
              </FormField>

              <FormField label="Conteúdo completo">
                <textarea
                  name="content"
                  required
                  rows={11}
                  placeholder="Escreva o conteúdo completo da postagem aqui..."
                  className={textareaClass}
                />
              </FormField>
            </div>
          </article>

          <article className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h2 className="font-bold text-[#071a2b]">
              Imagem de capa
            </h2>

            <label className="mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#27877d]/30 px-6 text-center transition hover:border-[#27877d] hover:bg-[#f8faf8]">
              <ImageUp
                size={34}
                strokeWidth={1.6}
                className="text-[#72ad99]"
              />

              <span className="mt-4 text-sm font-medium text-[#334b49]">
                Clique para fazer upload
              </span>

              <span className="mt-1 text-xs text-[#72ad99]">
                PNG, JPG ou WebP · máximo 5 MB
              </span>

              <span className="mt-4 rounded-xl bg-[#e8f2f0] px-5 py-3 text-xs font-semibold text-[#27877d]">
                Selecionar imagem
              </span>

              <input
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
              />
            </label>
          </article>
        </div>

        <aside>
          <article className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-[#071a2b]">
              Detalhes
            </h2>

            <div className="mt-6 space-y-5">
              <FormField label="Categoria">
                <select
                  name="category"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="Eventos">Eventos</option>
                  <option value="Visitas técnicas">
                    Visitas técnicas
                  </option>
                  <option value="Reuniões">Reuniões</option>
                  <option value="Extensão">Extensão</option>
                  <option value="Destaques">Destaques</option>
                </select>
              </FormField>

              <FormField label="Autor">
                <input
                  name="author"
                  type="text"
                  required
                  placeholder="Nome do autor"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Data de publicação">
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={getToday()}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Status">
                <select
                  name="status"
                  defaultValue="Rascunho"
                  className={inputClass}
                >
                  <option value="Rascunho">Rascunho</option>
                  <option value="Publicado">Publicado</option>
                </select>
              </FormField>
            </div>
          </article>
        </aside>
      </section>
    </form>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-[#071a2b] outline-none transition placeholder:text-gray-400 focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

const textareaClass =
  "w-full resize-y rounded-xl border border-black/15 bg-white px-4 py-3 text-sm leading-6 text-[#071a2b] outline-none transition placeholder:text-gray-400 focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
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

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}