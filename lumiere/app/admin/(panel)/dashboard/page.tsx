"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  Images,
  Newspaper,
  Plus,
  Users,
} from "lucide-react";

type News = {
  id: string;
  title: string;
  category: string;
  date?: string;
  createdAt?: string;
  status?: string;
};

type Project = {
  id: string;
  title: string;
  status: string;
  createdAt?: string;
};

type Member = {
  id: string;
};

type Publication = {
  id: string;
};

export default function DashboardPage() {
  const [news, setNews] = useState<News[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          newsResponse,
          projectsResponse,
          membersResponse,
          publicationsResponse,
        ] = await Promise.all([
          fetch("/api/noticias"),
          fetch("/api/projetos"),
          fetch("/api/equipe"),
          fetch("/api/publicacoes"),
        ]);

        if (
          !newsResponse.ok ||
          !projectsResponse.ok ||
          !membersResponse.ok ||
          !publicationsResponse.ok
        ) {
          throw new Error("Erro ao carregar dados do dashboard");
        }

        const [newsData, projectsData, membersData, publicationsData] =
          await Promise.all([
            newsResponse.json(),
            projectsResponse.json(),
            membersResponse.json(),
            publicationsResponse.json(),
          ]);

        setNews(newsData);
        setProjects(projectsData);
        setMembers(membersData);
        setPublications(publicationsData);
      } catch (error) {
        console.error("Erro no dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const recentNews = useMemo(() => news.slice(0, 5), [news]);
  const recentProjects = useMemo(() => projects.slice(0, 5), [projects]);

  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f7] p-8">
        <p className="text-sm text-[#526866]">Carregando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#56b49b]">
            Bem-vindo de volta
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#071a2b]">
            Painel do Grupo Lumière
          </h1>

          <p className="mt-2 text-sm capitalize text-[#526866]">
            {currentDate}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Notícias"
            value={news.length}
            icon={<Newspaper size={22} />}
          />

          <StatCard
            title="Projetos"
            value={projects.length}
            icon={<FolderKanban size={22} />}
          />

          <StatCard
            title="Membros"
            value={members.length}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Publicações"
            value={publications.length}
            icon={<BookOpen size={22} />}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <h2 className="font-bold text-[#071a2b]">
                Notícias recentes
              </h2>

              <Link
                href="/admin/noticias"
                className="text-xs font-semibold text-[#009688]"
              >
                Ver todas →
              </Link>
            </div>

            {recentNews.length === 0 ? (
              <EmptyMessage text="Nenhuma notícia cadastrada." />
            ) : (
              recentNews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-black/5 px-6 py-4 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#071a2b]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-[#45b69c]">
                      {item.category}
                      {item.date ? ` · ${item.date}` : ""}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#e8f6e9] px-3 py-1 text-xs font-medium text-[#169c3a]">
                    {item.status ?? "Publicado"}
                  </span>
                </div>
              ))
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <h2 className="font-bold text-[#071a2b]">
                Projetos cadastrados
              </h2>

              <Link
                href="/admin/projetos"
                className="text-xs font-semibold text-[#009688]"
              >
                Ver todos →
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <EmptyMessage text="Nenhum projeto cadastrado." />
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between border-b border-black/5 px-6 py-4 last:border-b-0"
                >
                  <p className="text-sm font-medium text-[#071a2b]">
                    {project.title}
                  </p>

                  <span className="rounded-full bg-[#e8f6e9] px-3 py-1 text-xs font-medium text-[#169c3a]">
                    {project.status}
                  </span>
                </div>
              ))
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ActionButton
            href="/admin/noticias/nova"
            icon={<Plus size={18} />}
          >
            Nova notícia
          </ActionButton>

          <ActionButton
            href="/admin/projetos/"
            icon={<Plus size={18} />}
          >
            Novo projeto
          </ActionButton>

          <ActionButton
            href="/admin/galeria"
            icon={<Images size={18} />}
          >
            Gerenciar galeria
          </ActionButton>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f3f0] text-[#009688]">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-bold text-[#071a2b]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#45b69c]">
        {title}
      </p>
    </div>
  );
}

function ActionButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex h-12 items-center gap-3 rounded-xl bg-[#009688] px-5 text-sm font-semibold text-white transition hover:bg-[#007f74]"
    >
      {icon}
      {children}
    </Link>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="px-6 py-10 text-center text-sm text-[#7a8e8c]">
      {text}
    </div>
  );
}