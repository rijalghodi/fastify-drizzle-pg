import { Type } from "@sinclair/typebox";

export const PublicUserSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  email: Type.String({ format: "email" }),
  name: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const AuthPayloadSchema = Type.Object({
  accessToken: Type.String(),
  user: PublicUserSchema,
});

export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
});

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 1 }),
});

export const ForgotBodySchema = Type.Object({
  email: Type.String({ format: "email" }),
});

export const ApiSuccessAuthSchema = Type.Object({
  ok: Type.Literal(true),
  message: Type.String(),
  data: AuthPayloadSchema,
});

export const ApiSuccessUserSchema = Type.Object({
  ok: Type.Literal(true),
  message: Type.String(),
  data: PublicUserSchema,
});

export const ApiSuccessForgotSchema = Type.Object({
  ok: Type.Literal(true),
  message: Type.String(),
  data: Type.Null(),
});

export const ApiErrorSchema = Type.Object({
  ok: Type.Literal(false),
  message: Type.String(),
  data: Type.Null(),
  details: Type.Array(
    Type.Object({
      message: Type.String(),
      field: Type.String(),
    }),
  ),
});

export const authTag = "Auth";
