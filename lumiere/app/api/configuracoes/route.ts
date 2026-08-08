import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

const defaults = {
  groupName: "Grupo Lumière",
  primaryEmail: "",
  secondaryEmail: "",
  instagram: "",
  location: "UFERSA Campus Angicos, RN",
  phone: "",
  website: "",
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    const settings = await db
      .collection("configuracoes")
      .findOne({ key: "site" });

    return NextResponse.json({
      ...defaults,
      ...(settings || {}),
      _id: undefined,
      key: undefined,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);

    return NextResponse.json(
      {
        error: "Não foi possível buscar as configurações.",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const settings = {
      groupName: String(body.groupName || "").trim(),
      primaryEmail: String(body.primaryEmail || "").trim(),
      secondaryEmail: String(body.secondaryEmail || "").trim(),
      instagram: String(body.instagram || "").trim(),
      location: String(body.location || "").trim(),
      phone: String(body.phone || "").trim(),
      website: String(body.website || "").trim(),
      updatedAt: new Date(),
    };

    if (!settings.groupName) {
      return NextResponse.json(
        { error: "O nome do grupo é obrigatório." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "lumi");

    await db.collection("configuracoes").updateOne(
      { key: "site" },
      {
        $set: settings,
        $setOnInsert: {
          key: "site",
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      ok: true,
      settings,
    });
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);

    return NextResponse.json(
      { error: "Não foi possível salvar as configurações." },
      { status: 500 },
    );
  }
}
