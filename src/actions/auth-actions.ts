"use server";

import { compare } from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  setSessionCookie,
  deleteSessionCookie,
} from "@/lib/auth";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/rate-limit";

interface LoginResult {
  error?: string;
}

async function getClientIpAddress(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

export async function loginAction(
  _previousState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const password = formData.get("password");

  if (!password || typeof password !== "string") {
    return { error: "A senha é obrigatória" };
  }

  const ipAddress = await getClientIpAddress();
  const rateLimitResult = checkRateLimit(ipAddress);

  if (!rateLimitResult.allowed) {
    return {
      error: `Muitas tentativas. Tente novamente em ${rateLimitResult.retryAfterSeconds} segundos.`,
    };
  }

  const encodedHash = process.env.AUTH_PASSWORD_HASH;
  if (!encodedHash) {
    return { error: "Erro de configuração do servidor" };
  }

  const passwordHash = Buffer.from(encodedHash, "base64").toString("utf-8");
  const isValid = await compare(password, passwordHash);

  if (!isValid) {
    recordFailedAttempt(ipAddress);
    const remaining = rateLimitResult.remainingAttempts - 1;
    return {
      error:
        remaining > 0
          ? `Senha incorreta. ${remaining} tentativa${remaining === 1 ? "" : "s"} restante${remaining === 1 ? "" : "s"}.`
          : "Muitas tentativas. Tente novamente em 15 minutos.",
    };
  }

  resetAttempts(ipAddress);
  const token = await createSessionToken();
  await setSessionCookie(token);
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect("/login");
}
