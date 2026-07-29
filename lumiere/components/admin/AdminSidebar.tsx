"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  Globe2,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type AdminLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const links: AdminLink[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Notícias",
    href: "/admin/noticias",
    icon: Newspaper,
  },
  {
    label: "Projetos",
    href: "/admin/projetos",
    icon: FolderKanban,
  },
  {
    label: "Publicações",
    href: "/admin/publicacoes",
    icon: BookOpen,
  },
  {
    label: "Equipe",
    href: "/admin/equipe",
    icon: Users,
  },
  {
    label: "Galeria",
    href: "/admin/galeria",
    icon: Images,
  },
  {
    label: "Mensagens",
    href: "/admin/mensagens",
    icon: MessageSquare,
  },
  {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-lg bg-[#063b3a] text-white lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#063b3a] text-[#8fb8ae] transition-transform lg:sticky lg:top-0 lg:h-screen ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <Image
            src="/logo/LumiereChamas.png"
            alt="Grupo Lumière"
            width={38}
            height={38}
            className="object-contain"
          />

          <div>
            <p className="text-sm font-bold text-white">Grupo Lumière</p>
            <p className="text-xs">Painel Admin</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto flex h-9 w-9 items-center justify-center text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-white/10 hover:text-white"
              >
                <Icon size={19} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10 hover:text-white"
          >
            <Globe2 size={19} strokeWidth={1.8} />
            Ver site público
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} strokeWidth={1.8} />
            Sair
          </Link>
        </div>
      </aside>
    </>
  );
}