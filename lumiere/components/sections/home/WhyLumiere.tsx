import Link from "next/link";

const values = [
  {
    title: "Foco em impacto real e mensurável",
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
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
  },
  {
    title: "Cidades do interior do Nordeste",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M5 21V8h6v13M11 4h6v17M17 11h3v10M8 11h1M8 15h1M14 7h1M14 11h1M14 15h1" />
        <path d="M3 21h18" />
      </svg>
    ),
  },
  {
    title: "Sustentabilidade como princípio",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M20 4C12 4 6 8 6 14c0 3 2 5 5 5 6 0 9-7 9-15Z" />
        <path d="M4 21c2-5 6-8 11-11" />
      </svg>
    ),
  },
  {
    title: "Excelência acadêmica e técnica",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="9" r="5" />
        <path d="m9 13-1 8 4-2 4 2-1-8" />
      </svg>
    ),
  },
];

export function WhyLumiere() {
  return (
    <section className="bg-[#f8faf8] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27877d]">
            Propósito
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#071a2b] sm:text-4xl">
            Por que o Lumière importa?
          </h2>

          <p className="mt-10 max-w-xl text-base leading-8 text-[#334b49] sm:text-lg">
            Transformamos conhecimento acadêmico em soluções para problemas
            urbanos reais, aproximando tecnologia, sustentabilidade e
            desenvolvimento regional.
          </p>

          <Link
            href="/sobre"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#2d887e] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#247369] sm:text-base"
          >
            Conheça nossa história
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <article
              key={value.title}
              className="flex min-h-32 flex-col justify-center rounded-2xl border border-black/5 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
            >
              <div className="text-[#3da64b]">{value.icon}</div>

              <h3 className="mt-4 text-sm font-semibold leading-6 text-[#071a2b]">
                {value.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}