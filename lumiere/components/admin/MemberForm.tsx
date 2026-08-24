"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Cropper, {
  type Area,
} from "react-easy-crop";
import {
  Camera,
  ImagePlus,
  Link2,
  Mail,
  UserRound,
  X,
} from "lucide-react";

import type { MemberPayload } from "@/types/member";

type Props = {
  value: MemberPayload;
  onChange: (value: MemberPayload) => void;
  photo: File | null;
  onPhotoChange: (file: File | null) => void;
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
  photo,
  onPhotoChange,
  disabled = false,
}: Props) {
  const galleryInputRef =
    useRef<HTMLInputElement>(null);

  const cameraInputRef =
    useRef<HTMLInputElement>(null);

  const [sourceImage, setSourceImage] =
    useState<string | null>(null);

  const [preview, setPreview] =
    useState<string | null>(
      value.photoUrl || null,
    );

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [cropOpen, setCropOpen] =
    useState(false);

  useEffect(() => {
    return () => {
      if (
        sourceImage?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(sourceImage);
      }

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [sourceImage, preview]);

  const update =
    (field: keyof MemberPayload) =>
    (
      event: ChangeEvent<
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
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

  function selectPhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      window.alert(
        "Selecione uma imagem JPG, PNG ou WebP.",
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert(
        "A imagem original deve ter no máximo 10 MB.",
      );
      return;
    }

    if (
      sourceImage?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(sourceImage);
    }

    const url = URL.createObjectURL(file);

    setSourceImage(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropOpen(true);
  }

  async function confirmCrop() {
    if (
      !sourceImage ||
      !croppedAreaPixels
    ) {
      return;
    }

    try {
      const croppedFile =
        await createCroppedFile(
          sourceImage,
          croppedAreaPixels,
        );

      onPhotoChange(croppedFile);

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setPreview(
        URL.createObjectURL(croppedFile),
      );

      setCropOpen(false);
    } catch (error) {
      console.error(error);

      window.alert(
        "Não foi possível processar a foto.",
      );
    }
  }

  function removePhoto() {
    onPhotoChange(null);

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    onChange({
      ...value,
      photoUrl: "",
    });
  }

  return (
    <>
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
                  onChange={update(
                    "linkedinUrl",
                  )}
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

          <div>
            <span className="mb-3 block text-sm font-medium text-[#334b49]">
              Foto do membro
            </span>

            <div className="rounded-2xl border border-dashed border-[#a9cfca] bg-[#f8fbfa] p-5">
              <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#eaf2f1]">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt={
                      value.name ||
                      "Prévia do membro"
                    }
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <UserRound
                    size={44}
                    className="text-[#78a9a4]"
                  />
                )}
              </div>

              <p className="mt-4 text-center text-sm font-medium text-[#334b49]">
                {value.name ||
                  "Prévia do membro"}
              </p>

              <p className="text-center text-xs text-[#6f8180]">
                {value.role || "Função"}
              </p>

              {photo && (
                <p className="mt-2 truncate text-center text-xs text-[#7b8b89]">
                  {photo.name}
                </p>
              )}

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#27877d] px-4 text-sm font-medium text-white transition hover:bg-[#21766d] disabled:opacity-50"
                >
                  <ImagePlus size={17} />
                  Selecionar foto
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#27877d]/20 bg-white px-4 text-sm font-medium text-[#27877d] transition hover:bg-[#edf7f4] disabled:opacity-50"
                >
                  <Camera size={17} />
                  Tirar foto
                </button>

                {preview && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={removePhoto}
                    className="h-9 text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    Remover foto
                  </button>
                )}
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={selectPhoto}
              />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="sr-only"
                onChange={selectPhoto}
              />
            </div>
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

      {cropOpen && sourceImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div>
                <h2 className="font-semibold text-[#071a2b]">
                  Ajustar foto
                </h2>

                <p className="text-xs text-[#6f8180]">
                  Arraste a imagem e ajuste o zoom.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCropOpen(false)
                }
                className="rounded-lg p-2 hover:bg-black/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative h-[420px] bg-black">
              <Cropper
                image={sourceImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(
                  _,
                  croppedPixels,
                ) =>
                  setCroppedAreaPixels(
                    croppedPixels,
                  )
                }
              />
            </div>

            <div className="p-5">
              <label className="text-sm font-medium text-[#334b49]">
                Zoom
              </label>

              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(event) =>
                  setZoom(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                className="mt-3 w-full accent-[#27877d]"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCropOpen(false)
                  }
                  className="h-10 rounded-xl border border-black/10 px-5 text-sm"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void confirmCrop()
                  }
                  className="h-10 rounded-xl bg-[#27877d] px-5 text-sm font-medium text-white hover:bg-[#21766d]"
                >
                  Usar esta foto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

async function createCroppedFile(
  imageSource: string,
  crop: Area,
): Promise<File> {
  const image = await loadImage(
    imageSource,
  );

  const canvas =
    document.createElement("canvas");

  const size = 1000;

  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Não foi possível criar a imagem.",
    );
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size,
    size,
  );

  const blob = await new Promise<Blob>(
    (resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(
              new Error(
                "Não foi possível processar a imagem.",
              ),
            );
          }
        },
        "image/jpeg",
        0.92,
      );
    },
  );

  return new File(
    [blob],
    `membro-${Date.now()}.jpg`,
    {
      type: "image/jpeg",
    },
  );
}

function loadImage(
  src: string,
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image = new Image();

      image.onload = () =>
        resolve(image);

      image.onerror = () =>
        reject(
          new Error(
            "Não foi possível carregar a imagem.",
          ),
        );

      image.src = src;
    },
  );
}