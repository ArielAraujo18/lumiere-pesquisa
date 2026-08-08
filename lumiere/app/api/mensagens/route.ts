import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

function normalize(doc: Record<string, any>) {
  return { ...doc, id: doc._id.toString(), _id: undefined };
}

function getString(body: Record<string, any>, ...keys: string[]) {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const messages = await db
      .collection("mensagens")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(messages.map(normalize));
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);

    return NextResponse.json(
      {
        error: "Não foi possível buscar as mensagens.",
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

    const name = getString(body, "name", "nome");
    const email = getString(body, "email");
    const phone = getString(body, "phone", "telefone");
    const subject = getString(body, "subject", "assunto") || "Contato pelo site";
    const message = getString(body, "message", "mensagem");

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nome, e-mail e mensagem são obrigatórios." },
        { status: 400 },
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { error: "Informe um e-mail válido." },
        { status: 400 },
      );
    }

    const now = new Date();

    const document = {
      name,
      email,
      phone,
      subject,
      message,
      status: "Nova",
      createdAt: now,
      updatedAt: now,
      readAt: null,
      respondedAt: null,
    };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");
    const result = await db.collection("mensagens").insertOne(document);

    return NextResponse.json(
      {
        ok: true,
        id: result.insertedId.toString(),
        message: "Mensagem enviada com sucesso.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao receber mensagem:", error);

    return NextResponse.json(
      { error: "Não foi possível enviar a mensagem." },
      { status: 500 },
    );
  }
}
