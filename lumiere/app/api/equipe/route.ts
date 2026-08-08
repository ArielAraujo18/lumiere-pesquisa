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

    const members = await db
      .collection("equipe")
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json(members.map(normalize));
  } catch (error) {
    console.error("Erro ao buscar equipe:", error);
    return NextResponse.json(
      {
        error: "Não foi possível buscar a equipe.",
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

    if (!body.name?.trim() || !body.role?.trim()) {
      return NextResponse.json(
        { error: "Nome e função são obrigatórios." },
        { status: 400 },
      );
    }

    const now = new Date();
    const document = {
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
      createdAt: now,
      updatedAt: now,
    };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");
    const result = await db.collection("equipe").insertOne(document);

    return NextResponse.json(
      { ...document, id: result.insertedId.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return NextResponse.json(
      { error: "Não foi possível criar o membro." },
      { status: 500 },
    );
  }
}
