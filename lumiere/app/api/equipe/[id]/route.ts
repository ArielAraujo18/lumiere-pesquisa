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

    const member = await db
      .collection("equipe")
      .findOne({ _id: new ObjectId(id) });

    if (!member) {
      return NextResponse.json(
        { error: "Membro não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json(normalize(member));
  } catch (error) {
    console.error("Erro ao buscar membro:", error);
    return NextResponse.json(
      { error: "Não foi possível buscar o membro." },
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

    if (!body.name?.trim() || !body.role?.trim()) {
      return NextResponse.json(
        { error: "Nome e função são obrigatórios." },
        { status: 400 },
      );
    }

    const update = {
      name: body.name.trim(),
      role: body.role.trim(),
      group: body.group || "Outros",
      bio: body.bio || "",
      email: body.email || "",
      photoUrl: body.photoUrl || "",
      lattesUrl: body.lattesUrl || "",
      linkedinUrl: body.linkedinUrl || "",
      status: body.status === "Inativo" ? "Inativo" : "Ativo",
      order: Number(body.order || 0),
      updatedAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const result = await db.collection("equipe").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { error: "Membro não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json(normalize(result));
  } catch (error) {
    console.error("Erro ao atualizar membro:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o membro." },
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
      .collection("equipe")
      .deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: "Membro não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir membro:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o membro." },
      { status: 500 },
    );
  }
}
