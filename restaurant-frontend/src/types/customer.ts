import type { ReactNode } from "react";
import type { CustomerUser, QueueEntry } from "./api";

export type CustomerSession = {
  user: CustomerUser | null;
  // True until the first get-session answer arrives.
  loading: boolean;
  refresh: () => void;
  signOut: () => Promise<void>;
};

// What the session provider has learned so far from get-session.
export type SessionState = { user: CustomerUser | null; loaded: boolean };

// Props for the app-wide providers, which only wrap the rest of the app.
export type ProviderProps = {
  children: ReactNode;
};

// The guest's live queue ticket, shared by the tab bar, the tracker and the queue page.
export type QueueEntryState = {
  entry: QueueEntry | null;
  loading: boolean;
  setEntry: (entry: QueueEntry | null) => void;
};
