"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Mail,
  MailCheck,
  RefreshCw,
  Reply,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { ContactMessage, MessageStatus } from "@/types/message";

function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function statusClass(status: MessageStatus) {
  if (status === "Nova") return "bg-green-50 text-green-700";
  if (status === "Respondida") return "bg-[#eaf3f2] text-[#27877d]";
  return "bg-[#f0f2f1] text-[#687775]";
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/mensagens", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Erro ao buscar mensagens.");
      }

      setMessages(data);

      if (selected) {
        const updated = data.find(
          (message: ContactMessage) => message.id === selected.id,
        );
        setSelected(updated || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar mensagens.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newCount = messages.filter((message) => message.status === "Nova").length;

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return messages;

    return messages.filter((message) =>
      [message.name, message.email, message.subject, message.message, message.status]
        .join(" ")
        .toLowerCase()
        .includes(text),
    );
  }, [messages, query]);

  async function updateStatus(message: ContactMessage, status: MessageStatus) {
    const response = await fetch(`/api/mensagens/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Não foi possível atualizar a mensagem.");
      return null;
    }

    setMessages((current) =>
      current.map((item) => (item.id === message.id ? data : item)),
    );

    setSelected((current) => (current?.id === message.id ? data : current));

    return data as ContactMessage;
  }

  async function openMessage(message: ContactMessage) {
    setSelected(message);

    if (message.status === "Nova") {
      const updated = await updateStatus(message, "Lida");
      if (updated) setSelected(updated);
    }
  }

  async function handleDelete(message: ContactMessage) {
    if (!window.confirm(`Excluir a mensagem de "${message.name}"?`)) return;

    const response = await fetch(`/api/mensagens/${message.id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.error || "Não foi possível excluir a mensagem.");
      return;
    }

    setMessages((current) => current.filter((item) => item.id !== message.id));

    if (selected?.id === message.id) setSelected(null);
  }

  async function reply(message: ContactMessage) {
    await updateStatus(message, "Respondida");
    const subject = encodeURIComponent(`Re: ${message.subject}`);
    window.location.href = `mailto:${message.email}?subject=${subject}`;
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center justify-between border-b border-black/5 bg-white px-5 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold">Mensagens Recebidas</h1>
          <p className="mt-0.5 text-xs text-[#7b8b89]">
            {newCount} {newCount === 1 ? "mensagem nova" : "mensagens novas"}
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-[#506260] hover:bg-[#f5f8f7]"
          title="Atualizar"
        >
          <RefreshCw size={17} />
        </button>
      </header>

      <div className="p-5 sm:p-8">
        <div className="relative mb-5 max-w-sm">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#72a29d]"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar mensagens..."
            className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8b9998] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10"
          />
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="animate-spin text-[#27877d]" />
            </div>
          ) : filtered.length ? (
            <div className="divide-y divide-black/5">
              {filtered.map((message) => (
                <button
                  type="button"
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className="grid w-full gap-3 px-5 py-5 text-left transition hover:bg-[#f9fbfa] md:grid-cols-[minmax(180px,240px)_minmax(0,1fr)_150px] md:px-6"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        message.status === "Nova" ? "bg-[#43a854]" : "bg-[#c2cdcb]"
                      }`}
                    />

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm ${
                          message.status === "Nova" ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {message.name}
                      </p>
                      <p className="truncate text-xs text-[#70a49e]">
                        {message.email}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm ${
                        message.status === "Nova" ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-[#7c9c98]">
                      {message.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                    <span className="text-xs text-[#6e9994]">
                      {formatDate(message.createdAt)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                        message.status,
                      )}`}
                    >
                      {message.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Mail size={32} className="mx-auto text-[#91aaa7]" />
              <p className="mt-3 text-sm text-[#607271]">Nenhuma mensagem encontrada.</p>
            </div>
          )}
        </section>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <aside className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{selected.subject}</p>
                <p className="mt-1 text-xs text-[#7b8b89]">{formatDate(selected.createdAt)}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#60716f] hover:bg-[#f1f5f4]"
              >
                <X size={19} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-2xl bg-[#f7faf9] p-4">
                <p className="font-semibold">{selected.name}</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="mt-1 block text-sm text-[#27877d] hover:underline"
                >
                  {selected.email}
                </a>
                {selected.phone && (
                  <p className="mt-1 text-sm text-[#657674]">{selected.phone}</p>
                )}
              </div>

              <div className="mt-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#344846]">
                  {selected.message}
                </p>
              </div>
            </div>

            <footer className="flex flex-wrap items-center gap-3 border-t border-black/5 bg-[#fbfcfc] p-5 sm:p-6">
              <button
                onClick={() => reply(selected)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#27877d] px-5 text-sm font-medium text-white hover:bg-[#21766d]"
              >
                <Reply size={17} />
                Responder por e-mail
              </button>

              {selected.status !== "Respondida" && (
                <button
                  onClick={() => updateStatus(selected, "Respondida")}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-[#435452] hover:bg-[#f5f8f7]"
                >
                  <MailCheck size={17} />
                  Marcar respondida
                </button>
              )}

              {selected.status === "Nova" && (
                <button
                  onClick={() => updateStatus(selected, "Lida")}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-[#435452] hover:bg-[#f5f8f7]"
                >
                  <Check size={17} />
                  Marcar lida
                </button>
              )}

              <button
                onClick={() => handleDelete(selected)}
                className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                title="Excluir"
              >
                <Trash2 size={17} />
              </button>
            </footer>
          </aside>
        </div>
      )}
    </main>
  );
}
