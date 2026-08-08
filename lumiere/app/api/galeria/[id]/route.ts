import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

function normalize(doc: Record<string, any>) {
  return {
    ...doc,
    id: doc._id.toString(),
    _id: undefined,
  };
}

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const item = await db
      .collection("galeria")
      .findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json(
        { error: "Foto não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(normalize(item));
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    return NextResponse.json(
      { error: "Não foi possível buscar a foto." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "O título da foto é obrigatório." },
        { status: 400 },
      );
    }

    if (!body.imageUrl) {
      return NextResponse.json(
        { error: "A imagem é obrigatória." },
        { status: 400 },
      );
    }

    const update = {
      title: body.title.trim(),
      category: body.category || "Outros",
      description: body.description || "",
      imageUrl: body.imageUrl,
      status: body.status === "Rascunho" ? "Rascunho" : "Publicado",
      order: Number(body.order || 0),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const result = await db.collection("galeria").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { error: "Foto não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(normalize(result));
  } catch (error) {
    console.error("Erro ao atualizar foto:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar a foto." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const result = await db
      .collection("galeria")
      .deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: "Foto não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a foto." },
      { status: 500 },
    );
  }
}
