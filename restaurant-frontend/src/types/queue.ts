import type { FormEvent } from "react";
import type { LateMinutes, QueueEntry, Restaurant, WaitEstimate } from "./api";

export type QueueFormState = {
  guestName: string;
  partySize: number;
  phone: string;
};

export type QueueFormSubmit = (event: FormEvent<HTMLFormElement>) => Promise<void>;
export type QueueFormUpdate = (next: Partial<QueueFormState>) => void;

// Which screen the queue page shows, derived from the stored entry and the route.
export type QueueView = "loading" | "join" | "ticket" | "called" | "outcome" | "empty";

export type JoinFormProps = {
  restaurant: Restaurant | null;
  // The server quote for the party size currently picked.
  estimate: WaitEstimate | null;
  form: QueueFormState;
  failed: boolean;
  submitting: boolean;
  onSubmit: QueueFormSubmit;
  onUpdate: QueueFormUpdate;
};

export type PartySizePickerProps = {
  value: number;
  onChange: (size: number) => void;
};

export type QueueEntryProps = {
  entry: QueueEntry;
};

export type QueueTicketProps = QueueEntryProps & {
  onLeave: () => Promise<void>;
  onLate: (minutes: LateMinutes) => Promise<void>;
};

export type CalledScreenProps = QueueEntryProps & {
  onLeave: () => Promise<void>;
  onMyWay: () => Promise<void>;
};

export type RunningLateProps = {
  onLate: (minutes: LateMinutes) => Promise<void>;
};

export type QueueRingProps = {
  // 0–1: the share of the wait already behind the guest.
  progress: number;
  position: number | null;
};

export type QueueOutcomeProps = QueueEntryProps & {
  onDone: () => void;
};

export type LeaveQueueButtonProps = {
  restaurantName: string;
  onLeave: () => Promise<void>;
  // "light" sits on cream screens, "onAccent" on the terracotta called screen.
  tone?: "light" | "onAccent";
};

export type EstimateBannerProps = {
  estimate: WaitEstimate | null;
};

export type OnMyWayButtonProps = Pick<CalledScreenProps, "entry" | "onMyWay">;
