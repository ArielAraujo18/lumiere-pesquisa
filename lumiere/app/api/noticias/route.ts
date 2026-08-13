import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

type NewsPayload = {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  author?: string;
  date?: string;
  status?: "Publicado" | "Rascunho";
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB);

    const news = await database
      .collection("noticias")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(
      news.map((item) => ({
        ...item,
        id: item._id.toString(),
        _id: undefined,
      })),
    );
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);

    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    return Response.json(
      {
        error: "Não foi possível buscar as notícias.",
        details:
          process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const body: NewsPayload = {
      title: String(formData.get("title") || ""),
      summary: String(formData.get("summary") || ""),
      content: String(formData.get("content") || ""),
      category: String(formData.get("category") || ""),
      author: String(formData.get("author") || ""),
      date: String(formData.get("date") || ""),
      status:
        formData.get("status") === "Publicado"
          ? "Publicado"
          : "Rascunho",
    };

    const image = formData.get("image");

    if (
      !body.title?.trim() ||
      !body.summary?.trim() ||
      !body.content?.trim() ||
      !body.category?.trim() ||
      !body.author?.trim()
    ) {
      return Response.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 },
      );
    }

    let imageUrl: string | null = null;

    if (image instanceof File && image.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(image.type)) {
        return Response.json(
          { error: "A imagem deve ser JPG, PNG ou WEBP." },
          { status: 400 },
        );
      }

      if (image.size > 5 * 1024 * 1024) {
        return Response.json(
          { error: "A imagem deve ter no máximo 5 MB." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      imageUrl = `data:${image.type};base64,${buffer.toString("base64")}`;
    }

    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB);
    const collection = database.collection("noticias");

    const baseSlug = createSlug(body.title!);
    const existingNews = await collection.findOne({ slug: baseSlug });

    const slug = existingNews
      ? `${baseSlug}-${Date.now()}`
      : baseSlug;

    const now = new Date();

    const document = {
      title: body.title!.trim(),
      summary: body.summary!.trim(),
      content: body.content!.trim(),
      category: body.category!.trim(),
      author: body.author!.trim(),
      status:
        body.status === "Publicado"
          ? "Publicado"
          : "Rascunho",
      publishedAt: body.date
        ? new Date(`${body.date}T12:00:00.000Z`)
        : now,
      slug,
      imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);

    return Response.json(
      {
        message: "Notícia criada com sucesso.",
        id: result.insertedId.toString(),
        slug,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar notícia:", error);

    return Response.json(
      { error: "Não foi possível criar a notícia." },
      { status: 500 },
    );
  }
}