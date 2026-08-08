import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

function normalize(doc: Record<string, any>) {
  return { ...doc, id: doc._id.toString(), _id: undefined };
}

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");
    const message = await db.collection("mensagens").findOne({ _id: new ObjectId(id) });

    if (!message) {
      return NextResponse.json({ error: "Mensagem não encontrada." }, { status: 404 });
    }

    return NextResponse.json(normalize(message));
  } catch (error) {
    console.error("Erro ao buscar mensagem:", error);
    return NextResponse.json(
      { error: "Não foi possível buscar a mensagem." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();
    const requestedStatus = body.status;

    if (!["Nova", "Lida", "Respondida"].includes(requestedStatus)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    const now = new Date();
    const set: Record<string, any> = {
      status: requestedStatus,
      updatedAt: now,
    };

    if (requestedStatus === "Lida") set.readAt = now;
    if (requestedStatus === "Respondida") {
      set.readAt = now;
      set.respondedAt = now;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const result = await db.collection("mensagens").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Mensagem não encontrada." }, { status: 404 });
    }

    return NextResponse.json(normalize(result));
  } catch (error) {
    console.error("Erro ao atualizar mensagem:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar a mensagem." },
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
    const result = await db.collection("mensagens").deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Mensagem não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir mensagem:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a mensagem." },
      { status: 500 },
    );
  }
}
