import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResource } from "../../hooks/useResource";
import {
  cancelQueueEntry,
  clearQueueToken,
  getWaitEstimate,
  joinRestaurantQueue,
  readQueueToken,
  reportOnMyWay,
  reportRunningLate,
  writeQueueToken,
} from "../../lib/queue";
import { useCurrentQueueEntry } from "../../session/queueEntryContext";
import type { LateMinutes, QueueEntry } from "../../types/api";
import type { QueueFormState, QueueFormSubmit, QueueFormUpdate, QueueView } from "../../types/queue";
import { useRestaurant } from "../Restaurant/useRestaurant";

const initialForm: QueueFormState = { guestName: "", partySize: 2, phone: "" };

type EntrySetter = (entry: QueueEntry | null) => void;

function useQueueForm(slug: string | undefined, setEntry: EntrySetter) {
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);

  const updateForm: QueueFormUpdate = (next) => setForm((current) => ({ ...current, ...next }));

  const joinCurrentQueue: QueueFormSubmit = async (event) => {
    event.preventDefault();
    if (!slug || submitting) return;
    setFailed(false);
    setSubmitting(true);
    try {
      const { phone, guestName, partySize } = form;
      const joined = await joinRestaurantQueue(slug, { guestName: guestName.trim(), partySize, phone: phone.trim() || undefined });
      writeQueueToken(joined.token);
      setEntry(joined);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return { failed, form, joinCurrentQueue, submitting, updateForm };
}

function queueView(entry: QueueEntry | null, loading: boolean, slug: string | undefined): QueueView {
  if (loading) return "loading";
  if (entry?.status === "waiting") return "ticket";
  if (entry?.status === "notified") return "called";
  if (entry) return "outcome";
  return slug ? "join" : "empty";
}

// Actions on the ticket that is already stored: leave, running late, on my way, done.
function useTicketActions(setEntry: EntrySetter) {
  const navigate = useNavigate();
  const withToken = async (action: (token: string) => Promise<QueueEntry>) => {
    const token = readQueueToken();
    if (token) setEntry(await action(token));
  };
  return {
    leave: async () => {
      const token = readQueueToken();
      if (token) await cancelQueueEntry(token);
      clearQueueToken();
      setEntry(null);
    },
    late: (minutes: LateMinutes) => withToken((token) => reportRunningLate(token, minutes)),
    onMyWay: () => withToken(reportOnMyWay),
    finish: () => {
      clearQueueToken();
      navigate("/map");
    },
  };
}

export function useQueuePage() {
  const { slug } = useParams();
  const { entry, loading, setEntry } = useCurrentQueueEntry();
  const view = queueView(entry, loading, slug);
  const queueForm = useQueueForm(slug, setEntry);
  // Only the join screen needs the restaurant and a live quote for the size picked.
  const joining = view === "join" && slug ? slug : "";
  const { restaurant } = useRestaurant(joining);
  const size = queueForm.form.partySize;
  const { data: estimate } = useResource(joining && `estimate:${joining}:${size}`, (signal) => getWaitEstimate(joining, size, signal));

  return { ...queueForm, ...useTicketActions(setEntry), entry, estimate, isTab: !slug, restaurant, view };
}
