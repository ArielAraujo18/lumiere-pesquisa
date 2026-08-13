import Link from "next/link";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { StatsSection } from "@/components/sections/home/StatsSection";
import { WhyLumiere } from "@/components/sections/home/WhyLumiere";
import { LatestNews } from "@/components/sections/home/LatestNews";
import { ContactCTA } from "@/components/sections/home/ContactCTA";

async function getNews() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/noticias`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function HomePage() {
  const news = await getNews();

  return (
    <main>
      <section className="relative min-h-[calc(100svh-72px)] overflow-hidden bg-gradient-to-br from-[#0a4542] via-[#14564d] to-[#287263] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "75px 75px",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[65%] items-end justify-center gap-4 opacity-10 md:flex">
          <div className="h-[55%] w-24 bg-[#55b86a]" />
          <div className="h-[72%] w-32 bg-[#55b86a]" />
          <div className="h-[45%] w-24 bg-[#55b86a]" />
          <div className="h-[82%] w-28 bg-[#55b86a]" />
          <div className="h-[60%] w-36 bg-[#55b86a]" />
          <div className="h-[75%] w-28 bg-[#55b86a]" />
          <div className="h-[50%] w-24 bg-[#55b86a]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto w-full max-w-4xl lg:mx-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#64c477]/30 bg-[#176451]/70 px-3 py-2 text-[11px] text-[#b7d6ca] sm:mb-8 sm:px-4 sm:text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />

              <span>UFERSA Campus Angicos · Grupo ativo</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Tecnologia, pesquisa e inovação para cidades mais inteligentes
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-[#b7cec6] sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl">
              O Grupo Lumière desenvolve estudos, projetos e ações de extensão
              em Smart Cities, conectando universidade, tecnologia e sociedade.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link
                href="/projetos"
                className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#43a548] px-6 py-4 text-sm font-semibold transition-colors hover:bg-[#39913e] sm:px-8 sm:text-base"
              >
                Conheça nossos projetos
                <span className="ml-3" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                href="/contato"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/30 px-6 py-4 text-sm font-semibold transition-colors hover:bg-white/10 sm:px-8 sm:text-base"
              >
                Fale conosco
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhatWeDo />
      <StatsSection />
      <WhyLumiere />
      <LatestNews news={news} />
      <ContactCTA />
    </main>
  );
}