import { jwtVerify, SignJWT } from "jose";
import { env } from "@/config/env";

const enc = new TextEncoder();

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.jwtExpiresIn)
    .sign(enc.encode(env.jwtSecret));
}

export async function verifyAccessToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(env.jwtSecret),
  );
  if (!payload.sub) {
    throw new Error("Unauthorized. Invalid token payload");
  }
  return payload.sub;
}
