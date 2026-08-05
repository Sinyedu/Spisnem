import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import TextField from "./TextField";
import { MinusIcon, PlusIcon } from "./icons";
import { joinQueue } from "../lib/api";
import { ApiError } from "../lib/apiClient";
import "./JoinQueueSheet.scss";

type Props = {
  slug: string;
  restaurantName: string;
  open: boolean;
  onClose: () => void;
  onJoined: (token: string) => void;
};

export default function JoinQueueSheet({ slug, restaurantName, open, onClose, onJoined }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(2);

  const mutation = useMutation({
    mutationFn: () =>
      joinQueue(slug, {
        guestName: name.trim(),
        partySize,
        phone: phone.trim() || undefined,
      }),
    onSuccess: (entry) => onJoined(entry.token),
  });

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Something went wrong. Please try again."
        : "";

  function submit() {
    if (!name.trim()) return;
    mutation.mutate();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Join the queue">
      <p className="join__sub">You're joining the line at {restaurantName}.</p>

      <div className="join__form">
        <TextField
          label="Your name"
          name="guestName"
          placeholder="Anna"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="field">
          <span className="field__label">Party size</span>
          <div className="join__stepper">
            <button
              type="button"
              aria-label="Fewer people"
              onClick={() => setPartySize((n) => Math.max(1, n - 1))}
            >
              <MinusIcon size={20} />
            </button>
            <span className="join__count">{partySize}</span>
            <button
              type="button"
              aria-label="More people"
              onClick={() => setPartySize((n) => Math.min(20, n + 1))}
            >
              <PlusIcon size={20} />
            </button>
          </div>
        </div>

        <TextField
          label="Phone (optional)"
          name="phone"
          type="tel"
          placeholder="+45 12 34 56 78"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {errorMessage && <p className="field__msg field__msg--error">{errorMessage}</p>}

        <Button
          full
          onClick={submit}
          disabled={!name.trim() || mutation.isPending}
          className="join__submit"
        >
          {mutation.isPending ? "Joining…" : "Confirm & join queue"}
        </Button>
      </div>
    </BottomSheet>
  );
}
