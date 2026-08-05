import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button";
import CenteredState from "../../components/CenteredState";
import IconButton from "../../components/IconButton";
import Spinner from "../../components/Spinner";
import { BackIcon, BellIcon, ClockIcon, UsersIcon } from "../../components/icons";
import { cancelQueue, getQueueEntry } from "../../lib/api";
import { clearQueueToken, formatWait } from "../../lib/format";
import type { QueueStatus } from "../../types/api";
import "./Queue.scss";

const TERMINAL: QueueStatus[] = ["seated", "cancelled", "no_show"];

const STATUS_COPY: Record<QueueStatus, { title: string; note: string }> = {
  waiting: { title: "You're in the queue", note: "We'll let you know when it's your turn." },
  notified: { title: "Your table is ready!", note: "Please head to the host stand now." },
  seated: { title: "You've been seated", note: "Enjoy your meal." },
  cancelled: { title: "Queue cancelled", note: "You've left the line." },
  no_show: { title: "Marked as no-show", note: "Your spot was released." },
};

export default function Queue() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["queue", token],
    queryFn: () => getQueueEntry(token),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && TERMINAL.includes(status) ? false : 5000;
    },
  });

  const cancel = useMutation({
    mutationFn: () => cancelQueue(token),
    onSuccess: (entry) => {
      clearQueueToken(entry.restaurant.slug);
      queryClient.setQueryData(["queue", token], entry);
    },
  });

  if (isLoading) {
    return (
      <CenteredState>
        <Spinner label="Loading your place…" />
      </CenteredState>
    );
  }

  if (isError || !data) {
    return (
      <CenteredState>
        <p>We couldn't find this queue entry.</p>
        <Button variant="secondary" onClick={() => navigate("/discover")}>
          Back to map
        </Button>
      </CenteredState>
    );
  }

  const copy = STATUS_COPY[data.status];
  const isActive = !TERMINAL.includes(data.status);
  const notified = data.status === "notified";

  return (
    <div className={`queue ${notified ? "queue--ready" : ""}`}>
      <header className="queue__head">
        <IconButton label="Back" onClick={() => navigate(`/r/${data.restaurant.slug}`)}>
          <BackIcon />
        </IconButton>
        <span className="queue__restaurant">{data.restaurant.name}</span>
        <span className="queue__spacer" />
      </header>

      <div className="queue__main">
        <span className={`queue__badge queue__badge--${data.status}`}>
          {notified ? <BellIcon size={16} /> : <UsersIcon size={16} />}
          {data.status.replace("_", " ")}
        </span>

        <h1 className="queue__title">{copy.title}</h1>
        <p className="queue__note">{copy.note}</p>

        {isActive && (
          <div className="queue__position">
            <span className="queue__position-label">Your position</span>
            <span className="queue__position-value">
              {data.position != null ? `#${data.position}` : "—"}
            </span>
            <span className="queue__wait">
              <ClockIcon size={16} /> {formatWait(data.estimatedWaitMinutes)} estimated
            </span>
          </div>
        )}

        <dl className="queue__meta">
          <div>
            <dt>Guest</dt>
            <dd>{data.guestName}</dd>
          </div>
          <div>
            <dt>Party size</dt>
            <dd>{data.partySize}</dd>
          </div>
        </dl>
      </div>

      <footer className="queue__footer">
        {isActive ? (
          <Button
            full
            variant="secondary"
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}
          >
            {cancel.isPending ? "Leaving…" : "Leave the queue"}
          </Button>
        ) : (
          <Button full onClick={() => navigate("/discover")}>
            Back to map
          </Button>
        )}
      </footer>
    </div>
  );
}
