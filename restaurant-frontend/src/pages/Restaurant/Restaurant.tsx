import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/Button";
import CenteredState from "../../components/CenteredState";
import IconButton from "../../components/IconButton";
import JoinQueueSheet from "../../components/JoinQueueSheet";
import Spinner from "../../components/Spinner";
import StatTile from "../../components/StatTile";
import TabBar, { type Tab } from "../../components/TabBar";
import {
  BackIcon,
  BasketIcon,
  BellIcon,
  CardIcon,
  ClockIcon,
  HeartIcon,
  PlusIcon,
  ShareIcon,
  StarIcon,
  UsersIcon,
} from "../../components/icons";
import { getMenu, getQueueEntry, getRestaurant } from "../../lib/api";
import { bgImage } from "../../lib/style";
import {
  clearQueueToken,
  formatMoney,
  formatRating,
  formatWait,
  readQueueToken,
  storeQueueToken,
} from "../../lib/format";
import "./Restaurant.scss";

// Visual only for the MVP — ordering, payment and alerts are not wired yet.
const TABS: Tab[] = [
  { key: "order", label: "Order", icon: <BasketIcon size={22} /> },
  { key: "payment", label: "Payment", icon: <CardIcon size={22} /> },
  { key: "alerts", label: "Alerts", icon: <BellIcon size={22} /> },
];

export default function Restaurant() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const restaurantQuery = useQuery({
    queryKey: ["restaurant", slug],
    queryFn: () => getRestaurant(slug),
  });
  const menuQuery = useQuery({
    queryKey: ["menu", slug],
    queryFn: () => getMenu(slug),
  });

  const stored = readQueueToken(slug);
  const storedToken = stored?.token ?? null;
  const activeQueue = useQuery({
    queryKey: ["queue", storedToken],
    queryFn: () => getQueueEntry(storedToken!),
    enabled: !!storedToken,
  });
  const inQueue =
    activeQueue.data && ["waiting", "notified"].includes(activeQueue.data.status)
      ? activeQueue.data
      : null;

  // If the stored token has resolved to a finished entry, forget it (in an
  // effect — never mutate storage during render).
  useEffect(() => {
    if (storedToken && activeQueue.data && !inQueue) clearQueueToken(slug);
  }, [storedToken, activeQueue.data, inQueue, slug]);

  if (restaurantQuery.isLoading) {
    return (
      <CenteredState>
        <Spinner label="Loading…" />
      </CenteredState>
    );
  }

  if (restaurantQuery.isError || !restaurantQuery.data) {
    return (
      <CenteredState>
        <p>Couldn't load this restaurant.</p>
        <Button variant="secondary" onClick={() => navigate("/discover")}>
          Back to map
        </Button>
      </CenteredState>
    );
  }

  const r = restaurantQuery.data;
  const menu = menuQuery.data;

  function onJoined(token: string) {
    storeQueueToken({ token, slug, joinedAt: new Date().toISOString() });
    setSheetOpen(false);
    navigate(`/queue/${token}`);
  }

  return (
    <div className="restaurant">
      <div className="restaurant__scroll">
        <header className="restaurant__hero" style={bgImage(r.heroImageUrl)}>
          <div className="restaurant__hero-top">
            <IconButton label="Go back" onClick={() => navigate(-1)}>
              <BackIcon />
            </IconButton>
            <div className="restaurant__hero-actions">
              <IconButton
                label="Save"
                className={favorite ? "icon-btn--active" : ""}
                onClick={() => setFavorite((v) => !v)}
              >
                <HeartIcon filled={favorite} />
              </IconButton>
              <IconButton label="Share">
                <ShareIcon />
              </IconButton>
            </div>
          </div>
        </header>

        <div className="restaurant__body">
          <h1 className="restaurant__name">{r.name}</h1>
          <p className="restaurant__subtitle">
            {r.description ?? [r.address, r.city].filter(Boolean).join(", ")}
          </p>

          <div className="restaurant__stats">
            <StatTile
              tone="accent"
              icon={<StarIcon size={17} />}
              value={formatRating(r.rating)}
              label="Rating"
            />
            <StatTile
              icon={<ClockIcon size={17} />}
              value={formatWait(r.estimatedWaitMinutes || r.averageWaitMinutes)}
              label="Est. wait"
            />
            <StatTile
              tone="accent"
              icon={<UsersIcon size={17} />}
              value={`${r.queueLength} ahead`}
              label="In queue"
            />
          </div>

          {inQueue && (
            <button className="restaurant__inqueue" onClick={() => navigate(`/queue/${storedToken}`)}>
              <span>You're in the queue · #{inQueue.position ?? "—"}</span>
              <span className="restaurant__inqueue-cta">View status</span>
            </button>
          )}

          <h2 className="restaurant__menu-title">Menu</h2>
          {menuQuery.isLoading && <Spinner />}
          {menuQuery.isError && (
            <p className="restaurant__error">Menu is unavailable right now.</p>
          )}
          <div className="restaurant__menu">
            {menu?.categories.map((category) => (
              <section key={category.id} className="restaurant__category">
                <h3 className="restaurant__category-name">{category.name}</h3>
                {category.items.map((item) => (
                  <article key={item.id} className="menu-item">
                    {item.imageUrl && (
                      <div className="menu-item__img" style={bgImage(item.imageUrl)} />
                    )}
                    <div className="menu-item__body">
                      <h4 className="menu-item__name">{item.name}</h4>
                      {item.description && (
                        <p className="menu-item__desc">{item.description}</p>
                      )}
                      <div className="menu-item__foot">
                        <span className="menu-item__price">
                          {formatMoney(item.priceMinor, item.currency)}
                        </span>
                        {/* Ordering is out of scope for the queue MVP — visual only. */}
                        <button className="menu-item__add" disabled>
                          <PlusIcon size={16} /> Add to order
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>

      <footer className="restaurant__footer">
        {r.queueEnabled ? (
          inQueue ? (
            <Button full onClick={() => navigate(`/queue/${storedToken}`)}>
              View your place · #{inQueue.position ?? "—"}
            </Button>
          ) : (
            <Button full onClick={() => setSheetOpen(true)}>
              Join the queue
            </Button>
          )
        ) : (
          <Button full disabled>
            Queue closed
          </Button>
        )}
        <TabBar tabs={TABS} active="order" />
      </footer>

      <JoinQueueSheet
        slug={slug}
        restaurantName={r.name}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onJoined={onJoined}
      />
    </div>
  );
}
