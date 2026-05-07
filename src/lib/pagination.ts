import type { PaginatedData } from "@/lib/response";

export function buildPaginated<T>(input: {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
}): PaginatedData<T> {
  const page = Math.max(1, input.page);
  const pageSize = Math.max(1, Math.min(input.pageSize, 100));
  const from =
    input.total === 0 ? 0 : Math.min(input.total, (page - 1) * pageSize + 1);
  const to = Math.min(page * pageSize, input.total);
  return {
    page,
    pageSize,
    total: input.total,
    from,
    to,
    items: input.items,
  };
}
