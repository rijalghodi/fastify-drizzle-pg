import { Type } from "@sinclair/typebox";

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
