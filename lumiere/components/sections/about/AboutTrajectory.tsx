const timeline = [
  { year: "2020", description: "Fundação do grupo" },
  { year: "2021", description: "Primeiros projetos IoT" },
  { year: "2022", description: "Parceria com municípios" },
  { year: "2024", description: "Presença internacional" },
];

const researchAreas = [
  "Smart Cities",
  "Internet das Coisas",
  "Sustentabilidade",
  "Mobilidade Urbana",
  "Monitoramento Inteligente",
  "Dados Urbanos",
  "Tecnologia Aplicada à Sociedade",
];

export function AboutTrajectory() {
  return (
    <section className="bg-[#f8faf8] px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-2xl border border-black/5 bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.10)] sm:p-10 lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="text-2xl font-bold text-[#071a2b]">
              Nossa trajetória
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#526866]">
              Fundado na UFERSA Campus Angicos, o Grupo Lumière nasceu da
              convicção de que a pesquisa científica deve gerar impacto real no
              território onde é produzida. A escolha do nome — Lumière, “luz” em
              francês — traduz a missão de iluminar caminhos para cidades mais
              inteligentes e sustentáveis.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#526866]">
              Ao longo de sua atuação, o grupo consolidou parcerias com
              prefeituras, empresas e instituições de pesquisa, sempre com foco
              em soluções adaptadas à realidade do Nordeste brasileiro.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {timeline.map((item) => (
              <article
                key={item.year}
                className="rounded-xl bg-[#eef4f2] p-5"
              >
                <strong className="block text-2xl font-bold text-[#27877d]">
                  {item.year}
                </strong>

                <p className="mt-1 text-sm text-[#526866]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#071a2b]">
            Áreas de Atuação
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {researchAreas.map((area, index) => (
              <span
                key={area}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  index % 2 === 0
                    ? "border-[#27877d]/30 bg-[#e8f2f0] text-[#27877d]"
                    : "border-[#43a548]/30 bg-[#edf6ec] text-[#39913e]"
                }`}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}