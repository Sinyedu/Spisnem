import { useCallback, useEffect, useMemo, useState } from "react";
import { getCustomerSession, signOutCustomer } from "../lib/customer";
import type { CustomerSession, ProviderProps, SessionState } from "../types/customer";
import { CustomerSessionContext } from "./customerSessionContext";

/** Asks Better Auth once who is signed in, and again whenever refresh() is called. */
function CustomerSessionProvider({ children }: ProviderProps) {
  const [state, setState] = useState<SessionState>({ user: null, loaded: false });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getCustomerSession(controller.signal)
      .then((user) => setState({ user, loaded: true }))
      .catch(() => !controller.signal.aborted && setState({ user: null, loaded: true }));
    return () => controller.abort();
  }, [version]);

  const refresh = useCallback(() => setVersion((current) => current + 1), []);
  const signOut = useCallback(async () => {
    await signOutCustomer();
    setState({ user: null, loaded: true });
  }, []);

  const session = useMemo<CustomerSession>(
    () => ({ user: state.user, loading: !state.loaded, refresh, signOut }),
    [state, refresh, signOut],
  );

  return <CustomerSessionContext.Provider value={session}>{children}</CustomerSessionContext.Provider>;
}

export default CustomerSessionProvider;
