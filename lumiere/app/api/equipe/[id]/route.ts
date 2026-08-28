import {
  ObjectId,
  type Document,
} from "mongodb";
import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

function normalize(
  doc: Document & {
    _id: ObjectId;
  },
) {
  const { _id, ...data } = doc;

  return {
    ...data,
    id: _id.toString(),
  };
}

export async function GET(
  _request: Request,
  { params }: Context,
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "ID inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "lumi",
    );

    const member = await db
      .collection("equipe")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!member) {
      return NextResponse.json(
        {
          error: "Membro não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      normalize(member),
    );
  } catch (error) {
    console.error(
      "Erro ao buscar membro:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível buscar o membro.",
        details:
          process.env.NODE_ENV ===
            "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: Context,
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "ID inválido.",
        },
        {
          status: 400,
        },
      );
    }

    // AGORA RECEBE FORMDATA
    const formData =
      await request.formData();

    const name = String(
      formData.get("name") ?? "",
    ).trim();

    const role = String(
      formData.get("role") ?? "",
    ).trim();

    const group = String(
      formData.get("group") ?? "Outros",
    ).trim();

    const bio = String(
      formData.get("bio") ?? "",
    ).trim();

    const email = String(
      formData.get("email") ?? "",
    ).trim();

    const lattesUrl = String(
      formData.get("lattesUrl") ?? "",
    ).trim();

    const linkedinUrl = String(
      formData.get("linkedinUrl") ?? "",
    ).trim();

    const status =
      formData.get("status") === "Inativo"
        ? "Inativo"
        : "Ativo";

    const order = Number(
      formData.get("order") ?? 0,
    );

    const removePhoto =
      formData.get("removePhoto") === "true";

    if (!name || !role) {
      return NextResponse.json(
        {
          error:
            "Nome e função são obrigatórios.",
        },
        {
          status: 400,
        },
      );
    }

    if (Number.isNaN(order)) {
      return NextResponse.json(
        {
          error:
            "Ordem de exibição inválida.",
        },
        {
          status: 400,
        },
      );
    }

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "lumi",
    );

    const collection =
      db.collection("equipe");

    // BUSCA O MEMBRO ATUAL
    const currentMember =
      await collection.findOne({
        _id: new ObjectId(id),
      });

    if (!currentMember) {
      return NextResponse.json(
        {
          error: "Membro não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    // Mantém a foto que já existe
    let photoUrl =
      typeof currentMember.photoUrl ===
      "string"
        ? currentMember.photoUrl
        : "";

    // Se clicou em remover foto
    if (removePhoto) {
      photoUrl = "";
    }

    // NOVA FOTO
    const photo =
      formData.get("photo");

    if (
      photo instanceof File &&
      photo.size > 0
    ) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(photo.type)
      ) {
        return NextResponse.json(
          {
            error:
              "A foto deve ser JPG, PNG ou WebP.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        photo.size >
        5 * 1024 * 1024
      ) {
        return NextResponse.json(
          {
            error:
              "A foto deve ter no máximo 5 MB.",
          },
          {
            status: 400,
          },
        );
      }

      const buffer = Buffer.from(
        await photo.arrayBuffer(),
      );

      photoUrl =
        `data:${photo.type};base64,` +
        buffer.toString("base64");
    }

    const update = {
      name,
      role,
      group,
      bio,
      email,

      photoUrl,

      lattesUrl,
      linkedinUrl,

      status,
      order,

      updatedAt: new Date(),
    };

    const result =
      await collection.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: update,
        },
        {
          returnDocument: "after",
        },
      );

    if (!result) {
      return NextResponse.json(
        {
          error: "Membro não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      normalize(result),
    );
  } catch (error) {
    console.error(
      "Erro ao atualizar membro:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível atualizar o membro.",

        details:
          process.env.NODE_ENV ===
            "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Context,
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          error: "ID inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB || "lumi",
    );

    const result = await db
      .collection("equipe")
      .deleteOne({
        _id: new ObjectId(id),
      });

    if (!result.deletedCount) {
      return NextResponse.json(
        {
          error: "Membro não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "Erro ao excluir membro:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível excluir o membro.",

        details:
          process.env.NODE_ENV ===
            "development" &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      {
        status: 500,
      },
    );
  }
}