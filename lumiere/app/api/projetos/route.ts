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

function serializeProject(
  project: Record<string, unknown> & {
    _id: { toString(): string };
  },
) {
  const { _id, ...data } = project;

  return {
    id: _id.toString(),
    ...data,

    // Compatibilidade com o componente público que usa project.image
    image:
      typeof project.imageUrl === "string"
        ? project.imageUrl
        : "",
  };
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

    return Response.json(
      projects.map(serializeProject),
    );
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);

    return Response.json(
      {
        error: "Não foi possível buscar os projetos.",
        details:
          process.env.NODE_ENV === "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Agora recebe FormData, não JSON
    const formData = await request.formData();

    const payload: Partial<ProjectPayload> = {
      title: String(formData.get("title") ?? ""),
      area: String(formData.get("area") ?? ""),
      status: String(
        formData.get("status") ?? "",
      ) as ProjectStatus,
      responsible: String(
        formData.get("responsible") ?? "",
      ),
      summary: String(formData.get("summary") ?? ""),
      description: String(
        formData.get("description") ?? "",
      ),
      startDate: String(
        formData.get("startDate") ?? "",
      ),
      endDate: String(
        formData.get("endDate") ?? "",
      ),
      featured: formData.get("featured") === "true",
    };

    const validationError = validatePayload(payload);

    if (validationError) {
      return Response.json(
        { error: validationError },
        { status: 400 },
      );
    }

    // IMAGEM
    const image = formData.get("image");

    let imageUrl = "";

    if (image instanceof File && image.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(image.type)) {
        return Response.json(
          {
            error: "A imagem deve ser JPG, PNG ou WebP.",
          },
          { status: 400 },
        );
      }

      if (image.size > 5 * 1024 * 1024) {
        return Response.json(
          {
            error: "A imagem deve ter no máximo 5 MB.",
          },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(
        await image.arrayBuffer(),
      );

      imageUrl = `data:${image.type};base64,${buffer.toString("base64")}`;
    }

    // DATAS
    const startDate = new Date(
      `${payload.startDate}T12:00:00.000Z`,
    );

    if (Number.isNaN(startDate.getTime())) {
      return Response.json(
        { error: "Data de início inválida." },
        { status: 400 },
      );
    }

    let endDate: Date | null = null;

    if (payload.endDate?.trim()) {
      endDate = new Date(
        `${payload.endDate}T12:00:00.000Z`,
      );

      if (Number.isNaN(endDate.getTime())) {
        return Response.json(
          { error: "Data de término inválida." },
          { status: 400 },
        );
      }
    }

    // BANCO
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB ?? "lumi");
    const collection = db.collection("projetos");

    const baseSlug = slugify(payload.title!);

    const existingSlug = await collection.findOne({
      slug: baseSlug,
    });

    const slug = existingSlug
      ? `${baseSlug}-${Date.now()}`
      : baseSlug;

    const now = new Date();

    const project = {
      title: payload.title!.trim(),
      slug,
      area: payload.area!.trim(),
      status: payload.status,
      responsible: payload.responsible!.trim(),
      summary: payload.summary!.trim(),
      description: payload.description!.trim(),

      startDate,
      endDate,

      imageUrl,

      featured: Boolean(payload.featured),

      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(project);

    return Response.json(
      {
        id: result.insertedId.toString(),
        ...project,

        // Para o frontend público
        image: imageUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar projeto:", error);

    return Response.json(
      {
        error: "Não foi possível criar o projeto.",
        details:
          process.env.NODE_ENV === "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}