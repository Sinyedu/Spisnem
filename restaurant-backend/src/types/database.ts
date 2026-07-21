import type pg from "pg";

// Every repository accepts either the pool or a client inside a transaction.
export type Db = pg.Pool | pg.PoolClient;

export type TransitionMap<T extends string> = Record<T, T[]>;

// Small helper row shape for queries that only return an id.
export type IdRow = { id: string };
