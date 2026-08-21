const activities = [
  {
    title: "Pesquisa Aplicada",
    description:
      "Pesquisas científicas focadas em Smart Cities, IoT e tecnologias urbanas para cidades do semiárido nordestino.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" />
        <path d="M8 15h8" />
      </svg>
    ),
  },
  {
    title: "Projetos de Extensão",
    description:
      "Levamos soluções tecnológicas para a comunidade, conectando universidade e gestão pública municipal.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    title: "Smart Cities & IoT",
    description:
      "Prototipamos e implementamos sistemas de sensoriamento, conectividade e automação para ambientes urbanos.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M5 9a10 10 0 0 1 14 0M8 12a6 6 0 0 1 8 0M11 15a2 2 0 0 1 2 0" />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Produção Acadêmica",
    description:
      "Publicações em periódicos, conferências nacionais e internacionais da área de cidades inteligentes.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" />
      </svg>
    ),
  },
];

export function WhatWeDo() {
  return (
    <section className="bg-[#f8faf8] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27877d]">
            Nossas frentes
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#071a2b] sm:text-4xl">
            O que fazemos
          </h2>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {activities.map((activity) => (
            <article
              key={activity.title}
              className="rounded-2xl border border-black/5 bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#27877d]">
                {activity.icon}
              </div>

              <h3 className="mt-6 text-base font-bold text-[#071a2b]">
                {activity.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#526866]">
                {activity.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}