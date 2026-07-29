"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  "Todos",
  "Eventos",
  "Visitas técnicas",
  "Reuniões",
  "Extensão",
  "Destaques",
];

const news = [
  {
    title: "Lumière apresenta projeto no Fórum de Inovação RN",
    summary:
      "Membros do grupo apresentaram resultados do projeto de Dados Urbanos durante o Fórum de Inovação e Tecnologia.",
    category: "Eventos",
    date: "14/11/2024",
    image: "/images/noticias/forum-inovacao.jpg",
    slug: "lumiere-apresenta-projeto-forum-inovacao-rn",
  },
  {
    title: "Visita técnica à Prefeitura de Angicos firma parceria",
    summary:
      "Equipe do Lumière visitou a secretaria municipal de planejamento para discutir a implantação de novas soluções.",
    category: "Visitas técnicas",
    date: "02/10/2024",
    image: "/images/noticias/visita-tecnica.jpg",
    slug: "visita-tecnica-prefeitura-angicos",
  },
  {
    title: "Novo bolsista IC inicia pesquisa em mobilidade urbana",
    summary:
      "O grupo recebe novo integrante para desenvolver pesquisa sobre soluções tecnológicas para mobilidade urbana.",
    category: "Extensão",
    date: "19/09/2024",
    image: "/images/noticias/novo-bolsista.jpg",
    slug: "novo-bolsista-pesquisa-mobilidade-urbana",
  },
];

export function NewsGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredNews =
    selectedCategory === "Todos"
      ? news
      : news.filter((item) => item.category === selectedCategory);

  return (
    <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const active = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-[#27877d] bg-[#27877d] text-white shadow-md"
                    : "border-black/10 bg-white text-[#526866] hover:border-[#27877d]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNews.map((item) => (
            <article
              key={item.slug}
              className="flex overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex w-full flex-col">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#e8f2f0]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-[#edf6ec] px-3 py-1 font-medium text-[#39913e]">
                      {item.category}
                    </span>

                    <time className="text-[#72ad99]">{item.date}</time>
                  </div>

                  <h2 className="mt-4 text-base font-bold leading-6 text-[#071a2b]">
                    {item.title}
                  </h2>

                  <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[#526866]">
                    {item.summary}
                  </p>

                  <Link
                    href={`/noticias/${item.slug}`}
                    className="mt-6 inline-flex w-fit items-center gap-3 text-sm font-semibold text-[#27877d] hover:underline"
                  >
                    Ler mais
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}