import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type {
  PublicationPayload,
  PublicationStatus,
  PublicationType,
} from "@/types/publication";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

const validStatuses: PublicationStatus[] = ["Publicado", "Rascunho"];
const validTypes: PublicationType[] = [
  "Artigo",
  "Evento",
  "Relatório",
  "Resumo",
  "Livro",
  "Capítulo",
  "Outro",
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function serializePublication(
  publication: Record<string, unknown> & { _id: { toString(): string } },
) {
  const { _id, ...data } = publication;
  return { id: _id.toString(), ...data };
}

function validatePayload(payload: Partial<PublicationPayload>) {
  const required: Array<keyof PublicationPayload> = [
    "title",
    "authors",
    "year",
    "type",
    "venue",
    "status",
  ];

  for (const field of required) {
    const value = payload[field];
    if (typeof value !== "string" || !value.trim()) {
      return `O campo ${field} é obrigatório.`;
    }
  }

  const year = Number(payload.year);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return "Ano inválido.";
  }

  if (!validTypes.includes(payload.type as PublicationType)) {
    return "Tipo inválido.";
  }

  if (!validStatuses.includes(payload.status as PublicationStatus)) {
    return "Status inválido.";
  }

  return null;
}

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const publication = await db
      .collection("publicacoes")
      .findOne({ _id: new ObjectId(id) });

    if (!publication) {
      return Response.json(
        { error: "Publicação não encontrada." },
        { status: 404 },
      );
    }

    return Response.json(serializePublication(publication));
  } catch (error) {
    console.error("Erro ao buscar publicação:", error);

    return Response.json(
      {
        error: "Não foi possível buscar a publicação.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const payload = (await request.json()) as Partial<PublicationPayload>;
    const validationError = validatePayload(payload);

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const collection = db.collection("publicacoes");
    const objectId = new ObjectId(id);

    const current = await collection.findOne({ _id: objectId });
    if (!current) {
      return Response.json(
        { error: "Publicação não encontrada." },
        { status: 404 },
      );
    }

    let slug = current.slug as string;
    if (current.title !== payload.title!.trim()) {
      const baseSlug = slugify(payload.title!);
      const existingSlug = await collection.findOne({
        slug: baseSlug,
        _id: { $ne: objectId },
      });
      slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;
    }

    const update = {
      title: payload.title!.trim(),
      slug,
      authors: payload.authors!.trim(),
      year: Number(payload.year),
      type: payload.type,
      venue: payload.venue!.trim(),
      status: payload.status,
      abstract: payload.abstract?.trim() ?? "",
      doi: payload.doi?.trim() ?? "",
      url: payload.url?.trim() ?? "",
      featured: Boolean(payload.featured),
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id: objectId }, { $set: update });

    const updated = await collection.findOne({ _id: objectId });
    return Response.json(serializePublication(updated!));
  } catch (error) {
    console.error("Erro ao atualizar publicação:", error);

    return Response.json(
      {
        error: "Não foi possível atualizar a publicação.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const result = await db
      .collection("publicacoes")
      .deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return Response.json(
        { error: "Publicação não encontrada." },
        { status: 404 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir publicação:", error);

    return Response.json(
      {
        error: "Não foi possível excluir a publicação.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}
