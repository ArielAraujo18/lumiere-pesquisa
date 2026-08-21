import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

function normalize(doc: Record<string, any>) {
  return {
    ...doc,
    id: doc._id.toString(),
    _id: undefined,
  };
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const items = await db
      .collection("galeria")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json(items.map(normalize));
  } catch (error) {
    console.error("Erro ao buscar galeria:", error);

    return NextResponse.json(
      {
        error: "Não foi possível buscar a galeria.",
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
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "O título da foto é obrigatório." },
        { status: 400 },
      );
    }

    if (!body.imageUrl) {
      return NextResponse.json(
        { error: "Selecione uma imagem ou informe uma URL." },
        { status: 400 },
      );
    }

    const now = new Date();

    const document = {
      title: body.title.trim(),
      category: body.category || "Outros",
      description: body.description || "",
      imageUrl: body.imageUrl,
      status: body.status === "Rascunho" ? "Rascunho" : "Publicado",
      order: Number(body.order || 0),
      createdAt: now,
      updatedAt: now,
    };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");
    const result = await db.collection("galeria").insertOne(document);

    return NextResponse.json(
      {
        ...document,
        id: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar item da galeria:", error);

    return NextResponse.json(
      { error: "Não foi possível publicar a foto." },
      { status: 500 },
    );
  }
}
