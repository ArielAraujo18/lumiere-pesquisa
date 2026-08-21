"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { siteNavigation } from "@/lib/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="relative z-50 bg-[#063b3a] text-white">
      <nav className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={closeMenu}
        >
          <div className="relative h-11 w-11 shrink-0">
            <Image
              src="/logo/LumiereChamas.png"
              alt="Logo do Grupo Lumière"
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-bold leading-tight sm:text-base">
              Grupo Lumière
            </p>

            <p className="mt-1 hidden text-xs text-[#82c7ad] sm:block">
              Smart Cities · UFERSA Angicos
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {siteNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#c4d8d3] transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contato"
          className="hidden rounded-xl bg-[#43a548] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#39913e] lg:inline-flex"
        >
          Fale com o grupo
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 lg:hidden"
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 px-4 pb-5 pt-3 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {siteNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-[#c4d8d3] transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/contato"
              onClick={closeMenu}
              className="mt-3 rounded-xl bg-[#43a548] px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-[#39913e]"
            >
              Fale com o grupo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}