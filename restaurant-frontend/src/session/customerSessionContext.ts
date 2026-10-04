import { createContext, useContext } from "react";
import type { CustomerSession } from "../types/customer";

export const CustomerSessionContext = createContext<CustomerSession | null>(null);

/** The signed-in guest (or null) from anywhere inside CustomerSessionProvider. */
export function useCustomerSession() {
  const session = useContext(CustomerSessionContext);
  if (!session) throw new Error("useCustomerSession must be used inside CustomerSessionProvider");
  return session;
}
