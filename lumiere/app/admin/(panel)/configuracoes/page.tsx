"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  Globe2,
  AtSign,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
} from "lucide-react";
import type { SiteSettings } from "@/types/settings";

const initialSettings: SiteSettings = {
  groupName: "Grupo Lumière",
  primaryEmail: "",
  secondaryEmail: "",
  instagram: "",
  location: "UFERSA Campus Angicos, RN",
  phone: "",
  website: "",
};

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#071a2b] outline-none transition placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#334b49]">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/configuracoes", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.details ||
              data.error ||
              "Não foi possível carregar as configurações.",
          );
        }

        setSettings({
          groupName: data.groupName || "",
          primaryEmail: data.primaryEmail || "",
          secondaryEmail: data.secondaryEmail || "",
          instagram: data.instagram || "",
          location: data.location || "",
          phone: data.phone || "",
          website: data.website || "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar configurações.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function update(field: keyof SiteSettings, value: string) {
    setSaved(false);
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const response = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Não foi possível salvar as configurações.",
        );
      }

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar configurações.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setChangingPassword(true);
      setPasswordError("");
      setPasswordSaved(false);

      if (newPassword.length < 8) {
        throw new Error("A nova senha deve ter pelo menos 8 caracteres.");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("A confirmação da nova senha não confere.");
      }

      const response = await fetch("/api/configuracoes/senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível alterar a senha.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Erro ao alterar senha.",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#27877d]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f7] text-[#071a2b]">
      <header className="flex min-h-[68px] items-center border-b border-black/5 bg-white px-5 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold">Configurações</h1>
          <p className="mt-0.5 hidden text-xs text-[#7b8b89] sm:block">
            Informações gerais e segurança do painel.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 p-5 sm:p-8">
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-7 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5f3] text-[#27877d]">
              <Settings2 size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Informações do grupo
              </h2>
              <p className="mt-1 text-sm text-[#71817f]">
                Dados institucionais usados pelo site.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Nome do grupo">
                <input
                  required
                  value={settings.groupName}
                  onChange={(e) => update("groupName", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="E-mail principal">
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
                />
                <input
                  type="email"
                  value={settings.primaryEmail}
                  onChange={(e) => update("primaryEmail", e.target.value)}
                  placeholder="contato@ufersa.edu.br"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            <Field label="E-mail secundário">
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
                />
                <input
                  type="email"
                  value={settings.secondaryEmail}
                  onChange={(e) => update("secondaryEmail", e.target.value)}
                  placeholder="grupo@ufersa.edu.br"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            <Field label="Instagram">
              <div className="relative">
                <AtSign
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
                />
                <input
                  value={settings.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                  placeholder="@grupolumiere"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            <Field label="Telefone / WhatsApp">
              <div className="relative">
                <Phone
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
                />
                <input
                  value={settings.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(84) 00000-0000"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            <Field label="Localização">
              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
                />
                <input
                  value={settings.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="UFERSA Campus Angicos, RN"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            <Field label="Website">
              <div className="relative">
                <Globe2
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
                />
                <input
                  value={settings.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {saved && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={17} />
              Informações salvas com sucesso.
            </div>
          )}

          <button
            disabled={saving}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#3c9b4a] px-5 text-sm font-medium text-white transition hover:bg-[#348840] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            Salvar informações
          </button>
        </form>

        <form
          onSubmit={handlePassword}
          className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-7 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5f3] text-[#27877d]">
              <LockKeyhole size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Alterar senha</h2>
              <p className="mt-1 text-sm text-[#71817f]">
                Atualize a senha usada para entrar no painel.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Senha atual">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => {
                  setPasswordSaved(false);
                  setCurrentPassword(e.target.value);
                }}
                className={inputClass}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nova senha">
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setPasswordSaved(false);
                    setNewPassword(e.target.value);
                  }}
                  className={inputClass}
                />
              </Field>

              <Field label="Confirmar nova senha">
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setPasswordSaved(false);
                    setConfirmPassword(e.target.value);
                  }}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {passwordError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {passwordError}
            </div>
          )}

          {passwordSaved && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={17} />
              Senha alterada com sucesso.
            </div>
          )}

          <button
            disabled={changingPassword}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#27877d] px-5 text-sm font-medium text-white transition hover:bg-[#21766d] disabled:opacity-60"
          >
            {changingPassword ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <LockKeyhole size={17} />
            )}
            Alterar senha
          </button>
        </form>
      </div>
    </main>
  );
}
