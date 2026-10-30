import { Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import TabPage from "../../components/common/TabPage/TabPage";
import { useResource } from "../../hooks/useResource";
import { getVisits } from "../../lib/customer";
import { useCustomerSession } from "../../session/customerSessionContext";
import type { VisitRowProps } from "../../types/generic";
import "./History.scss";

const visitDate = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// "Promised 15 · waited 12 min": the honest comparison the whole app is about.
function WaitComparison({ visit }: VisitRowProps) {
  const { t } = useTranslation();
  if (visit.quotedWaitMinutes === null || visit.actualWaitMinutes === null) return null;
  return (
    <span className="history__wait tabular">
      {t("history.waitComparison", { promised: visit.quotedWaitMinutes, waited: visit.actualWaitMinutes })}
    </span>
  );
}

function VisitRow({ visit }: VisitRowProps) {
  const { t } = useTranslation();
  return (
    <li>
      <Link className="history__row" to={`/restaurants/${visit.restaurant.slug}`}>
        <span className="history__top">
          <span className="history__name">{visit.restaurant.name}</span>
          <span className={`history__status history__status--${visit.status}`}>{t(`history.status.${visit.status}`)}</span>
        </span>
        <span className="history__meta">
          {visitDate.format(new Date(visit.joinedAt))} · {t("queue.people", { count: visit.partySize })}
        </span>
        <WaitComparison visit={visit} />
      </Link>
    </li>
  );
}

/** Past visits for the signed-in guest, newest first. */
function History() {
  const { t } = useTranslation();
  const { user } = useCustomerSession();
  const { data: visits, loading, failed } = useResource(user ? `visits:${user.id}` : "", getVisits);

  return (
    <TabPage title={t("history.title")}>
      {!user && <EmptyState icon={Clock3} title={t("history.signedOutTitle")} body={t("history.signedOutBody")}
        actionLabel={t("profile.signIn")} actionTo="/signin" />}
      {user && loading && <p className="history__meta">{t("restaurant.loading")}</p>}
      {user && failed && <p className="history__meta">{t("history.loadFailed")}</p>}
      {visits?.length === 0 && <EmptyState icon={Clock3} title={t("history.emptyTitle")} body={t("history.emptyBody")}
        actionLabel={t("queue.exploreMap")} actionTo="/map" />}
      {visits && visits.length > 0 && <ul className="history__list">{visits.map((visit) => <VisitRow key={visit.id} visit={visit} />)}</ul>}
    </TabPage>
  );
}

export default History;
