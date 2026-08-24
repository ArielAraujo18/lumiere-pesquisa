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
  const [selectedCategory, setSelectedCategory] =
    useState("Todos");

  const filteredItems =
    selectedCategory === "Todos"
      ? galleryItems
      : galleryItems.filter(
          (item) =>
            item.category === selectedCategory,
        );

  return (
    <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-3 overflow-x-auto pb-2">
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
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-[#e8f2f0]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="h-auto w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-10 opacity-0 transition group-hover:opacity-100">
                <p className="text-sm font-medium text-white">
                  {item.alt}
                </p>

                <p className="mt-1 text-xs text-white/80">
                  {item.category}
                </p>
              </div>
            </figure>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-10 rounded-2xl border border-black/5 bg-white px-6 py-12 text-center">
            <p className="text-sm text-[#526866]">
              Nenhuma imagem encontrada nesta categoria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}