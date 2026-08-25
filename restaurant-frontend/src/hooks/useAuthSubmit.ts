import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthSubmit(failureMessage: string) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const runAuth = async (request: () => Promise<unknown>) => {
    setSubmitting(true);
    setError("");

    try {
      await request();
      navigate("/map", { replace: true });
    } catch {
      setError(failureMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return { error, runAuth, submitting };
}
