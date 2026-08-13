import Link from "next/link";

type News = {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  slug: string;
  imageUrl?: string | null;
};

type LatestNewsProps = {
  news: News[];
};

export function LatestNews({ news = [] }: LatestNewsProps) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27877d]">
              Novidades
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#071a2b] sm:text-4xl">
              Últimas notícias
            </h2>
          </div>

          <Link
            href="/noticias"
            className="hidden items-center gap-2 text-sm font-semibold text-[#27877d] hover:underline sm:inline-flex"
          >
            Ver todas
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link href={`/noticias/${item.slug}`}>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#e6efeb]">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#e8f2f0] text-sm text-[#72ad99]">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-[#e8f2f0] px-3 py-1 font-medium text-[#27877d]">
                      {item.category}
                    </span>

                    <time className="text-[#72ad99]">
                      {new Date(item.publishedAt).toLocaleDateString("pt-BR")}
                    </time>
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-6 text-[#071a2b]">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#526866]">
                    {item.summary}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <Link
          href="/noticias"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#27877d] hover:underline sm:hidden"
        >
          Ver todas
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}