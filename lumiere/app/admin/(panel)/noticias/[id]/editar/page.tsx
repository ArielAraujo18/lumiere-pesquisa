"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

type News = {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  status: "Publicado" | "Rascunho";
};

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await fetch(`/api/noticias/${params.id}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error);
        }

        setNews(result);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Erro ao carregar notícia.",
        );

        router.push("/admin/noticias");
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [params.id, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      setSaving(true);

      const response = await fetch(`/api/noticias/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          summary: formData.get("summary"),
          content: formData.get("content"),
          category: formData.get("category"),
          author: formData.get("author"),
          date: formData.get("date"),
          status: formData.get("status"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      router.push("/admin/noticias");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar notícia.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="p-8">Carregando...</main>;
  }

  if (!news) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] text-[#071a2b]">   
      <header className="flex items-center gap-4 border-b bg-white px-8 py-5">
        <Link href="/admin/noticias">
          <ArrowLeft size={20} />
        </Link>

        <h1 className="text-xl font-bold">Editar notícia</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 p-8 xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow">
          <Field label="Título">
            <input
              name="title"
              required
              defaultValue={news.title}
              className={inputClass}
            />
          </Field>

          <Field label="Resumo">
            <textarea
              name="summary"
              required
              rows={4}
              defaultValue={news.summary}
              className={textareaClass}
            />
          </Field>

          <Field label="Conteúdo completo">
            <textarea
              name="content"
              required
              rows={12}
              defaultValue={news.content}
              className={textareaClass}
            />
          </Field>
        </section>

        <aside className="h-fit space-y-5 rounded-2xl bg-white p-6 shadow">
          <h2 className="font-bold">Detalhes</h2>

          <Field label="Categoria">
            <select
              name="category"
              defaultValue={news.category}
              className={inputClass}
            >
              <option>Eventos</option>
              <option>Visitas técnicas</option>
              <option>Reuniões</option>
              <option>Extensão</option>
              <option>Destaques</option>
            </select>
          </Field>

          <Field label="Autor">
            <input
              name="author"
              required
              defaultValue={news.author}
              className={inputClass}
            />
          </Field>

          <Field label="Data">
            <input
              name="date"
              type="date"
              required
              defaultValue={news.publishedAt.slice(0, 10)}
              className={inputClass}
            />
          </Field>

          <Field label="Status">
            <select
              name="status"
              defaultValue={news.status}
              className={inputClass}
            >
              <option>Rascunho</option>
              <option>Publicado</option>
            </select>
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#43a548] font-semibold text-white disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </aside>
      </form>
    </main>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/15 px-4 outline-none focus:border-[#27877d]";

const textareaClass =
  "w-full rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-[#27877d]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      {children}
    </label>
  );
}