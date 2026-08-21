import clientPromise from "@/lib/mongodb";
import type {
  PublicationPayload,
  PublicationStatus,
  PublicationType,
} from "@/types/publication";

export const runtime = "nodejs";

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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");

    const publications = await db
      .collection("publicacoes")
      .find({})
      .sort({ year: -1, createdAt: -1 })
      .toArray();

    return Response.json(publications.map(serializePublication));
  } catch (error) {
    console.error("Erro ao buscar publicações:", error);

    return Response.json(
      {
        error: "Não foi possível buscar as publicações.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<PublicationPayload>;
    const validationError = validatePayload(payload);

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const collection = db.collection("publicacoes");

    const baseSlug = slugify(payload.title!);
    const existingSlug = await collection.findOne({ slug: baseSlug });
    const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;
    const now = new Date();

    const publication = {
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
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(publication);

    return Response.json(
      { id: result.insertedId.toString(), ...publication },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar publicação:", error);

    return Response.json(
      {
        error: "Não foi possível criar a publicação.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}
