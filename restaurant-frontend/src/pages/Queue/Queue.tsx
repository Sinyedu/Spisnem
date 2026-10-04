import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/common/BackButton/BackButton";
import BottomNav from "../../components/common/BottomNav/BottomNav";
import CalledScreen from "../../components/queue/CalledScreen/CalledScreen";
import JoinForm from "../../components/queue/JoinForm/JoinForm";
import QueueOutcome from "../../components/queue/QueueOutcome/QueueOutcome";
import QueueTicket from "../../components/queue/QueueTicket/QueueTicket";
import type { QueueViewProps } from "./Queue.types";
import { useQueuePage } from "./useQueuePage";
import "./Queue.scss";

function JoinView({ queue }: QueueViewProps) {
  const { t } = useTranslation();
  return (
    <>
      <header className="queue-page__header">
        <h1 className="queue-page__title">{t("queue.joinTitle")}</h1>
        {queue.restaurant && <p className="queue-page__subtitle">{queue.restaurant.name}</p>}
      </header>
      <JoinForm
        restaurant={queue.restaurant}
        estimate={queue.estimate}
        form={queue.form}
        failed={queue.failed}
        submitting={queue.submitting}
        onSubmit={queue.joinCurrentQueue}
        onUpdate={queue.updateForm}
      />
    </>
  );
}

function EmptyView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="queue-page__empty">
      <h1 className="queue-page__title">{t("queue.emptyTitle")}</h1>
      <p>{t("queue.empty")}</p>
      <button type="button" className="queue-page__primary" onClick={() => navigate("/map")}>
        {t("queue.exploreMap")}
      </button>
    </section>
  );
}

function QueueContent({ queue }: QueueViewProps) {
  const { t } = useTranslation();
  const { entry, view } = queue;
  if (view === "loading") return <p className="queue-page__status">{t("restaurant.loading")}</p>;
  if (view === "join") return <JoinView queue={queue} />;
  if (view === "empty" || !entry) return <EmptyView />;
  if (view === "called") return <CalledScreen entry={entry} onLeave={queue.leave} onMyWay={queue.onMyWay} />;
  if (view === "outcome") return <QueueOutcome entry={entry} onDone={queue.finish} />;
  return <QueueTicket entry={entry} onLeave={queue.leave} onLate={queue.late} />;
}

function Queue() {
  const { t } = useTranslation();
  const queue = useQueuePage();
  const called = queue.view === "called";
  // On the My queue tab the page sits behind the tab bar; joining from a restaurant has a back button instead.
  const tab = queue.isTab && !called;
  const classes = ["queue-page", called && "queue-page--called", tab && "queue-page--tab"].filter(Boolean).join(" ");

  return (
    <main className={classes}>
      {!called && !queue.isTab && <BackButton label={t("restaurant.back")} />}
      <QueueContent queue={queue} />
      {tab && <BottomNav />}
    </main>
  );
}

export default Queue;
