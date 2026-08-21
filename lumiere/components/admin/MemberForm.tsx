"use client";

import { ChangeEvent } from "react";
import { Image as ImageIcon, Link2, Mail, UserRound } from "lucide-react";
import type { MemberPayload } from "@/types/member";


type Props = {
  value: MemberPayload;
  onChange: (value: MemberPayload) => void;
  disabled?: boolean;
};

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#071a2b] outline-none transition placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

const textareaClass =
  "min-h-36 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-[#071a2b] outline-none transition placeholder:text-[#8a9a99] focus:border-[#27877d] focus:ring-2 focus:ring-[#27877d]/10";

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

export default function MemberForm({
  value,
  onChange,
  disabled = false,
}: Props) {
  const update =
    (field: keyof MemberPayload) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const nextValue =
        field === "order"
          ? Number(event.target.value || 0)
          : event.target.value;

      onChange({
        ...value,
        [field]: nextValue,
      });
    };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <h2 className="text-lg font-semibold text-[#071a2b]">
            Informações do membro
          </h2>
          <p className="mt-1 text-sm text-[#6f8180]">
            Dados exibidos na página pública da equipe.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nome completo">
            <div className="relative">
              <UserRound
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
              />
              <input
                required
                disabled={disabled}
                value={value.name}
                onChange={update("name")}
                placeholder="Ex.: Profa. Valquíria Silva"
                className={`${inputClass} pl-11`}
              />
            </div>
          </Field>

          <Field label="Função / cargo">
            <input
              required
              disabled={disabled}
              value={value.role}
              onChange={update("role")}
              placeholder="Ex.: Coordenadora"
              className={inputClass}
            />
          </Field>

          <Field label="Grupo">
            <select
              disabled={disabled}
              value={value.group}
              onChange={update("group")}
              className={inputClass}
            >
              <option>Coordenação</option>
              <option>Pesquisadores</option>
              <option>Bolsistas</option>
              <option>Colaboradores</option>
              <option>Voluntários</option>
              <option>Outros</option>
            </select>
          </Field>

          <Field label="E-mail">
            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
              />
              <input
                type="email"
                disabled={disabled}
                value={value.email}
                onChange={update("email")}
                placeholder="nome@ufersa.edu.br"
                className={`${inputClass} pl-11`}
              />
            </div>
          </Field>
        </div>

        <Field label="Biografia">
          <textarea
            disabled={disabled}
            value={value.bio}
            onChange={update("bio")}
            placeholder="Escreva uma breve apresentação, área de atuação e interesses de pesquisa..."
            className={textareaClass}
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Currículo Lattes">
            <div className="relative">
              <Link2
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
              />
              <input
                disabled={disabled}
                value={value.lattesUrl}
                onChange={update("lattesUrl")}
                placeholder="https://lattes.cnpq.br/..."
                className={`${inputClass} pl-11`}
              />
            </div>
          </Field>

          <Field label="LinkedIn">
            <div className="relative">
              <Link2
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
              />
              <input
                disabled={disabled}
                value={value.linkedinUrl}
                onChange={update("linkedinUrl")}
                placeholder="https://linkedin.com/in/..."
                className={`${inputClass} pl-11`}
              />
            </div>
          </Field>
        </div>
      </section>

      <aside className="h-fit space-y-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#071a2b]">
            Exibição
          </h2>
          <p className="mt-1 text-sm text-[#6f8180]">
            Foto, ordem e visibilidade no site.
          </p>
        </div>

        <Field label="URL da foto">
          <div className="relative">
            <ImageIcon
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#78a9a4]"
            />
            <input
              disabled={disabled}
              value={value.photoUrl}
              onChange={update("photoUrl")}
              placeholder="https://..."
              className={`${inputClass} pl-11`}
            />
          </div>
        </Field>

        <div className="overflow-hidden rounded-2xl border border-dashed border-[#a9cfca] bg-[#f8fbfa] p-5">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#eaf2f1]">
            {value.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value.photoUrl}
                alt={value.name || "Prévia do membro"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={38} className="text-[#78a9a4]" />
            )}
          </div>
          <p className="mt-3 text-center text-sm font-medium text-[#334b49]">
            {value.name || "Prévia do membro"}
          </p>
          <p className="text-center text-xs text-[#6f8180]">
            {value.role || "Função"}
          </p>
        </div>

        <Field label="Status">
          <select
            disabled={disabled}
            value={value.status}
            onChange={update("status")}
            className={inputClass}
          >
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
        </Field>

        <Field label="Ordem de exibição">
          <input
            type="number"
            min="0"
            disabled={disabled}
            value={value.order}
            onChange={update("order")}
            className={inputClass}
          />
        </Field>
      </aside>
    </div>
  );
}
