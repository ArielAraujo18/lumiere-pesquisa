import clientPromise from "@/lib/mongodb";
import type { ProjectPayload, ProjectStatus } from "@/types/project";

export const runtime = "nodejs";

const validStatuses: ProjectStatus[] = [
  "Planejado",
  "Em andamento",
  "Concluído",
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

function serializeProject(project: Record<string, unknown> & { _id: { toString(): string } }) {
  const { _id, ...data } = project;
  return { id: _id.toString(), ...data };
}

function validatePayload(payload: Partial<ProjectPayload>) {
  const requiredFields: Array<keyof ProjectPayload> = [
    "title",
    "area",
    "status",
    "responsible",
    "summary",
    "description",
    "startDate",
  ];

  for (const field of requiredFields) {
    const value = payload[field];
    if (typeof value !== "string" || !value.trim()) {
      return `O campo ${field} é obrigatório.`;
    }
  }

  if (!validStatuses.includes(payload.status as ProjectStatus)) {
    return "Status inválido.";
  }

  return null;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");

    const projects = await db
      .collection("projetos")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(projects.map(serializeProject));
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);

    return Response.json(
      {
        error: "Não foi possível buscar os projetos.",
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
    const payload = (await request.json()) as Partial<ProjectPayload>;
    const validationError = validatePayload(payload);

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const collection = db.collection("projetos");

    const baseSlug = slugify(payload.title!);
    const existingSlug = await collection.findOne({ slug: baseSlug });
    const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;
    const now = new Date();

    const project = {
      title: payload.title!.trim(),
      slug,
      area: payload.area!.trim(),
      status: payload.status,
      responsible: payload.responsible!.trim(),
      summary: payload.summary!.trim(),
      description: payload.description!.trim(),
      startDate: new Date(payload.startDate!),
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      imageUrl: payload.imageUrl?.trim() ?? "",
      featured: Boolean(payload.featured),
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(project);

    return Response.json(
      {
        id: result.insertedId.toString(),
        ...project,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar projeto:", error);

    return Response.json(
      {
        error: "Não foi possível criar o projeto.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}
