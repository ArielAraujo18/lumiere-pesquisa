import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { ProjectPayload, ProjectStatus } from "@/types/project";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const project = await db
      .collection("projetos")
      .findOne({ _id: new ObjectId(id) });

    if (!project) {
      return Response.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    return Response.json(serializeProject(project));
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);

    return Response.json(
      {
        error: "Não foi possível buscar o projeto.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const payload = (await request.json()) as Partial<ProjectPayload>;
    const validationError = validatePayload(payload);

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const collection = db.collection("projetos");
    const objectId = new ObjectId(id);

    const currentProject = await collection.findOne({ _id: objectId });

    if (!currentProject) {
      return Response.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    const baseSlug = slugify(payload.title!);
    const conflictingSlug = await collection.findOne({
      slug: baseSlug,
      _id: { $ne: objectId },
    });

    const update = {
      title: payload.title!.trim(),
      slug: conflictingSlug ? `${baseSlug}-${Date.now()}` : baseSlug,
      area: payload.area!.trim(),
      status: payload.status,
      responsible: payload.responsible!.trim(),
      summary: payload.summary!.trim(),
      description: payload.description!.trim(),
      startDate: new Date(payload.startDate!),
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      imageUrl: payload.imageUrl?.trim() ?? "",
      featured: Boolean(payload.featured),
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id: objectId }, { $set: update });
    const updatedProject = await collection.findOne({ _id: objectId });

    return Response.json(serializeProject(updatedProject!));
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);

    return Response.json(
      {
        error: "Não foi possível atualizar o projeto.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const result = await db
      .collection("projetos")
      .deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return Response.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir projeto:", error);

    return Response.json(
      {
        error: "Não foi possível excluir o projeto.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}
