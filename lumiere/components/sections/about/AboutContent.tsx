const pillars = [
  {
    title: "Missão",
    description:
      "Desenvolver pesquisa aplicada e ações de extensão que promovam cidades mais inteligentes, sustentáveis e inclusivas no contexto do Nordeste brasileiro.",
    icon: <TargetIcon />,
  },
  {
    title: "Visão",
    description:
      "Ser referência nacional em pesquisa e inovação em Smart Cities, formando profissionais comprometidos com o desenvolvimento regional.",
    icon: <EyeIcon />,
  },
  {
    title: "Valores",
    description:
      "Rigor científico, impacto social, colaboração aberta, sustentabilidade ambiental, inovação responsável e comprometimento com as cidades brasileiras.",
    icon: <AwardIcon />,
  },
];

const timeline = [
  { year: "2020", description: "Fundação do grupo" },
  { year: "2021", description: "Primeiros projetos IoT" },
  { year: "2022", description: "Expansão das ações de extensão" },
  { year: "2024", description: "Novas pesquisas e publicações" },
];

export function AboutContent() {
  return (
    <section className="bg-[#f8faf8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="max-w-3xl text-lg leading-8 text-[#334b49] sm:text-xl">
          O Lumière é um grupo de pesquisa, estudo e extensão da UFERSA Campus
          Angicos voltado ao desenvolvimento de soluções em Smart Cities,
          inovação urbana, sustentabilidade e tecnologias aplicadas.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-2xl border border-black/5 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f2f0] text-[#27877d]">
                {pillar.icon}
              </div>

              <h2 className="mt-6 text-xl font-bold text-[#071a2b]">
                {pillar.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#526866]">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="m9 12-1 9 4-2 4 2-1-9" />
    </svg>
  );
}