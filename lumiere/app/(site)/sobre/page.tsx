import { AboutContent } from "@/components/sections/about/AboutContent";
import { AboutTrajectory } from "@/components/sections/about/AboutTrajectory";
export default function AboutPage() {
  return (
    <main>
      <section className="bg-gradient-to-r from-[#083f3d] to-[#245f52] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#82c7ad]">
            Conheça-nos
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Sobre o Grupo Lumière
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-[#9bc7b7] sm:text-lg">
            Pesquisa, estudo e extensão em Smart Cities na UFERSA Campus
            Angicos.
          </p>
        </div>
      </section>
      <AboutContent />
      <AboutTrajectory />
    </main>
  );
}