import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerSession } from "../session/customerSessionContext";

export function useAuthSubmit(failureMessage: string) {
  const navigate = useNavigate();
  const { refresh } = useCustomerSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const runAuth = async (request: () => Promise<unknown>) => {
    setSubmitting(true);
    setError("");

    try {
      await request();
      // The session cookie is new, so ask again who is signed in.
      refresh();
      navigate("/map", { replace: true });
    } catch {
      setError(failureMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return { error, runAuth, submitting };
}
