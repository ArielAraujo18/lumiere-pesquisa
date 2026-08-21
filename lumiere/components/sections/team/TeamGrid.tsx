"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const categories = [
  "Todos",
  "Coordenação",
  "Pesquisadores",
  "Bolsistas",
  "Colaboradores",
];

type Member = {
  id: string;
  name: string;
  role: string;
  area: string;
  category: string;
  image: string;
  profileLabel?: string;
  profileUrl?: string;
};

export function TeamGrid() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await fetch("/api/equipe");

        if (!response.ok) {
          throw new Error("Erro ao carregar equipe");
        }

        const data: Member[] = await response.json();
        setMembers(data);
      } catch (error) {
        console.error(error);
      }
    }

    void loadMembers();
  }, []);

  const filteredMembers =
    selectedCategory === "Todos"
      ? members
      : members.filter(
          (member) => member.category === selectedCategory
        );

  return (
    <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
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
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="flex min-h-56 flex-col items-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#e8f2f0]">
                <Image
                  src={member.image}
                  alt={`Foto de ${member.name}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <h2 className="mt-4 text-sm font-bold text-[#071a2b]">
                {member.name}
              </h2>

              <p className="mt-1 text-sm text-[#27877d]">
                {member.role}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#72ad99]">
                {member.area}
              </p>

              {member.profileUrl && (
                <a
                  href={member.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto pt-5 text-xs font-medium text-[#526866] hover:text-[#27877d]"
                >
                  ↗ {member.profileLabel}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}