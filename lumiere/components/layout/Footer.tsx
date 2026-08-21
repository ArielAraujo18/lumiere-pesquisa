import Image from "next/image";
import Link from "next/link";
import { siteNavigation } from "@/lib/navigation";
import { greatVibes } from "@/app/(site)/layout";


export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#063b3a] px-4 py-14 text-[#8fc0ae] sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
                <Image
                src="/logo/LumiereChamas.png"
                alt="Logo do Grupo Lumière"
                width={58}
                height={58}
                className="object-contain"
                />

                <span className={greatVibes.className + " text-4xl font-semibold italic tracking-wide text-white"}>
                Lumière
                </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6">
                Grupo de pesquisa, estudo e extensão em Smart Cities da UFERSA Campus
                Angicos. Conectando universidade, tecnologia e sociedade.
            </p>
        </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#82c7ad]">
              Páginas
            </h2>

            <nav className="mt-5 flex flex-col gap-3">
              {siteNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit text-sm transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#82c7ad]">
              Contato
            </h2>

            <div className="mt-5 flex flex-col gap-4 text-sm">
              <a
                href="mailto:valquiria@ufersa.edu.br"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <MailIcon />
                valquiria@ufersa.edu.br
              </a>

              <a
                href="mailto:marcilio.correia@ufersa.edu.br"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <MailIcon />
                marcilio.correia@ufersa.edu.br
              </a>

              <a
                href="https://www.instagram.com/smartcampusufersa"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <InstagramIcon />
                @smartcampusufersa
              </a>

              <p className="flex items-center gap-3">
                <LocationIcon />
                UFERSA Campus Angicos, RN
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Grupo Lumière · UFERSA Campus Angicos
          </p>

          <Link
            href="/admin"
            className="w-fit transition-colors hover:text-white"
          >
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}