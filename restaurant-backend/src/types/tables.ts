// free: ready to seat. seated: in use. soon: expected to free up within a few minutes.
// blocked: reserved or out of use, so the estimate ignores it.
export type TableStatus = "free" | "seated" | "soon" | "blocked";

export type RestaurantTable = {
  id: string;
  label: string;
  seats: number;
  status: TableStatus;
  seatedAt: string | null;
  entryId: string | null;
  partySize: number | null;
  sortOrder: number;
};

export type CreateTableInput = {
  label: string;
  seats: number;
  sortOrder: number;
};

export type UpdateTableInput = {
  label?: string | undefined;
  seats?: number | undefined;
  status?: TableStatus | undefined;
  sortOrder?: number | undefined;
};
