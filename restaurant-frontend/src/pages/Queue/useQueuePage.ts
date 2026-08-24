import { useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelQueueEntry,
  clearQueueToken,
  getQueueEntry,
  joinRestaurantQueue,
  readQueueToken,
  writeQueueToken,
} from "../../lib/queue";
import type { QueueEntry } from "../../types/api";

export type QueueFormState = {
  guestName: string;
  partySize: number;
  phone: string;
};

export type QueueFormSubmit = (event: FormEvent<HTMLFormElement>) => Promise<void>;
export type QueueFormUpdate = (next: Partial<QueueFormState>) => void;

const initialForm: QueueFormState = {
  guestName: "",
  partySize: 2,
  phone: "",
};

type QueueEntrySetter = Dispatch<SetStateAction<QueueEntry | null>>;

function useStoredQueueEntry() {
  const [entry, setEntry] = useState<QueueEntry | null>(null);

  useEffect(() => {
    const token = readQueueToken();
    if (!token) return;

    const controller = new AbortController();
    getQueueEntry(token, controller.signal).then(setEntry).catch(clearQueueToken);
    return () => controller.abort();
  }, []);

  return { entry, setEntry };
}

function useQueueForm(slug: string | undefined, setEntry: QueueEntrySetter) {
  const [failed, setFailed] = useState(false);
  const [form, setForm] = useState(initialForm);

  const updateForm: QueueFormUpdate = (next) => {
    setForm((current) => ({ ...current, ...next }));
  };

  const joinCurrentQueue: QueueFormSubmit = async (event) => {
    event.preventDefault();
    if (!slug) return;

    setFailed(false);
    try {
      const joined = await joinRestaurantQueue(slug, {
        guestName: form.guestName,
        partySize: form.partySize,
        phone: form.phone || undefined,
      });
      writeQueueToken(joined.token);
      setEntry(joined);
    } catch {
      setFailed(true);
    }
  };

  return { failed, form, joinCurrentQueue, updateForm };
}

async function leaveQueue(setEntry: QueueEntrySetter) {
  const token = readQueueToken();
  if (token) await cancelQueueEntry(token);
  clearQueueToken();
  setEntry(null);
}

export function useQueuePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { entry, setEntry } = useStoredQueueEntry();
  const queueForm = useQueueForm(slug, setEntry);

  async function leave() {
    await leaveQueue(setEntry);
  }

  function goBack() {
    navigate(-1);
  }

  function goToMap() {
    navigate("/map");
  }

  return {
    canJoin: Boolean(slug && !entry),
    entry,
    failed: queueForm.failed,
    form: queueForm.form,
    goBack,
    goToMap,
    isEmpty: !entry && !slug,
    joinCurrentQueue: queueForm.joinCurrentQueue,
    leave,
    updateForm: queueForm.updateForm,
  };
}
