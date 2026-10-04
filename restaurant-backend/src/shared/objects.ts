export type DefinedFields<T> = { [Key in keyof T]?: Exclude<T[Key], undefined> };

// Drops fields that were not sent, so a PATCH only touches what it names.
export function definedFields<T extends object>(input: T): DefinedFields<T> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as DefinedFields<T>;
}
