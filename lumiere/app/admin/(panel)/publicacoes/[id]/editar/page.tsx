"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import PublicationForm from "@/components/admin/PublicationForm";
import type { Publication, PublicationPayload } from "@/types/publication";

const emptyPublication: PublicationPayload = {
  title: "", authors: "", year: "", type: "Artigo", venue: "", status: "Publicado",
  abstract: "", doi: "", url: "", featured: false,
};

export default function EditPublicationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const [publication, setPublication] = useState<PublicationPayload>(emptyPublication);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPublication() {
      try {
        setLoading(true); setError("");
        const response = await fetch(`/api/publicacoes/${id}`, { cache: "no-store" });
        const data = (await response.json()) as Publication & { error?: string; details?: string };
        if (!response.ok) throw new Error(data.details ?? data.error ?? "Erro ao carregar.");
        setPublication({
          title: data.title, authors: data.authors, year: String(data.year), type: data.type,
          venue: data.venue, status: data.status, abstract: data.abstract ?? "", doi: data.doi ?? "",
          url: data.url ?? "", featured: Boolean(data.featured),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar a publicação.");
      } finally { setLoading(false); }
    }
    if (id) void loadPublication();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true); setError("");
      const response = await fetch(`/api/publicacoes/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(publication),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details ?? data.error ?? "Erro ao salvar.");
      router.push("/admin/publicacoes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar a publicação.");
    } finally { setSaving(false); }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="border-b border-black/5 bg-white px-5 py-5 sm:px-8">
        <Link href="/admin/publicacoes" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#27877d] hover:underline">
          <ArrowLeft size={17} /> Voltar para publicações
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Editar publicação</h1>
        <p className="mt-1 text-sm text-[#667a77]">Atualize os dados da publicação.</p>
      </header>
      {loading ? (
        <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-[#667a77]"><LoaderCircle size={20} className="animate-spin" /> Carregando publicação...</div>
      ) : (
        <PublicationForm value={publication} onChange={setPublication} onSubmit={handleSubmit} saving={saving} error={error} submitLabel="Salvar alterações" />
      )}
    </main>
  );
}
