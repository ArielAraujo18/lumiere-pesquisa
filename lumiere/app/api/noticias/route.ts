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
      const body = (await request.json()) as NewsPayload;

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

      const client = await clientPromise;
      const database = client.db(process.env.MONGODB_DB);
      const collection = database.collection("noticias");

      const baseSlug = createSlug(body.title);
      const existingNews = await collection.findOne({ slug: baseSlug });

      const slug = existingNews
        ? `${baseSlug}-${Date.now()}`
        : baseSlug;

      const now = new Date();

      const document = {
        title: body.title.trim(),
        summary: body.summary.trim(),
        content: body.content.trim(),
        category: body.category.trim(),
        author: body.author.trim(),
        status: body.status === "Publicado" ? "Publicado" : "Rascunho",
        publishedAt: body.date
          ? new Date(`${body.date}T12:00:00.000Z`)
          : now,
        slug,
        imageUrl: null,
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