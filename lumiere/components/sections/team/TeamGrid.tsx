"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";

const categories = [
  "Todos",
  "Coordenação",
  "Pesquisadores",
  "Bolsistas",
  "Colaboradores",
  "Voluntários",
  "Outros",
];

type Member = {
  id: string;
  name: string;
  role: string;
  area?: string;
  group?: string;
  photoUrl?: string;
  image?: string;
  lattesUrl?: string;
  linkedinUrl?: string;
  status?: string;
};

export function TeamGrid() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Todos");

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await fetch("/api/equipe", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "Erro ao carregar equipe",
          );
        }

        const data: Member[] =
          await response.json();

        // Mostra apenas membros ativos no site público
        setMembers(
          data.filter(
            (member) =>
              !member.status ||
              member.status === "Ativo",
          ),
        );
      } catch (error) {
        console.error(
          "Erro ao carregar equipe:",
          error,
        );
      }
    }

    void loadMembers();
  }, []);

  const filteredMembers =
    selectedCategory === "Todos"
      ? members
      : members.filter(
          (member) =>
            member.group === selectedCategory,
        );

  return (
    <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const active =
              category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-[#27877d] bg-[#27877d] text-white shadow-md"
                    : "border-black/10 bg-white text-[#526866] hover:border-[#27877d] hover:text-[#27877d]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMembers.map((member) => {
            const photoSrc =
              member.photoUrl ||
              member.image ||
              null;

            return (
              <article
                key={member.id}
                className="flex min-h-64 flex-col items-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[#e8f2f0]">
                  {photoSrc ? (
                    <Image
                      src={photoSrc}
                      alt={`Foto de ${member.name}`}
                      fill
                      unoptimized={photoSrc.startsWith(
                        "data:",
                      )}
                      sizes="96px"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound
                        size={38}
                        className="text-[#72ad99]"
                      />
                    </div>
                  )}
                </div>

                <h2 className="mt-4 text-sm font-bold text-[#071a2b]">
                  {member.name}
                </h2>

                <p className="mt-1 text-sm text-[#27877d]">
                  {member.role}
                </p>

                {member.group && (
                  <p className="mt-1 text-xs leading-5 text-[#72ad99]">
                    {member.group}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap justify-center gap-3 pt-5">
                  {member.lattesUrl && (
                    <a
                      href={member.lattesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-[#526866] transition hover:text-[#27877d]"
                    >
                      ↗ Lattes
                    </a>
                  )}

                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-[#526866] transition hover:text-[#27877d]"
                    >
                      ↗ LinkedIn
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="mt-12 rounded-2xl border border-black/5 bg-white px-6 py-12 text-center">
            <p className="text-sm text-[#6f8180]">
              Nenhum membro encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}