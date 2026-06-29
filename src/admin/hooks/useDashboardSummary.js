import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../context/toast-context";
import { getDashboardSummary } from "../services/dashboardService";

const useDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { error: toastError } = useToast();

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load dashboard data.";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    loading,
    error,
    refresh: loadSummary,
  };
};

export default useDashboardSummary;
