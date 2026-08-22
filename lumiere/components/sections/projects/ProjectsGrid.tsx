"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { projectAreas } from "@/constants/projectArea";

const categories = ["Todos", ...projectAreas];

type PublicProject = {
  id: string;
  title: string;
  summary: string;
  area: string;
  status: string;
  slug: string;
  image?: string;
  imageUrl?: string;
};

export function ProjectsGrid() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Todos");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projetos");

        if (!response.ok) {
          throw new Error("Erro ao carregar projetos");
        }

        const data: PublicProject[] =
          await response.json();

        setProjects(data);
      } catch (error) {
        console.error(
          "Erro ao carregar projetos:",
          error,
        );
      }
    }

    void loadProjects();
  }, []);

  const filteredProjects =
    selectedCategory === "Todos"
      ? projects
      : projects.filter(
          (project) =>
            project.area === selectedCategory,
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

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const image =
              project.image ||
              project.imageUrl ||
              "";

            return (
              <article
                key={project.id}
                className="flex overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex w-full flex-col">

                  <div className="relative aspect-[16/7] overflow-hidden bg-[#e8f2f0]">
                    {image ? (
                      <Image
                        src={image}
                        alt={project.title}
                        fill
                        unoptimized={
                          image.startsWith("data:")
                        }
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#72ad99]">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-[#e8f2f0] px-3 py-1 font-medium text-[#27877d]">
                        {project.area}
                      </span>

                      <span className="rounded-full bg-[#edf6ec] px-3 py-1 font-medium text-[#287a42]">
                        ● {project.status}
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-bold leading-6 text-[#071a2b]">
                      {project.title}
                    </h2>

                    <p className="mt-3 flex-1 text-sm leading-6 text-[#526866]">
                      {project.summary}
                    </p>

                    <Link
                      href={`/projetos/${project.slug}`}
                      className="mt-8 inline-flex w-fit items-center gap-3 text-sm font-semibold text-[#27877d] hover:underline"
                    >
                      Ver detalhes
                      <span aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <p className="py-12 text-center text-sm text-[#526866]">
            Nenhum projeto encontrado nesta área.
          </p>
        )}
      </div>
    </section>
  );
}