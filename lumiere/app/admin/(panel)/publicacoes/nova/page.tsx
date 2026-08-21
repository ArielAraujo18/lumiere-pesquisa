"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import PublicationForm from "@/components/admin/PublicationForm";
import type { PublicationPayload } from "@/types/publication";

const initialPublication: PublicationPayload = {
  title: "",
  authors: "",
  year: String(new Date().getFullYear()),
  type: "Artigo",
  venue: "",
  status: "Publicado",
  abstract: "",
  doi: "",
  url: "",
  featured: false,
};

export default function NewPublicationPage() {
  const router = useRouter();
  const [publication, setPublication] = useState(initialPublication);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const response = await fetch("/api/publicacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publication),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details ?? data.error ?? "Erro ao salvar.");
      router.push("/admin/publicacoes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a publicação.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="border-b border-black/5 bg-white px-5 py-5 sm:px-8">
        <Link href="/admin/publicacoes" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#27877d] hover:underline">
          <ArrowLeft size={17} /> Voltar para publicações
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Nova publicação</h1>
        <p className="mt-1 text-sm text-[#667a77]">Cadastre uma nova produção científica do Grupo Lumière.</p>
      </header>
      <PublicationForm value={publication} onChange={setPublication} onSubmit={handleSubmit} saving={saving} error={error} submitLabel="Criar publicação" />
    </main>
  );
}
