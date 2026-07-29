import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  Images,
  MessageSquare,
  Newspaper,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";

type Stat = {
  value: number;
  label: string;
  icon: LucideIcon;
};

const stats: Stat[] = [
  { value: 5, label: "Notícias", icon: Newspaper },
  { value: 5, label: "Projetos", icon: FolderKanban },
  { value: 11, label: "Membros", icon: Users },
  { value: 7, label: "Publicações", icon: BookOpen },
  { value: 3, label: "Mensagens", icon: MessageSquare },
];
const recentNews = [
  {
    title: "Lumière apresenta projeto no Fórum de Inovação RN",
    details: "Eventos · 14/11/2024",
  },
  {
    title: "Visita técnica à Prefeitura de Angicos firma parceria",
    details: "Visitas técnicas · 02/10/2024",
  },
  {
    title: "Novo bolsista IC inicia pesquisa em mobilidade urbana",
    details: "Extensão · 19/09/2024",
  },
  {
    title: "Artigo aceito no IEEE SmartCity Conference 2024",
    details: "Destaques · 11/08/2024",
  },
  {
    title: "Reunião de planejamento define metas do semestre",
    details: "Reuniões · 07/07/2024",
  },
];

const projects = [
  {
    title: "Monitoramento Inteligente de Ambientes Urbanos",
    category: "IoT",
    status: "Em andamento",
  },
  {
    title: "Soluções IoT para Cidades Inteligentes",
    category: "IoT",
    status: "Concluído",
  },
  {
    title: "Sustentabilidade e Tecnologia Aplicada",
    category: "Sustentabilidade",
    status: "Em andamento",
  },
  {
    title: "Dados Urbanos para Tomada de Decisão",
    category: "Dados",
    status: "Em andamento",
  },
  {
    title: "Infraestrutura Inteligente para Ambientes Públicos",
    category: "Extensão",
    status: "Planejado",
  },
];

export default function DashboardPage() {
  const date = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(new Date());

  return (
    <main className="p-5 pt-20 sm:p-8 lg:pt-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#72ad99]">
          Bem-vindo de volta
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#071a2b] sm:text-3xl">
          Painel do Grupo Lumière
        </h1>

        <p className="mt-2 text-sm capitalize text-[#526866]">{date}</p>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#27877d]">
                <Icon size={20} strokeWidth={1.8} />
              </div>

              <strong className="mt-4 block text-3xl font-bold text-[#071a2b]">
                {stat.value}
              </strong>

              <p className="mt-1 text-sm text-[#72ad99]">{stat.label}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <DashboardList
          title="Notícias recentes"
          href="/admin/noticias"
          items={recentNews.map((item) => ({
            title: item.title,
            subtitle: item.details,
            badge: "Publicado",
          }))}
        />

        <DashboardList
          title="Projetos cadastrados"
          href="/admin/projetos"
          items={projects.map((project) => ({
            title: project.title,
            subtitle: project.category,
            badge: project.status,
          }))}
        />
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickAction
          href="/admin/noticias/nova"
          label="Nova notícia"
          icon={Plus}
        />

        <QuickAction
          href="/admin/projetos/novo"
          label="Novo projeto"
          icon={Plus}
        />

        <QuickAction
          href="/admin/mensagens"
          label="Ver mensagens"
          icon={MessageSquare}
        />

        <QuickAction
          href="/admin/galeria"
          label="Gerenciar galeria"
          icon={Images}
        />
      </section>
    </main>
  );
}

type DashboardListProps = {
  title: string;
  href: string;
  items: {
    title: string;
    subtitle: string;
    badge: string;
  }[];
};

function DashboardList({ title, href, items }: DashboardListProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <header className="flex items-center justify-between border-b border-black/5 px-6 py-5">
        <h2 className="font-bold text-[#071a2b]">{title}</h2>

        <Link
          href={href}
          className="text-xs font-semibold text-[#27877d] hover:underline"
        >
          Ver todas →
        </Link>
      </header>

      <div>
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-4 last:border-none"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#071a2b]">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-[#72ad99]">{item.subtitle}</p>
            </div>

            <span className="shrink-0 rounded-full bg-[#edf6ec] px-3 py-1 text-xs font-medium text-[#39913e]">
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function QuickAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center gap-3 rounded-xl bg-[#27877d] px-5 text-sm font-semibold text-white transition hover:bg-[#216f67]"
    >
      <Icon size={18} strokeWidth={1.8} />
      {label}
    </Link>
  );
}