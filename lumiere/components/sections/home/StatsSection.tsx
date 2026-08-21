const stats = [
  {
    value: "+10",
    label: "projetos desenvolvidos",
  },
  {
    value: "+20",
    label: "membros envolvidos",
  },
  {
    value: "+15",
    label: "publicações e eventos",
  },
  {
    value: "+5",
    label: "ações de extensão",
  },
];

export function StatsSection() {
  return (
    <section className="bg-[#245f52] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <strong className="block text-4xl font-bold text-[#45a84d] sm:text-5xl lg:text-6xl">
              {stat.value}
            </strong>

            <p className="mt-3 text-sm text-[#8fc0ae]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}