"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Eye,
  Loader2,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import GalleryForm from "@/components/admin/GalleryForm";
import type { GalleryItem, GalleryPayload } from "@/types/gallery";

const initialItem: GalleryPayload = {
  title: "",
  category: "Equipe",
  description: "",
  imageUrl: "",
  status: "Publicado",
  order: 0,
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState<GalleryPayload>(initialItem);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/galeria", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Erro ao buscar galeria.",
        );
      }

      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar galeria.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return items;

    return items.filter((item) =>
      [item.title, item.category, item.description]
        .join(" ")
        .toLowerCase()
        .includes(text),
    );
  }, [items, query]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/galeria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível publicar a foto.");
      }

      setForm(initialItem);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao publicar foto.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: GalleryItem) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${item.title}"?`,
    );

    if (!confirmed) return;

    const response = await fetch(`/api/galeria/${item.id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.error || "Não foi possível excluir a foto.");
      return;
    }

    setItems((current) =>
      current.filter((currentItem) => currentItem.id !== item.id),
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center justify-between border-b border-black/5 bg-white px-5 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold">Gerenciar Galeria</h1>
          <p className="mt-0.5 hidden text-xs text-[#7b8b89] sm:block">
            Publique e organize as imagens do grupo.
          </p>
        </div>
      </header>

      <div className="grid gap-7 p-5 lg:grid-cols-[370px_minmax(0,1fr)] sm:p-8">
        <form onSubmit={handleSubmit} className="h-fit">
          <GalleryForm
            value={form}
            onChange={setForm}
            disabled={saving}
            compact
          />

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3c9b4a] px-5 text-sm font-medium text-white transition hover:bg-[#348840] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={17} className="animate-spin" />}
            Publicar foto
          </button>
        </form>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#72a29d]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar fotos..."
                className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8b9998] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10"
              />
            </div>

            <span className="text-sm text-[#758584]">
              {filtered.length} {filtered.length === 1 ? "foto" : "fotos"}
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="animate-spin text-[#27877d]" />
            </div>
          ) : filtered.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#e8f0ef]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />

                    <div className="absolute right-3 top-3 flex gap-1">
                      <Link
                        href={`/admin/galeria/${item.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-[#27877d] shadow-sm backdrop-blur hover:bg-white"
                        title="Visualizar"
                      >
                        <Eye size={15} />
                      </Link>

                      <Link
                        href={`/admin/galeria/${item.id}/editar`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-[#27877d] shadow-sm backdrop-blur hover:bg-white"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-500 shadow-sm backdrop-blur hover:bg-white"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {item.status === "Rascunho" && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-[#071a2b]/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        Rascunho
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="truncate text-sm font-semibold text-[#071a2b]">
                      {item.title}
                    </h2>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#edf5f3] px-3 py-1 text-xs text-[#599089]">
                        {item.category}
                      </span>

                      <span className="text-xs text-[#8a9997]">
                        ordem {item.order}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#71817f]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-[#607271]">
                Nenhuma foto encontrada.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
