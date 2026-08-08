"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import MemberForm from "@/components/admin/MemberForm";
import type { MemberPayload } from "@/types/member";

const emptyMember: MemberPayload = {
  name: "",
  role: "",
  group: "Bolsistas",
  bio: "",
  email: "",
  photoUrl: "",
  lattesUrl: "",
  linkedinUrl: "",
  status: "Ativo",
  order: 0,
};

export default function EditMemberPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [member, setMember] = useState<MemberPayload>(emptyMember);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/equipe/${id}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Não foi possível carregar o membro.");
        }

        setMember({
          name: data.name || "",
          role: data.role || "",
          group: data.group || "Outros",
          bio: data.bio || "",
          email: data.email || "",
          photoUrl: data.photoUrl || "",
          lattesUrl: data.lattesUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          status: data.status === "Inativo" ? "Inativo" : "Ativo",
          order: Number(data.order || 0),
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar membro.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/equipe/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível atualizar o membro.");
      }

      router.push("/admin/equipe");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar membro.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#27877d]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center gap-4 border-b border-black/5 bg-white px-5 sm:px-8">
        <Link
          href="/admin/equipe"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-[#506260] hover:bg-[#f5f8f7]"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Editar membro</h1>
          <p className="text-xs text-[#7b8b89]">{member.name}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-5 sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <MemberForm
          value={member}
          onChange={setMember}
          disabled={saving}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/equipe"
            className="inline-flex h-11 items-center rounded-xl border border-black/10 bg-white px-5 text-sm font-medium text-[#435452] hover:bg-[#f6f8f7]"
          >
            Cancelar
          </Link>

          <button
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#27877d] px-5 text-sm font-medium text-white hover:bg-[#21766d] disabled:opacity-60"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            Salvar alterações
          </button>
        </div>
      </form>
    </main>
  );
}
