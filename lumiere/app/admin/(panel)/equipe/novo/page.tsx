"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import MemberForm from "@/components/admin/MemberForm";
import type { MemberPayload } from "@/types/member";

const initialMember: MemberPayload = {
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

export default function NewMemberPage() {
  const router = useRouter();

  const [member, setMember] =
    useState<MemberPayload>(initialMember);

  const [photo, setPhoto] =
    useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.set("name", member.name);
      formData.set("role", member.role);
      formData.set("group", member.group);
      formData.set("bio", member.bio);
      formData.set("email", member.email);

      formData.set(
        "lattesUrl",
        member.lattesUrl,
      );

      formData.set(
        "linkedinUrl",
        member.linkedinUrl,
      );

      formData.set(
        "status",
        member.status,
      );

      formData.set(
        "order",
        String(member.order),
      );

      if (photo) {
        formData.set("photo", photo);
      }

      const response = await fetch(
        "/api/equipe",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details ??
            data.error ??
            "Não foi possível salvar o membro.",
        );
      }

      router.push("/admin/equipe");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar membro.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center gap-4 border-b border-black/5 bg-white px-5 sm:px-8">
        <Link
          href="/admin/equipe"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-[#506260] transition hover:bg-[#f5f8f7]"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-lg font-semibold">
            Novo membro
          </h1>

          <p className="text-xs text-[#7b8b89]">
            Adicione uma pessoa à equipe do Lumière.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-8"
      >
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <MemberForm
          value={member}
          onChange={setMember}
          photo={photo}
          onPhotoChange={setPhoto}
          disabled={saving}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/equipe"
            className="inline-flex h-11 items-center rounded-xl border border-black/10 bg-white px-5 text-sm font-medium text-[#435452] transition hover:bg-[#f6f8f7]"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#27877d] px-5 text-sm font-medium text-white transition hover:bg-[#21766d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Salvando..."
              : "Salvar membro"}
          </button>
        </div>
      </form>
    </main>
  );
}