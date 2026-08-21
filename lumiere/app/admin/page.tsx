"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
export default function AdminLoginPage() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#073e3b] via-[#14564d] to-[#287263]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "75px 75px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[60%] items-end justify-center gap-4 opacity-[0.06]">
        <div className="h-[55%] w-24 bg-white" />
        <div className="h-[75%] w-28 bg-white" />
        <div className="h-[45%] w-20 bg-white" />
        <div className="h-[85%] w-32 bg-white" />
        <div className="h-[65%] w-28 bg-white" />
        <div className="h-[50%] w-24 bg-white" />
      </div>

      <Link
        href="/"
        className="absolute left-5 top-5 z-20 text-sm font-medium text-[#9bc7b7] transition hover:text-white sm:left-8 sm:top-7"
      >
        ← Voltar ao site
      </Link>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <section className="w-full max-w-[420px] rounded-3xl bg-white px-6 py-10 shadow-2xl sm:px-10 sm:py-12">
          <header className="text-center">
            <Image
              src="/logo/LumiereChamas.png"
              alt="Logo do Grupo Lumière"
              width={64}
              height={64}
              className="mx-auto object-contain"
              priority
            />

            <h1 className="mt-4 text-2xl font-bold text-[#071a2b]">
              Área Administrativa
            </h1>

            <p className="mt-1 text-sm text-[#72ad99]">
              Grupo Lumière · UFERSA Angicos
            </p>
          </header>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#334b49]"
              >
                E-mail institucional
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nome@ufersa.edu.br"
                required
                className="h-12 w-full rounded-xl border border-black/15 px-4 text-sm text-[#071a2b] outline-none transition placeholder:text-gray-400 focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#334b49]"
              >
                Senha
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="h-12 w-full rounded-xl border border-black/15 px-4 text-sm text-[#071a2b] outline-none transition placeholder:text-gray-400 focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/15"
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#43a548] text-sm font-semibold text-white transition hover:bg-[#39913e]"
            >
              Entrar no painel
            </button>
          </form>

          <div className="mt-7 text-center">
            <Link
              href="#"
              className="text-sm text-[#72ad99] transition hover:text-[#27877d]"
            >
              Esqueci minha senha
            </Link>
          </div>
        </section>

        <p className="mt-7 text-center text-xs text-[#8fb8ae]">
          Acesso restrito a professores e administradores do Grupo Lumière
        </p>
      </div>
    </main>
  );
}