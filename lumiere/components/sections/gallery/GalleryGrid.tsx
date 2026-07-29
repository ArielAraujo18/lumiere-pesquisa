"use client";

import { useState } from "react";
import Image from "next/image";

const categories = [
  "Todos",
  "Equipe",
  "Projetos",
  "Eventos",
  "Visitas técnicas",
  "Extensão",
];

const galleryItems = [
  {
    src: "/images/galeria/servidores.jpg",
    alt: "Equipe em visita técnica ao datacenter",
    category: "Visitas técnicas",
  },
  {
    src: "/images/galeria/escritorio.jpg",
    alt: "Ambiente visitado pelo Grupo Lumière",
    category: "Visitas técnicas",
  },
  {
    src: "/images/galeria/equipe-trabalho.jpg",
    alt: "Equipe desenvolvendo projetos de pesquisa",
    category: "Equipe",
  },
  {
    src: "/images/galeria/evento.jpg",
    alt: "Participação do Grupo Lumière em evento",
    category: "Eventos",
  },
  {
    src: "/images/galeria/laboratorio.jpg",
    alt: "Pesquisa realizada em laboratório",
    category: "Projetos",
  },
  {
    src: "/images/galeria/programacao.jpg",
    alt: "Estudantes trabalhando em projeto tecnológico",
    category: "Projetos",
  },
  {
    src: "/images/galeria/reuniao.jpg",
    alt: "Reunião da equipe do Grupo Lumière",
    category: "Equipe",
  },
  {
    src: "/images/galeria/visita-campo.jpg",
    alt: "Registro de atividade de extensão",
    category: "Extensão",
  },
];

export function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredItems =
    selectedCategory === "Todos"
      ? galleryItems
      : galleryItems.filter(
          (item) => item.category === selectedCategory,
        );

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

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredItems.map((item) => (
            <figure
              key={item.src}
              className="relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-[#e8f2f0]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                className="h-auto w-full object-cover transition duration-300 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}