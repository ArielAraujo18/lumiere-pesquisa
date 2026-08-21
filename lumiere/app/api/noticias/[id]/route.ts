import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB);

    const news = await database
      .collection("noticias")
      .findOne({ _id: new ObjectId(id) });

    if (!news) {
      return Response.json(
        { error: "Notícia não encontrada." },
        { status: 404 },
      );
    }

    return Response.json({
      ...news,
      id: news._id.toString(),
      _id: undefined,
    });
  } catch (error) {
    console.error("Erro ao buscar notícia:", error);

    return Response.json(
      { error: "Não foi possível buscar a notícia." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as NewsPayload;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

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

    const result = await database.collection("noticias").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: body.title.trim(),
          summary: body.summary.trim(),
          content: body.content.trim(),
          category: body.category.trim(),
          author: body.author.trim(),
          status:
            body.status === "Publicado" ? "Publicado" : "Rascunho",
          publishedAt: body.date
            ? new Date(`${body.date}T12:00:00.000Z`)
            : new Date(),
          slug: createSlug(body.title),
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Notícia não encontrada." },
        { status: 404 },
      );
    }

    return Response.json({ message: "Notícia atualizada." });
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);

    return Response.json(
      { error: "Não foi possível atualizar a notícia." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB);

    const result = await database
      .collection("noticias")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Notícia não encontrada." },
        { status: 404 },
      );
    }

    return Response.json({ message: "Notícia excluída." });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);

    return Response.json(
      { error: "Não foi possível excluir a notícia." },
      { status: 500 },
    );
  }
}   