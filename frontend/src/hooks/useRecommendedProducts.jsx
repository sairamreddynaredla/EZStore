import { useEffect, useState } from "react";
import api from "../services/api";
import { subscribeToRecommendations } from "../services/socket";

/**
 * Hook to get real-time recommended products
 * @param {string} productId - Product ID to get recommendations for
 * @param {number} limit - Number of recommendations (default: 5)
 * @returns {object} - { data: [], loading, error, isLive }
 */
export const useRecommendedProducts = (productId, limit = 5) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!productId) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribe;

    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${productId}/recommended`, {
          params: { limit },
        });
        if (isMounted) {
          setRecommendations(response.data.data || []);
          setError(null);
          setIsLive(true);

          // Subscribe to real-time updates
          unsubscribe = subscribeToRecommendations(productId, (updatedRecs) => {
            if (isMounted && Array.isArray(updatedRecs)) {
              setRecommendations(updatedRecs);
            }
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load recommendations");
          setRecommendations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [productId, limit]);

  return {
    data: recommendations,
    loading,
    error,
    isLive,
  };
};
