import { useEffect, useState } from "react";
import { subscribeToPriceUpdates } from "../services/socket";

/**
 * Hook to subscribe to real-time product price updates
 * @param {string} productId - Product ID to watch
 * @param {object} initialPrice - Initial price object { price, originalPrice }
 * @returns {object} - Current price data { price, originalPrice, isUpdating }
 */
export const useRealtimeProductPrice = (productId, initialPrice = {}) => {
  const [priceData, setPriceData] = useState({
    price: initialPrice.price || 0,
    originalPrice: initialPrice.originalPrice || 0,
    isUpdating: false,
  });

  useEffect(() => {
    if (!productId) return;

    // Show updating indicator briefly
    const unsubscribe = subscribeToPriceUpdates(productId, (data) => {
      setPriceData((prev) => ({
        price: data.price ?? prev.price,
        originalPrice: data.originalPrice ?? prev.originalPrice,
        isUpdating: true,
      }));

      // Remove updating indicator after animation
      const timer = setTimeout(() => {
        setPriceData((prev) => ({ ...prev, isUpdating: false }));
      }, 300);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, [productId]);

  return priceData;
};
