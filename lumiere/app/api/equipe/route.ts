import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

function normalize(doc: Record<string, any>) {
  const { _id, ...data } = doc;

  return {
    ...data,
    id: _id.toString(),
    photo: doc.photoUrl ?? "",
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
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();

    if (!name || !role) {
      return NextResponse.json(
        { error: "Nome e função são obrigatórios." },
        { status: 400 },
      );
    }

    const photo = formData.get("photo");

    let photoUrl = "";

    if (photo instanceof File && photo.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          { error: "A foto deve ser JPG, PNG ou WebP." },
          { status: 400 },
        );
      }

      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "A foto deve ter no máximo 5 MB." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(
        await photo.arrayBuffer(),
      );

      photoUrl =
        `data:${photo.type};base64,` +
        buffer.toString("base64");
    }

    const now = new Date();

    const document = {
      name,
      role,

      group:
        String(formData.get("group") ?? "").trim() ||
        "Outros",

      bio:
        String(formData.get("bio") ?? "").trim(),

      email:
        String(formData.get("email") ?? "").trim(),

      photoUrl,

      lattesUrl:
        String(formData.get("lattesUrl") ?? "").trim(),

      linkedinUrl:
        String(formData.get("linkedinUrl") ?? "").trim(),

      status:
        formData.get("status") === "Inativo"
          ? "Inativo"
          : "Ativo",

      order: Number(
        formData.get("order") ?? 0,
      ),

      createdAt: now,
      updatedAt: now,
    };

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "lumi",
    );

    const result = await db
      .collection("equipe")
      .insertOne(document);

    return NextResponse.json(
      {
        ...document,
        id: result.insertedId.toString(),
        photo: photoUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar membro:", error);

    return NextResponse.json(
      {
        error: "Não foi possível criar o membro.",
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