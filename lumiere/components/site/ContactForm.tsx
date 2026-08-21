"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#071a2b] outline-none placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSending(true);
      setError("");
      setSuccess(false);

      const response = await fetch("/api/mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível enviar a mensagem.");
      }

      setForm(initialForm);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium text-[#334b49]">Nome</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Seu nome"
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-[#334b49]">E-mail</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="voce@email.com"
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium text-[#334b49]">Telefone</span>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(00) 00000-0000"
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-[#334b49]">Assunto</span>
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Assunto da mensagem"
            className={inputClass}
          />
        </label>
      </div>

      <label>
        <span className="mb-2 block text-sm font-medium text-[#334b49]">Mensagem</span>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Escreva sua mensagem..."
          className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-[#071a2b] outline-none placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10"
        />
      </label>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={17} />
          Mensagem enviada com sucesso.
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#27877d] px-6 text-sm font-medium text-white transition hover:bg-[#21766d] disabled:opacity-60"
      >
        {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        Enviar mensagem
      </button>
    </form>
  );
}
