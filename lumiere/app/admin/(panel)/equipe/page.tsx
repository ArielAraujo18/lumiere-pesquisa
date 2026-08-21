"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  UserRound,
} from "lucide-react";
import type { Member } from "@/types/member";

export default function TeamAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMembers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/equipe", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Erro ao buscar equipe.");
      }

      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar equipe.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return members;

    return members.filter((member) =>
      [member.name, member.role, member.group, member.email]
        .join(" ")
        .toLowerCase()
        .includes(text),
    );
  }, [members, query]);

  async function handleDelete(member: Member) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${member.name}"?`,
    );

    if (!confirmed) return;

    const response = await fetch(`/api/equipe/${member.id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.error || "Não foi possível excluir o membro.");
      return;
    }

    setMembers((current) =>
      current.filter((item) => item.id !== member.id),
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center justify-between border-b border-black/5 bg-white px-5 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold">Gerenciar Equipe</h1>
          <p className="mt-0.5 hidden text-xs text-[#7b8b89] sm:block">
            Organize os membros exibidos no site.
          </p>
        </div>

        <Link
          href="/admin/equipe/novo"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#3c9b4a] px-4 text-sm font-medium text-white transition hover:bg-[#348840]"
        >
          <Plus size={17} />
          Novo membro
        </Link>
      </header>

      <div className="p-5 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#72a29d]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar membros..."
              className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8b9998] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10"
            />
          </div>

          <span className="text-sm text-[#758584]">
            {filtered.length} {filtered.length === 1 ? "membro" : "membros"}
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin text-[#27877d]" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((member) => (
              <article
                key={member.name}
                className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="absolute right-3 top-3 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                  <Link
                    href={`/admin/equipe/${member.id}`}
                    title="Visualizar"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f6f5] text-[#27877d] hover:bg-[#e1efed]"
                  >
                    <Eye size={15} />
                  </Link>

                  <Link
                    href={`/admin/equipe/${member.id}/editar`}
                    title="Editar"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f6f5] text-[#27877d] hover:bg-[#e1efed]"
                  >
                    <Pencil size={15} />
                  </Link>

                  <button
                    type="button"
                    title="Excluir"
                    onClick={() => handleDelete(member)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#f1f6f5] bg-[#eaf2f1]">
                    {member.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={34} className="text-[#77a29e]" />
                    )}
                  </div>

                  <h2 className="mt-4 max-w-full truncate text-base font-semibold text-[#071a2b]">
                    {member.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#27877d]">
                    {member.role}
                  </p>

                  <span className="mt-2 rounded-full bg-[#edf5f3] px-3 py-1 text-xs text-[#599089]">
                    {member.group}
                  </span>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        member.status === "Ativo"
                          ? "bg-[#4caf50]"
                          : "bg-[#a0adaa]"
                      }`}
                    />
                    <span className="text-xs text-[#758584]">
                      {member.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            <Link
              href="/admin/equipe/novo"
              className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#b7d5d1] bg-white/40 text-[#70ae9c] transition hover:border-[#27877d] hover:bg-white"
            >
              <UserPlus size={29} />
              <span className="mt-3 text-sm font-medium">
                Adicionar membro
              </span>
            </Link>
          </div>
        )}

        {!loading && !filtered.length && (
          <div className="mt-8 rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
            <UserRound size={34} className="mx-auto text-[#94aaa7]" />
            <p className="mt-3 text-sm text-[#607271]">
              Nenhum membro encontrado.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
