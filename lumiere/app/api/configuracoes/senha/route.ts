import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Preencha todos os campos de senha." },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "A nova senha deve ter pelo menos 8 caracteres." },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "A confirmação da nova senha não confere." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          "A troca de senha precisa ser conectada ao método de autenticação atual do painel.",
        code: "AUTH_INTEGRATION_REQUIRED",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("Erro ao alterar senha:", error);

    return NextResponse.json(
      { error: "Não foi possível processar a alteração de senha." },
      { status: 500 },
    );
  }
}
