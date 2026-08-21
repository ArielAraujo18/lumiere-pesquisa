"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Mail,
  Pencil,
  UserRound,
} from "lucide-react";
import type { Member } from "@/types/member";

export default function ViewMemberPage() {
  const params = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/equipe/${params.id}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Não foi possível carregar o membro.");
        }

        setMember(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar membro.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#27877d]" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-8 text-sm text-red-600">
        {error || "Membro não encontrado."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center justify-between border-b border-black/5 bg-white px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/equipe"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-[#506260] hover:bg-[#f5f8f7]"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold">Detalhes do membro</h1>
        </div>

        <Link
          href={`/admin/equipe/${member.id}/editar`}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#27877d] px-4 text-sm font-medium text-white hover:bg-[#21766d]"
        >
          <Pencil size={16} />
          Editar
        </Link>
      </header>

      <div className="p-5 sm:p-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#0b4543] to-[#27877d]" />

          <div className="px-6 pb-8 sm:px-10">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#eaf2f1] shadow-sm">
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={42} className="text-[#77a29e]" />
                )}
              </div>

              <div className="pb-1">
                <h2 className="text-2xl font-semibold">{member.name}</h2>
                <p className="mt-1 text-[#27877d]">{member.role}</p>
                <p className="mt-1 text-sm text-[#758584]">{member.group}</p>
              </div>
            </div>

            {member.bio && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6f8180]">
                  Biografia
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#435452]">
                  {member.bio}
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#f8fbfa] p-4 text-sm text-[#334b49] hover:border-[#9dc7c1]"
                >
                  <Mail size={18} className="text-[#27877d]" />
                  {member.email}
                </a>
              )}

              {member.lattesUrl && (
                <a
                  href={member.lattesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#f8fbfa] p-4 text-sm text-[#334b49] hover:border-[#9dc7c1]"
                >
                  <ExternalLink size={18} className="text-[#27877d]" />
                  Currículo Lattes
                </a>
              )}

              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#f8fbfa] p-4 text-sm text-[#334b49] hover:border-[#9dc7c1]"
                >
                  <ExternalLink size={18} className="text-[#27877d]" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
