import type { FastifyReply } from "fastify";
import type { ErrorDetail } from "@/lib/errors";

export type ApiSuccess<T> = {
  ok: true;
  message: string;
  data: T;
};

export type PaginatedData<T> = {
  page: number;
  pageSize: number;
  total: number;
  from: number;
  to: number;
  items: T[];
};

export type ApiPaginatedSuccess<T> = {
  ok: true;
  message: string;
  data: PaginatedData<T>;
};

export type ApiErrorBody = {
  ok: false;
  message: string;
  data: null;
  details: ErrorDetail[];
};

export function sendSuccess<T>(
  reply: FastifyReply,
  message: string,
  data: T,
  statusCode = 200,
) {
  const body: ApiSuccess<T> = { ok: true, message, data };
  return reply.code(statusCode).send(body);
}

export function sendPaginated<T>(
  reply: FastifyReply,
  message: string,
  payload: Omit<PaginatedData<T>, "items"> & { items: T[] },
  statusCode = 200,
) {
  const body: ApiPaginatedSuccess<T> = { ok: true, message, data: payload };
  return reply.code(statusCode).send(body);
}
