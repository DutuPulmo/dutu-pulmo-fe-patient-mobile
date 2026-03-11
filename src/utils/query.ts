export function cleanParams<T extends Record<string, unknown>>(params?: T): Partial<T> | undefined {
  if (!params) return undefined;

  const entries = Object.entries(params).filter(([, value]) => {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  return Object.fromEntries(entries) as Partial<T>;
}
