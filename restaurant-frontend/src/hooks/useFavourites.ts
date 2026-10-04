import { useCallback, useMemo, useState } from "react";
import { addFavourite, getFavourites, removeFavourite } from "../lib/customer";
import { useCustomerSession } from "../session/customerSessionContext";
import { useResource } from "./useResource";

/** The signed-in guest's favourites, plus a toggle. Signed-out guests simply have none. */
export function useFavourites() {
  const { user } = useCustomerSession();
  const [version, setVersion] = useState(0);
  const key = user ? `favourites:${user.id}:${version}` : "";
  const { data, failed, loading } = useResource(key, getFavourites);
  const favourites = useMemo(() => data ?? [], [data]);

  const isFavourite = useCallback(
    (restaurantId: string) => favourites.some((favourite) => favourite.id === restaurantId),
    [favourites],
  );

  const toggle = useCallback(async (restaurantId: string) => {
    if (isFavourite(restaurantId)) await removeFavourite(restaurantId);
    else await addFavourite(restaurantId);
    setVersion((current) => current + 1);
  }, [isFavourite]);

  return { favourites, failed, loading, signedIn: Boolean(user), isFavourite, toggle };
}
