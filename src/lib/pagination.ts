export const MAX_PAGE = 10_000;

export function parsePage(raw: string | null): number | null {
  if (raw === null) return 1;

  const page = Number(raw);
  return Number.isSafeInteger(page) && page > 0 && page <= MAX_PAGE
    ? page
    : null;
}
