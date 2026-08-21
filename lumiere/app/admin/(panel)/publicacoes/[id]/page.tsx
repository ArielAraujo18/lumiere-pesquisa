"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, ExternalLink, LoaderCircle, Pencil, Star } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { Publication } from "@/types/publication";

export default function PublicationDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPublication() {
      try {
        const response = await fetch(`/api/publicacoes/${id}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.details ?? data.error ?? "Erro ao carregar.");
        setPublication(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar a publicação.");
      } finally { setLoading(false); }
    }
    if (id) void loadPublication();
  }, [id]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#f7f9f7] text-[#667a77]"><LoaderCircle size={20} className="mr-3 animate-spin" /> Carregando publicação...</main>;
  if (error || !publication) return <main className="min-h-screen bg-[#f7f9f7] p-8 text-[#071a2b]"><div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error || "Publicação não encontrada."}</div></main>;

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex flex-col gap-4 border-b border-black/5 bg-white px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <Link href="/admin/publicacoes" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#27877d] hover:underline"><ArrowLeft size={17} /> Voltar para publicações</Link>
          <h1 className="text-xl font-bold tracking-tight">Detalhes da publicação</h1>
        </div>
        <Link href={`/admin/publicacoes/${publication.id}/editar`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#27877d]/20 bg-white px-5 text-sm font-semibold text-[#27877d] transition hover:bg-[#eaf5f2]"><Pencil size={17} /> Editar</Link>
      </header>

      <section className="grid gap-6 p-5 sm:p-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_12px_rgba(7,26,43,0.06)] sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#e8f2f0] px-3 py-1 text-xs font-medium text-[#27877d]">{publication.type}</span>
            <span className="rounded-full bg-[#e8f4e8] px-3 py-1 text-xs font-medium text-[#2f9b45]">{publication.status}</span>
            {publication.featured ? <span className="inline-flex items-center gap-1 rounded-full bg-[#fff6da] px-3 py-1 text-xs font-medium text-[#8a6b00]"><Star size={13} /> Destaque</span> : null}
          </div>
          <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">{publication.title}</h2>
          <p className="mt-4 text-sm leading-6 text-[#536965]">{publication.authors}</p>
          {publication.abstract ? <div className="mt-8 border-t border-black/5 pt-6"><h3 className="font-semibold">Resumo</h3><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#536965]">{publication.abstract}</p></div> : null}
        </article>

        <aside className="h-fit space-y-5 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_12px_rgba(7,26,43,0.06)]">
          <Info label="Ano" value={String(publication.year)} />
          <Info label="Evento / Periódico" value={publication.venue} />
          {publication.doi ? <Info label="DOI" value={publication.doi} icon={<BookOpen size={16} />} /> : null}
          {publication.url ? <a href={publication.url} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#27877d] px-4 text-sm font-semibold text-white transition hover:bg-[#216f68]"><ExternalLink size={17} /> Abrir publicação</a> : null}
        </aside>
      </section>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wide text-[#7a8e8c]">{label}</p><p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#334b49]">{icon}{value}</p></div>;
}
