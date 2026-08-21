import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#073e3b] to-[#215f52] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#43a548]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
          Quer conhecer, participar ou propor uma parceria?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#9bc7b7] sm:text-lg">
          Fale com o Grupo Lumière e construa o futuro das cidades conosco.
        </p>

        <Link
          href="/contato"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-xl bg-[#43a548] px-8 py-4 text-sm font-semibold transition-colors hover:bg-[#39913e] sm:text-base"
        >
          Fale com o grupo
        </Link>
      </div>
    </section>
  );
}