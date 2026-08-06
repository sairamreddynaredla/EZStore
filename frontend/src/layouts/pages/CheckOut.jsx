import Navbar from "../../components/Navbar";
import useCart from "../../hooks/usecart";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BadgeCheck, CreditCard, LockKeyhole, TicketPercent } from "lucide-react";
import customerCommerceApi from "../../services/customerCommerceApi";
import secureBadge from "../../assets/logo/secure-payment.webp";
import easyReturnsBadge from "../../assets/logo/easy-returns.webp";
import fastDeliveryBadge from "../../assets/logo/fast-delivery.webp";
import cardIcon from "../../assets/payments/card.webp";
import products from "../../data/products";
import { resolveProductImage, resolveProductImageFallback } from "../../utils/productImage";

let cachedPaymentConfig = null;
let activePaymentConfigRequest = null;
let cachedSavedAddresses = null;
let activeSavedAddressesRequest = null;

const PaymentSection = ({
  order,
  error,
  onError,
  clearCart,
  persistOrder,
  clearPendingCheckout,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isElementsReady, setIsElementsReady] = useState(false);
  const paymentElementRef = useRef(null);

  useEffect(() => {
    setIsElementsReady(false);
  }, [elements]);

  const handleConfirmPayment = async () => {
    if (!stripe || !elements || !isElementsReady) {
      onError("Payment form is still loading. Please wait a moment and try again.");
      return;
    }

    setIsSubmittingPayment(true);
    onError("");

    try {
      console.info("[EZStore] Stripe confirmPayment invoked", { orderId: order?.id, orderNumber: order?.orderNumber });
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?orderNumber=${order.orderNumber}`,
        },
        redirect: "if_required",
      });

      if (import.meta.env.DEV) {
        console.info("[EZStore] Stripe confirmPayment result:", {
          stripeError: result?.error?.message || null,
          paymentIntentId: result?.paymentIntent?.id || null,
          paymentIntentStatus: result?.paymentIntent?.status || null,
        });
      }

      if (result.error) {
        console.error("[EZStore] Stripe confirmPayment error", result.error);
        onError(result.error.message || "Payment confirmation failed. Please try again.");
        return;
      }

      const intent = result.paymentIntent;
      if (!intent) {
        onError("Unable to read payment result. Please try again.");
        return;
      }

      if (intent.status === "succeeded") {
        // Payment status is updated exclusively by Stripe's signed webhook.
        await clearCart();
        persistOrder(order);
        clearPendingCheckout();
        if (typeof onSuccess === "function") {
          onSuccess();
          return;
        }
      }

      if (intent.status === "requires_action" || intent.status === "requires_confirmation") {
        onError("Payment requires additional authentication. Follow the prompts to complete the payment.");
        return;
      }

      if (intent.status === "requires_payment_method" || intent.status === "canceled" || intent.status === "failed") {
        onError("Payment could not be completed. Please try again with a different payment method.");
        return;
      }

      onError(`Payment status: ${intent.status}. Please refresh if your order is not complete.`);
    } catch (error) {
      onError(error?.response?.data?.message || error.message || "Payment confirmation failed.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Enter payment details</h3>
          <p className="text-xs text-slate-500">Your card details are securely processed by Stripe.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div ref={paymentElementRef} className="mx-5 mt-5 rounded-xl border border-slate-200 bg-white p-4">
          <PaymentElement
            onReady={() => setIsElementsReady(true)}
            onLoadError={() => {
              setIsElementsReady(false);
              clearPendingCheckout();
              onError("This payment session is no longer valid. Refresh the page to start a new payment.");
            }}
          />
        </div>
        {error && <p className="mx-5 text-xs text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={!stripe || !elements || !isElementsReady || isSubmittingPayment}
          className="mx-5 mb-3 flex w-[calc(100%-2.5rem)] items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          {isSubmittingPayment
            ? "Processing secure payment..."
            : !isElementsReady
              ? "Loading secure payment form..."
              : `Pay $${Number(order?.totalAmount ?? 0).toFixed(2)} securely`}
        </button>
        <p className="pb-5 text-center text-xs text-slate-500">Encrypted and securely processed by Stripe.</p>
      </div>
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalPrice, clearCart, removeFromCart, increaseQuantity, decreaseQuantity, refreshCart } =
    useCart();

  const checkoutItem = location.state?.checkoutItem;
  const [checkoutQuantity, setCheckoutQuantity] = useState(checkoutItem?.quantity || 1);
  const [updatedCartItems, setUpdatedCartItems] = useState(null);

  const items = updatedCartItems ??
    (checkoutItem
      ? [{ ...checkoutItem, quantity: checkoutQuantity }]
      : Array.isArray(cartItems)
      ? cartItems
      : []);

  const getCatalogProduct = (item) => {
    const itemId = Number(item.productId ?? item.id);
    const itemName = String(item.name ?? item.productName ?? "").trim().toLowerCase();

    return products.find((product) =>
      (Number.isFinite(itemId) && Number(product.id) === itemId) ||
      (itemName && String(product.name ?? "").trim().toLowerCase() === itemName)
    );
  };

  // ─── STEP & NAVIGATION ───
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { step: 1, label: "Address", icon: "📍" },
    { step: 2, label: "Shipping", icon: "🚚" },
    { step: 3, label: "Payment", icon: "💳" },
    { step: 4, label: "Confirmation", icon: "✓" },
  ];

  // ─── FORM VALIDATION ───
  const [errors, setErrors] = useState({});

  // ─── USER & ADDRESS ───
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [isFetchingBillingPincode, setIsFetchingBillingPincode] = useState(false);
  const [billingPincodeMessage, setBillingPincodeMessage] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // ─── BILLING ADDRESS ───
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPincode, setBillingPincode] = useState("");

  // ─── DELIVERY & PAYMENT ───
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedDeliveryInstruction, setSelectedDeliveryInstruction] = useState("ring-bell");
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [backendStripePublishableKey, setBackendStripePublishableKey] = useState("");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const isPlacingOrderRef = useRef(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    let active = true;

    const loadPaymentConfig = async () => {
      let request = cachedPaymentConfig ? Promise.resolve(cachedPaymentConfig) : activePaymentConfigRequest;
      let shouldClearRequest = false;

      if (!request) {
        request = customerCommerceApi.getPaymentConfig();
        activePaymentConfigRequest = request;
        shouldClearRequest = true;
      }

      try {
        const cfg = await request;
        if (!cachedPaymentConfig) {
          cachedPaymentConfig = cfg;
        }

        const enabled = cfg?.data?.stripeEnabled === true;
        const backendKey = cfg?.data?.publishableKey || "";
        if (active) {
          setStripeEnabled(Boolean(enabled));
          setBackendStripePublishableKey(backendKey);
        }
      } catch {
        if (active) {
          setStripeEnabled(false);
        }
      } finally {
        if (shouldClearRequest && activePaymentConfigRequest === request) {
          activePaymentConfigRequest = null;
        }
      }
    };

    loadPaymentConfig();
    return () => {
      active = false;
    };
  }, []);

  // ─── COUPON ───
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // ─── MODALS ───
  const [showTermsModal, setShowTermsModal] = useState(false);

  // ─── ORDER ITEMS & PRICING ───
  const TAX_RATE = 0.1;
  const discount = Number(appliedCoupon?.discountAmount ?? 0);
  const shipping = appliedCoupon?.freeShipping ? 0 : selectedDelivery === "express" ? 99 : 0;
  const itemPrice = (item) => {
    const price = Number(item.selectedVariant?.price ?? item.price ?? 0) || 0;
    const quantity = Number(item.quantity ?? 1) || 1;
    return price * quantity;
  };
  const subtotal = checkoutItem
    ? Math.round(itemPrice({ ...checkoutItem, quantity: checkoutQuantity }) * 100) / 100
    : Number(totalPrice || 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Number.isFinite(subtotal)
    ? Math.max(0, subtotal + tax - discount + shipping)
    : 0;

  // ─── ADDITIONAL SERVICES ───
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSavedAddresses = async () => {
      setIsLoadingAddresses(true);
      let request = cachedSavedAddresses ? Promise.resolve(cachedSavedAddresses) : activeSavedAddressesRequest;
      let shouldClearRequest = false;

      if (!request) {
        request = customerCommerceApi.getAddresses({ limit: 50 });
        activeSavedAddressesRequest = request;
        shouldClearRequest = true;
      }

      try {
        const response = await request;
        if (!cachedSavedAddresses) {
          cachedSavedAddresses = response;
        }

        if (active) setSavedAddresses(response.data?.addresses || []);
      } catch {
        if (active) setSavedAddresses([]);
      } finally {
        if (shouldClearRequest && activeSavedAddressesRequest === request) {
          activeSavedAddressesRequest = null;
        }
        if (active) setIsLoadingAddresses(false);
      }
    };

    loadSavedAddresses();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let timer;
    let active = true;

    const loadSuggestions = async () => {
      if (!active) return;

      const query = `${streetAddress} ${city}`.trim();
      if (query.length < 3) {
        setAddressSuggestions([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          format: "jsonv2",
          addressdetails: "1",
          limit: "5",
          countrycodes: "us",
          q: query,
        });
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Address lookup failed");
        const results = await response.json();
        if (active) setAddressSuggestions(Array.isArray(results) ? results : []);
      } catch (error) {
        if (active && error.name !== "AbortError") setAddressSuggestions([]);
      }
    };

    timer = window.setTimeout(loadSuggestions, 350);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [streetAddress, city]);

  // ─── AUTOMATIC PINCODE / ZIP CODE LOOKUP (FREE PUBLIC API) ───
  useEffect(() => {
    const cleanCode = pincode.trim();
    if (!cleanCode || !/^\d{5,6}$/.test(cleanCode)) {
      setPincodeMessage("");
      return;
    }

    let active = true;
    const controller = new AbortController();

    const fetchPincodeDetails = async () => {
      setIsFetchingPincode(true);
      setPincodeMessage("Auto-fetching city & state...");

      try {
        let fetchedState = "";
        let fetchedCity = "";

        // 1. Try Indian 6-digit PIN code API
        if (cleanCode.length === 6) {
          try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${cleanCode}`, { signal: controller.signal });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                const po = data[0].PostOffice[0];
                fetchedState = po.State || "";
                fetchedCity = po.District || po.Block || po.Name || "";
              }
            }
          } catch (e) {}
        }

        // 2. Try Zippopotam API (US 5-digit & India 6-digit)
        if (!fetchedState) {
          const country = cleanCode.length === 6 ? "in" : "us";
          try {
            const res = await fetch(`https://api.zippopotam.us/${country}/${cleanCode}`, { signal: controller.signal });
            if (res.ok) {
              const data = await res.json();
              if (data.places && data.places.length > 0) {
                fetchedState = data.places[0]["state"] || "";
                fetchedCity = data.places[0]["place name"] || "";
              }
            }
          } catch (e) {}
        }

        if (active) {
          if (fetchedState) {
            setState(fetchedState);
            if (fetchedCity && (!city || city.trim() === "")) setCity(fetchedCity);
            setPincodeMessage(`Auto-filled: ${fetchedCity ? fetchedCity + ", " : ""}${fetchedState}`);
            setErrors((prev) => {
              const next = { ...prev };
              delete next.state;
              delete next.pincode;
              if (fetchedCity) delete next.city;
              return next;
            });
          } else {
            setPincodeMessage("");
          }
        }
      } catch (err) {
        if (active && err.name !== "AbortError") setPincodeMessage("");
      } finally {
        if (active) setIsFetchingPincode(false);
      }
    };

    const timer = setTimeout(fetchPincodeDetails, 350);
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [pincode]);

  useEffect(() => {
    if (sameAsShipping) return;
    const cleanCode = billingPincode.trim();
    if (!cleanCode || !/^\d{5,6}$/.test(cleanCode)) {
      setBillingPincodeMessage("");
      return;
    }

    let active = true;
    const controller = new AbortController();

    const fetchBillingPincodeDetails = async () => {
      setIsFetchingBillingPincode(true);
      setBillingPincodeMessage("Auto-fetching city & state...");

      try {
        let fetchedState = "";
        let fetchedCity = "";

        if (cleanCode.length === 6) {
          try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${cleanCode}`, { signal: controller.signal });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                const po = data[0].PostOffice[0];
                fetchedState = po.State || "";
                fetchedCity = po.District || po.Block || po.Name || "";
              }
            }
          } catch (e) {}
        }

        if (!fetchedState) {
          const country = cleanCode.length === 6 ? "in" : "us";
          try {
            const res = await fetch(`https://api.zippopotam.us/${country}/${cleanCode}`, { signal: controller.signal });
            if (res.ok) {
              const data = await res.json();
              if (data.places && data.places.length > 0) {
                fetchedState = data.places[0]["state"] || "";
                fetchedCity = data.places[0]["place name"] || "";
              }
            }
          } catch (e) {}
        }

        if (active) {
          if (fetchedState) {
            setBillingState(fetchedState);
            if (fetchedCity && (!billingCity || billingCity.trim() === "")) setBillingCity(fetchedCity);
            setBillingPincodeMessage(`Auto-filled: ${fetchedCity ? fetchedCity + ", " : ""}${fetchedState}`);
            setErrors((prev) => {
              const next = { ...prev };
              delete next.billingPincode;
              if (fetchedCity) delete next.billingCity;
              return next;
            });
          } else {
            setBillingPincodeMessage("");
          }
        }
      } catch (err) {
        if (active && err.name !== "AbortError") setBillingPincodeMessage("");
      } finally {
        if (active) setIsFetchingBillingPincode(false);
      }
    };

    const timer = setTimeout(fetchBillingPincodeDetails, 350);
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [billingPincode, sameAsShipping]);

  const applySavedAddress = (addressId) => {
    setSelectedSavedAddressId(addressId);
    const address = savedAddresses.find((item) => String(item.id) === String(addressId));
    if (!address) return;
    setFullName(address.recipientName || "");
    setPhone(address.phone || "");
    setStreetAddress(address.street || "");
    setCity(address.city || "");
    setState(address.state || "");
    setPincode(address.postalCode || "");
    setErrors({});
  };

  const applyAddressSuggestion = (suggestion) => {
    const details = suggestion.address || {};
    const lineOne = [details.house_number, details.road || details.pedestrian || details.neighbourhood].filter(Boolean).join(" ") || suggestion.display_name.split(",")[0];
    setStreetAddress(lineOne);
    setCity(details.city || details.town || details.village || details.county || "");
    setState(details.state || "");
    setPincode(details.postcode || "");
    setSelectedSavedAddressId("");
    setAddressSuggestions([]);
  };

  // ─── VALIDATION ───
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case "email":
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Valid email is required";
        } else delete newErrors.email;
        break;
      case "phone":
        if (!value || !/^\+?\d{10,}$/.test(value.replace(/[\s-]/g, ""))) {
          newErrors.phone = "Valid phone number is required";
        } else delete newErrors.phone;
        break;
      case "fullName":
        if (!value || !/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.fullName = "Full name must contain only letters and spaces";
        } else delete newErrors.fullName;
        break;
      case "streetAddress":
        if (!value) newErrors.streetAddress = "Street address is required";
        else delete newErrors.streetAddress;
        break;
      case "city":
        if (!value) newErrors.city = "City is required";
        else delete newErrors.city;
        break;
      case "state":
        if (!value) newErrors.state = "State is required";
        else delete newErrors.state;
        break;
      case "pincode":
        if (!value || !/^\d{5,6}$/.test(value)) {
          newErrors.pincode = "Valid ZIP/postal code is required";
        } else delete newErrors.pincode;
        break;
      case "billingName":
        if (!sameAsShipping && (!value || !/^[a-zA-Z\s]+$/.test(value))) {
          newErrors.billingName = "Billing name must contain only letters and spaces";
        } else delete newErrors.billingName;
        break;
      case "billingAddress":
        if (!sameAsShipping && !value) newErrors.billingAddress = "Billing address is required";
        else delete newErrors.billingAddress;
        break;
      case "billingCity":
        if (!sameAsShipping && !value) newErrors.billingCity = "Billing city is required";
        else delete newErrors.billingCity;
        break;
      case "billingPincode":
        if (!sameAsShipping && (!value || !/^\d{5,6}(-\d{4})?$/.test(value))) {
          newErrors.billingPincode = "Valid ZIP/postal code is required";
        } else delete newErrors.billingPincode;
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCheckoutDetails = () => {
    const validationErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) validationErrors.email = "Valid email is required";
    if (!/^\+?\d{10,}$/.test(phone.replace(/[\s-]/g, ""))) validationErrors.phone = "Valid phone number is required";
    if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) validationErrors.fullName = "Full name must contain only letters and spaces";
    if (!streetAddress.trim()) validationErrors.streetAddress = "Street address is required";
    if (!city.trim()) validationErrors.city = "City is required";
    if (!state) validationErrors.state = "State is required";
    if (!/^\d{5,6}$/.test(pincode.trim())) validationErrors.pincode = "Valid ZIP/postal code is required";

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      ["email", "phone", "fullName", "streetAddress", "city", "state", "pincode"].forEach((field) => delete nextErrors[field]);
      return { ...nextErrors, ...validationErrors };
    });

    return Object.keys(validationErrors).length === 0;
  };

  // ─── COUPON HANDLER ───
  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!coupon.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    try {
      const couponItems = (checkoutItem ? [{ ...checkoutItem, quantity: checkoutQuantity }] : cartItems).map((item) => ({
        id: Number(item.productId ?? item.id) || undefined,
        productId: Number(item.productId ?? item.id) || undefined,
      }));
      const response = await customerCommerceApi.validateCoupon({ code: coupon.trim(), subtotal, items: couponItems });
      setAppliedCoupon({
        code: response.data.coupon.code,
        discountAmount: response.data.discountAmount,
        description: response.data.coupon.description,
        freeShipping: Boolean(response.data.coupon.freeShipping),
      });
      setCoupon("");
    } catch (error) {
      setCouponError(error?.response?.data?.message || "Invalid coupon code");
    }
  };

  // ─── QUANTITY HANDLER ───
  const handleQuantityChange = (idx, qty) => {
    if (checkoutItem) {
      setCheckoutQuantity(Math.max(1, qty));
      return;
    }

    const item = cartItems[idx];
    const currentQty = item.quantity;
    if (qty > currentQty) {
      increaseQuantity(item.id, item.selectedVariant?.weight || "1kg");
    } else if (qty < currentQty && qty >= 1) {
      decreaseQuantity(item.id, item.selectedVariant?.weight || "1kg");
    }
  };

  const handleRemoveOrderItem = (item) => {
    if (checkoutItem) {
      navigate("/cart");
      return;
    }

    removeFromCart(item.id, item.selectedVariant?.weight || "1kg");
  };

  const isPlaceholderStripePublishableKey = (key) =>
    !key || /^(pk_test_replace_me|pk_live_replace_me)$/i.test(key);
  const stripePublishableKey = (() => {
    const envKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (envKey && !isPlaceholderStripePublishableKey(envKey)) return envKey;
    if (backendStripePublishableKey && !isPlaceholderStripePublishableKey(backendStripePublishableKey)) return backendStripePublishableKey;
    return "";
  })();
  const stripeJsConfigured = Boolean(stripePublishableKey && !isPlaceholderStripePublishableKey(stripePublishableKey));
  const stripePromise = useMemo(() => {
    if (!stripeJsConfigured || !stripeEnabled) return null;
    return loadStripe(stripePublishableKey);
  }, [stripeJsConfigured, stripePublishableKey, stripeEnabled]);

  const stripeUnavailableMessage = !stripeEnabled || !stripeJsConfigured
    ? "Online card payments are temporarily unavailable. Please contact support."
    : "";

  const [stripeClientSecret, setStripeClientSecret] = useState("");
  const [stripeOrder, setStripeOrder] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const displayKey = stripePublishableKey
        ? `${stripePublishableKey.slice(0, 8)}...${stripePublishableKey.slice(-8)}`
        : "<missing>";
      console.info("[EZStore] Stripe publishable key loaded:", displayKey);
      console.info("[EZStore] Stripe configured:", stripeJsConfigured);
    }
  }, [stripePublishableKey, stripeJsConfigured]);

  const getBackendStripeError = (error) => {
    const response = error?.response?.data;
    const code = response?.meta?.code;
    // Map server error codes to customer-friendly messages
    if (code === "STRIPE_NOT_CONFIGURED" || code === "STRIPE_AUTH_ERROR" || code === "STRIPE_CONFIGURATION_ERROR" || code === "PAYMENT_UNAVAILABLE") {
      return "Online card payments are temporarily unavailable. Please try again later.";
    }
    return response?.message || error?.message || "Unable to place order. Please try again later.";
  };

  const pendingCheckoutKey = "ezstore_pending_checkout";
  const savePendingCheckout = (checkoutData) => {
    try {
      window.localStorage.setItem(pendingCheckoutKey, JSON.stringify(checkoutData));
    } catch {
      // Ignore storage failures.
    }
  };
  const loadPendingCheckout = () => {
    try {
      const raw = window.localStorage.getItem(pendingCheckoutKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };
  const clearPendingCheckout = () => {
    try {
      window.localStorage.removeItem(pendingCheckoutKey);
    } catch {
      // Ignore storage failures.
    }
  };

  const persistOrderForSuccess = (order) => {
    try {
      window.localStorage.setItem(
        `ezstore_recent_order_${order.orderNumber}`,
        JSON.stringify({ orderId: order.id, orderNumber: order.orderNumber, order })
      );
    } catch {
      // Ignore storage failures.
    }
  };

  useEffect(() => {
    const restorePending = () => {
      try {
        if (!stripePublishableKey) return;

        const pending = loadPendingCheckout();
        const isCurrentStripeAccount = pending?.stripePublishableKey === stripePublishableKey;
        const isRecent = Number(pending?.createdAt) > Date.now() - 30 * 60 * 1000;

        if (pending?.clientSecret && pending?.order && isCurrentStripeAccount && isRecent) {
          setStripeClientSecret(pending.clientSecret);
          setStripeOrder(pending.order);
          // A saved checkout has an order and PaymentIntent, but the card
          // payment has not been confirmed yet. Return to the payment step so
          // the Stripe form remains visible instead of showing confirmation.
          setCurrentStep(3);
          setPaymentConfirmed(false);
        } else if (pending) {
          clearPendingCheckout();
        }
      } catch {
        // Ignore failures restoring pending checkout state.
      }
    };

    restorePending();
  }, [stripePublishableKey]);

  const handleProceedToPayment = () => {
    const valid = validateCheckoutDetails();
    if (!valid) {
      setPaymentError("Please complete the address details before continuing to payment.");
      return;
    }

    if (!items.length || !Number.isFinite(total) || Number(total) <= 0) {
      setPaymentError("Your cart must contain at least one item with a valid total.");
      return;
    }

    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrderRef.current) {
      console.warn("[EZStore] Duplicate place order invocation prevented");
      return;
    }

    console.info("[EZStore] handlePlaceOrder invoked", { agreeTerms, currentStep });
    setPaymentError("");
    if (!agreeTerms) {
      console.info("[EZStore] handlePlaceOrder aborted: agreeTerms not accepted");
      setPaymentError("Please accept terms and conditions before confirming order.");
      return;
    }

    if (!validateCheckoutDetails()) {
      setPaymentError("Please complete address details before confirming order.");
      setCurrentStep(1);
      return;
    }

    if (!items.length || !Number.isFinite(total) || Number(total) <= 0) {
      setPaymentError("Your cart must contain at least one item with a valid total.");
      return;
    }

    if (!stripeJsConfigured) {
      setPaymentError("Online card payments are temporarily unavailable. Please try again later.");
      return;
    }

    if (!stripeEnabled) {
      setPaymentError("Online card payments are temporarily unavailable. Please try again later.");
      return;
    }

    const shippingAddress = {
      label: "Home",
      recipientName: fullName,
      phone,
      street: streetAddress,
      city,
      state,
      postalCode: pincode,
      country: pincode.trim().length === 6 ? "India" : "United States",
    };

    const payload = {
      customerEmail: email.trim(),
      customerName: fullName.trim(),
      customerPhone: phone,
      items: items.map((item) => ({
        id: Number(item.productId ?? item.id) || undefined,
        productSlug: item.productSlug || item.slug || undefined,
        productName: item.name,
        quantity: item.quantity,
        price: item.selectedVariant?.price ?? item.price,
        selectedVariant: item.selectedVariant || undefined,
      })),
      totalAmount: Number(total),
      shippingAddress,
      paymentMethod: "stripe",
      currency: "USD",
      metadata: {
        deliveryMethod: selectedDelivery,
        deliveryInstruction: selectedDeliveryInstruction,
        coupon: appliedCoupon?.code || null,
      },
      couponCode: appliedCoupon?.code || undefined,
    };

    isPlacingOrderRef.current = true;
    setIsPlacingOrder(true);
    setPaymentError("");

    try {
      const idempotencyKey = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      console.info("[EZStore] Sending Payment Request", { idempotencyKey, payload: { items: payload.items.length, total: payload.totalAmount, paymentMethod: payload.paymentMethod } });
      const response = await customerCommerceApi.createOrder(payload, idempotencyKey);

      if (response?.success === false && response?.meta?.code === "CART_UPDATED") {
        const warnings = Array.isArray(response?.warnings)
          ? response.warnings
          : Array.isArray(response?.data?.warnings)
          ? response.data.warnings
          : [];
        const message = warnings.length > 0 ? warnings.join(" ") : "Your cart was updated before checkout.";

        if (response?.data?.cart?.items) {
          const normalizedItems = response.data.cart.items.map((item) => ({
            ...item,
            id: Number(item.productId ?? item.id) || item.id,
            productId: Number(item.productId ?? item.id) || item.productId || item.id,
            name: item.productName ?? item.name ?? "Product",
            productName: item.productName ?? item.name ?? "Product",
            price: Number(item.unitPrice ?? item.price ?? 0),
            unitPrice: Number(item.unitPrice ?? item.price ?? 0),
            image: item.productImage ?? item.image ?? null,
            productImage: item.productImage ?? item.image ?? null,
            selectedVariant: item.selectedVariant || item.variant || undefined,
            quantity: Number(item.quantity ?? 1),
            productSlug: item.productSlug ?? item.slug ?? undefined,
          }));

          setUpdatedCartItems(normalizedItems);
        }

        if (typeof refreshCart === "function") {
          refreshCart().catch(() => {
            // refresh is best-effort; local checkout state already updated
          });
        }

        setPaymentError(message);
        return;
      }

      console.info("[EZStore] Payment Response received", { status: response?.status || null, dataSummary: { orderId: response?.data?.order?.id, paymentProvider: response?.data?.payment?.provider } });
      const order = response.data.order;
      const stripeData = response.data.stripe;

      // Persist order for the success page flow
      persistOrderForSuccess(order);

      if (!stripeData?.clientSecret) {
        throw new Error("Unable to initiate Stripe payment. Please try again later.");
      }

      setStripeClientSecret(stripeData.clientSecret);
      setStripeOrder(order);
      savePendingCheckout({
        clientSecret: stripeData.clientSecret,
        order,
        stripePublishableKey,
        createdAt: Date.now(),
      });
      return;
    } catch (error) {
      const isNetworkError = String(error?.message || "").toLowerCase().includes("network error");
      const errorMessage = getBackendStripeError(error);
      
      // Handle "Product not found" errors by removing the problematic product from cart
      if (errorMessage.includes("Product not found:")) {
        const productMatch = errorMessage.match(/product (\d+)/i);
        if (productMatch) {
          const productId = parseInt(productMatch[1], 10);
          console.warn(`[EZStore] Removing product ${productId} that was not found in inventory`);
          
          // Find and remove the product from cart
          const productToRemove = items.find(item => Number(item.productId ?? item.id) === productId);
          if (productToRemove) {
            removeFromCart(productToRemove.id, productToRemove.selectedVariant?.weight || "1kg");
          }
          
          const updatedItems = items.filter(item => Number(item.productId ?? item.id) !== productId);
          
          if (updatedItems.length > 0) {
            // Only show message about removal if there are remaining items
            setPaymentError(`Product ${productId} is no longer available and has been removed from your cart. Please review your cart and try again.`);
            
            // Trigger a refresh to sync with server
            if (typeof refreshCart === "function") {
              refreshCart().catch(() => {
                // refresh is best-effort
              });
            }
          } else {
            // If no items remain, show a different message
            setPaymentError("All items in your cart are no longer available. Please add items to your cart and try again.");
          }
        } else {
          const message = isNetworkError
            ? "Unable to reach the backend. Make sure the backend is running on http://localhost:5000 and refresh the page."
            : errorMessage;
          setPaymentError(message);
        }
      } else {
        const message = isNetworkError
          ? "Unable to reach the backend. Make sure the backend is running on http://localhost:5000 and refresh the page."
          : errorMessage;
        setPaymentError(message);
      }
      
      console.error("Order placement error:", error);
    } finally {
      isPlacingOrderRef.current = false;
      setIsPlacingOrder(false);
    }
  };

  // ─── STEP VALIDATION ───
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ─── PROGRESS STEPPER ─── */}
      <div className="sticky top-16 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-4 gap-2 py-1 sm:flex sm:gap-3">
            {steps.map((s, idx) => (
              <div key={s.step} className="flex flex-col items-center sm:flex-row sm:items-center sm:flex-1">
                <div
                  onClick={() => currentStep > s.step && setCurrentStep(s.step)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all ${
                    currentStep >= s.step ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {currentStep > s.step ? "✓" : s.step}
                </div>
                <div className="mt-1 text-[11px] sm:mt-0 sm:ml-3 font-semibold text-center sm:text-left leading-tight">{s.label}</div>
                {idx < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-1 sm:ml-3 ${currentStep > s.step ? "bg-emerald-600" : "bg-slate-200"}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── LEFT: FORM ─── */}
          <div className="flex-1 space-y-6">
            {/* ─── STEP 1: ADDRESS ─── */}
            {currentStep === 1 && (
              <>
                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => validateField("email", email)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        placeholder="john.doe@email.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => validateField("phone", phone)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                        placeholder="+1 987-654-3210"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-gray-800">Shipping Address</h3>
                    {isLoadingAddresses && <span className="text-xs text-gray-500">Loading saved addresses…</span>}
                  </div>
                  {savedAddresses.length > 0 && (
                    <div className="mb-5">
                      <label className="text-xs font-semibold text-gray-700">Use a saved address</label>
                      <select
                        value={selectedSavedAddressId}
                        onChange={(event) => applySavedAddress(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm"
                      >
                        <option value="">Enter a new address</option>
                        {savedAddresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.isDefault ? "Default — " : ""}{address.label || "Address"}: {address.street}, {address.city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => validateField("fullName", fullName)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Full Name"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label className="text-xs font-semibold text-gray-700">
                        Street Address *
                      </label>
                      <input
                        value={streetAddress}
                        onChange={(e) => {
                          setStreetAddress(e.target.value);
                          setSelectedSavedAddressId("");
                        }}
                        onBlur={() => validateField("streetAddress", streetAddress)}
                        className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.streetAddress ? "border-red-500" : "border-gray-300"}`}
                        placeholder="123 Oak Street"
                        autoComplete="street-address"
                      />
                      {addressSuggestions.length > 0 && (
                        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                          {addressSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.place_id}
                              type="button"
                              onClick={() => applyAddressSuggestion(suggestion)}
                              className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 last:border-b-0 hover:bg-green-50"
                            >
                              {suggestion.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                      {errors.streetAddress && (
                        <p className="text-xs text-red-500 mt-1">{errors.streetAddress}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Apartment, suite, building (Optional)
                      </label>
                      <input
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm mt-1"
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700">City *</label>
                        <input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          onBlur={() => validateField("city", city)}
                          className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.city ? "border-red-500" : "border-gray-300"}`}
                          placeholder="New York"
                        />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700">State *</label>
                        <input
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          onBlur={() => validateField("state", state)}
                          className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.state ? "border-red-500" : "border-gray-300"}`}
                          placeholder="State"
                        />
                        {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700">ZIP / Pincode *</label>
                        <div className="relative">
                          <input
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            onBlur={() => validateField("pincode", pincode)}
                            className={`w-full border rounded-lg p-3 text-sm mt-1 ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
                            placeholder="10001 or 500072"
                          />
                          {isFetchingPincode && (
                            <span className="absolute right-3 top-3 text-xs text-orange-500 font-medium animate-pulse">Fetching...</span>
                          )}
                        </div>
                        {pincodeMessage && !errors.pincode && (
                          <p className="text-xs text-emerald-600 font-medium mt-1">{pincodeMessage}</p>
                        )}
                        {errors.pincode && (
                          <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Billing Address</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      id="same-as-shipping"
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={() => setSameAsShipping(!sameAsShipping)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="same-as-shipping" className="text-sm font-semibold cursor-pointer">
                      Same as shipping address
                    </label>
                  </div>
                  {!sameAsShipping && (
                    <div className="space-y-3">
                      <div>
                        <input
                          placeholder="Billing Name"
                          className={`w-full border rounded-lg p-3 text-sm ${errors.billingName ? "border-red-500" : "border-gray-300"}`}
                          value={billingName}
                          onChange={(e) => setBillingName(e.target.value)}
                          onBlur={() => validateField("billingName", billingName)}
                        />
                        {errors.billingName && (
                          <p className="text-xs text-red-500 mt-1">{errors.billingName}</p>
                        )}
                      </div>
                      <div>
                        <input
                          placeholder="Billing Address"
                          className={`w-full border rounded-lg p-4 sm:p-3 text-sm ${errors.billingAddress ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500`}
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          onBlur={() => validateField("billingAddress", billingAddress)}
                        />
                        {errors.billingAddress && (
                          <p className="text-xs text-red-500 mt-2">{errors.billingAddress}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3">
                        <div>
                          <input
                            placeholder="City"
                            className={`w-full border rounded-lg p-4 sm:p-3 text-sm ${errors.billingCity ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500`}
                            value={billingCity}
                            onChange={(e) => setBillingCity(e.target.value)}
                            onBlur={() => validateField("billingCity", billingCity)}
                          />
                          {errors.billingCity && (
                            <p className="text-xs text-red-500 mt-2">{errors.billingCity}</p>
                          )}
                        </div>
                        <div>
                          <input
                            placeholder="State"
                            className="w-full border border-gray-300 rounded-lg p-4 sm:p-3 text-sm focus:outline-none focus:border-green-500"
                            value={billingState}
                            onChange={(e) => setBillingState(e.target.value)}
                          />
                        </div>
                        <div>
                          <div className="relative">
                            <input
                              placeholder="Pincode"
                              className={`w-full border rounded-lg p-4 sm:p-3 text-sm ${errors.billingPincode ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500`}
                              value={billingPincode}
                              onChange={(e) => setBillingPincode(e.target.value)}
                              onBlur={() => validateField("billingPincode", billingPincode)}
                            />
                            {isFetchingBillingPincode && (
                              <span className="absolute right-3 top-3 text-xs text-orange-500 font-medium animate-pulse">Fetching...</span>
                            )}
                          </div>
                          {billingPincodeMessage && !errors.billingPincode && (
                            <p className="text-xs text-emerald-600 font-medium mt-1">{billingPincodeMessage}</p>
                          )}
                          {errors.billingPincode && (
                            <p className="text-xs text-red-500 mt-2">{errors.billingPincode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (validateCheckoutDetails()) setCurrentStep(2);
                  }}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
                >
                  Continue to Shipping
                </button>
              </>
            )}

            {/* ─── STEP 2: SHIPPING ─── */}
            {currentStep === 2 && (
              <>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Delivery Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
                      <input
                        type="radio"
                        name="delivery"
                        checked={selectedDelivery === "standard"}
                        onChange={() => setSelectedDelivery("standard")}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Standard Delivery (3-5 Days)</div>
                        <div className="text-xs text-gray-500">Tue, 28 May – Thu, 30 May</div>
                      </div>
                      <div className="text-green-600 font-bold">FREE</div>
                    </label>
                    <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
                      <input
                        type="radio"
                        name="delivery"
                        checked={selectedDelivery === "express"}
                        onChange={() => setSelectedDelivery("express")}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Express Delivery (1-2 Days)</div>
                        <div className="text-xs text-gray-500">Sat, 25 May – Mon, 27 May</div>
                      </div>
                      <div className="font-bold">$99</div>
                    </label>
                  </div>
                  {!selectedDelivery && (
                    <p className="text-xs text-red-500 mt-3">Please select a delivery option</p>
                  )}
                </div>

                {/* ─── DELIVERY INSTRUCTIONS ─── */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Delivery Instructions</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
                      <input
                        type="radio"
                        name="instruction"
                        checked={selectedDeliveryInstruction === "ring-bell"}
                        onChange={() => setSelectedDeliveryInstruction("ring-bell")}
                      />
                      <span className="text-sm font-medium">Ring bell before delivery</span>
                    </label>
                    <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
                      <input
                        type="radio"
                        name="instruction"
                        checked={selectedDeliveryInstruction === "leave-door"}
                        onChange={() => setSelectedDeliveryInstruction("leave-door")}
                      />
                      <span className="text-sm font-medium">Leave at door</span>
                    </label>
                    <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
                      <input
                        type="radio"
                        name="instruction"
                        checked={selectedDeliveryInstruction === "call-first"}
                        onChange={() => setSelectedDeliveryInstruction("call-first")}
                      />
                      <span className="text-sm font-medium">Call me before delivery</span>
                    </label>
                    <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
                      <input
                        type="radio"
                        name="instruction"
                        checked={selectedDeliveryInstruction === "signature"}
                        onChange={() => setSelectedDeliveryInstruction("signature")}
                      />
                      <span className="text-sm font-medium">Require signature</span>
                    </label>
                    <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-green-50">
                      <input
                        type="radio"
                        name="instruction"
                        checked={selectedDeliveryInstruction === "neighbor"}
                        onChange={() => setSelectedDeliveryInstruction("neighbor")}
                      />
                      <span className="text-sm font-medium">Leave with neighbor</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
                >
                  Continue to Payment
                </button>
              </>
            )}

            {/* ─── STEP 3: PAYMENT ─── */}
            {currentStep === 3 && (
              <>
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-slate-600" />
                      <div><h3 className="font-semibold text-slate-900">Payment</h3><p className="mt-0.5 text-xs text-slate-500">Card and wallet payments are processed by Stripe.</p></div>
                    </div>
                  </div>
                  <div className="m-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"><img src={cardIcon} alt="Stripe" className="w-8 h-8 object-contain" /></div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">Credit card, debit card or wallet</div>
                        <div className="mt-1 text-xs text-slate-500">Enter your details on the next screen.</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">Your payment details are encrypted and are not stored by EZStore.</div>
                    <div className="hidden bg-linear-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-3">
                      <div className="font-semibold text-green-800 text-sm">🔒 100% Secure Payment</div>
                      <div className="text-xs text-green-700 mt-1">
                        PCI DSS compliant and encrypted with Stripe.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><TicketPercent className="h-4 w-4" /></div><div><h3 className="font-semibold text-slate-900">Promo code</h3><p className="text-xs text-slate-500">Apply a discount before you pay.</p></div></div>
                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code (Try: WELCOME10)"
                          className="flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center">
                      <div className="font-bold text-green-800">{appliedCoupon.code} Applied! ✓</div>
                      <div className="text-sm text-green-700">You saved ${discount}</div>
                      <button
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCoupon("");
                        }}
                        className="text-xs text-green-600 mt-2 underline"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {(paymentError || stripeUnavailableMessage) && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    {paymentError || stripeUnavailableMessage}
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className="mt-1"
                    />
                    <div className="flex-1 text-sm text-slate-600">
                      I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="font-medium text-emerald-700 underline">Terms of Service</button> and <button type="button" onClick={() => setShowTermsModal(true)} className="font-medium text-emerald-700 underline">Privacy Policy</button>
                    </div>
                  </label>
                </div>

                {!stripeClientSecret ? (
                  <button
                    type="button"
                    onClick={() => {
                      console.info("[EZStore] Confirm Order clicked", { agreeTerms, isPlacingOrder });
                      handlePlaceOrder();
                    }}
                    disabled={!agreeTerms || isPlacingOrder}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                    {isPlacingOrder ? "Opening payment..." : `Continue to payment · $${total.toFixed(2)}`}
                  </button>
                ) : null}
                {stripeClientSecret && stripeOrder ? (
                  <div className="mt-6">
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                      <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                      <span><strong>Almost done.</strong> Enter your payment details below.</span>
                    </div>
                    {stripePromise ? (
                      <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                        <PaymentSection
                          order={stripeOrder}
                          error={paymentError}
                          onError={setPaymentError}
                          clearCart={clearCart}
                          persistOrder={persistOrderForSuccess}
                          clearPendingCheckout={clearPendingCheckout}
                          navigate={navigate}
                          onSuccess={() => {
                            clearCart();
                            clearPendingCheckout();
                            setPaymentConfirmed(true);
                            if (stripeOrder?.orderNumber) {
                              navigate(`/order-success?orderNumber=${encodeURIComponent(stripeOrder.orderNumber)}`);
                            }
                          }}
                        />
                      </Elements>
                    ) : (
                      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                        Loading the secure payment form...
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            )}

            {/* ─── STEP 4: CONFIRMATION ─── */}
            {currentStep === 4 && (
              <>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Order Confirmation</h3>
                  <div className="space-y-4 text-sm">
                    <div className="pb-3 border-b border-gray-200">
                      <div className="font-semibold text-gray-700">Delivery To</div>
                      <div className="text-gray-600">
                        {fullName}, {streetAddress}, {city} - {pincode}
                      </div>
                    </div>
                    <div className="pb-3 border-b border-gray-200">
                      <div className="font-semibold text-gray-700">Delivery Method</div>
                      <div className="text-gray-600">
                        {selectedDelivery === "express"
                          ? "Express (1-2 Days) - $99"
                          : "Standard (3-5 Days) - FREE"}
                      </div>
                    </div>
                    <div className="pb-3 border-b border-gray-200">
                      <div className="font-semibold text-gray-700">Payment Method</div>
                      <div className="text-gray-600">Stripe secure online payment</div>
                    </div>
                    <div className="pb-3 border-b border-gray-200">
                      <div className="font-semibold text-gray-700">Delivery Instructions</div>
                      <div className="text-gray-600">
                        {selectedDeliveryInstruction === "ring-bell" && "Ring bell before delivery"}
                        {selectedDeliveryInstruction === "leave-door" && "Leave at door"}
                        {selectedDeliveryInstruction === "call-first" && "Call me before delivery"}
                        {selectedDeliveryInstruction === "signature" && "Require signature"}
                        {selectedDeliveryInstruction === "neighbor" && "Leave with neighbor"}
                      </div>
                    </div>
                    {appliedCoupon && (
                      <div className="pb-3 border-b border-gray-200">
                        <div className="font-semibold text-gray-700">Coupon Applied</div>
                        <div className="text-green-600">
                          {appliedCoupon.code} - Save ${discount}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {(paymentError || stripeUnavailableMessage) && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    {paymentError || stripeUnavailableMessage}
                  </div>
                )}

                {paymentConfirmed ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                      Your payment is confirmed and your order is now complete.
                    </div>
                    {stripeOrder?.orderNumber ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/order-success?orderNumber=${encodeURIComponent(stripeOrder.orderNumber)}`)
                        }
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
                      >
                        View Order Details
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* ─── RIGHT: ORDER SUMMARY ─── */}
          <aside className="w-full lg:w-96 h-fit">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-48">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 border-b border-gray-200 pb-4">
                {items && items.length > 0 ? (
                  items.map((item, idx) => {
                    const productForImage = getCatalogProduct(item) || item;
                    const imageSrc = resolveProductImage(productForImage);
                    const fallbackSrc = resolveProductImageFallback(productForImage);

                    return (
                    <div key={idx} className="flex items-start gap-3">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackSrc;
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 text-xs rounded"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 text-xs rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-bold text-sm">${itemPrice(item).toFixed(0)}</div>
                        <button
                          onClick={() => handleRemoveOrderItem(item)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">No items in cart</div>
                )}
              </div>

              {/* Pricing */}
              <div className="mt-4 space-y-2 text-sm border-b border-gray-200 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discount}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-2xl text-green-600">${total.toFixed(0)}</span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 text-xs">
                  <img
                    src={secureBadge}
                    alt="Secure"
                    className="w-8 h-8 shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold">100% Secure</div>
                    <div className="text-gray-500">SSL Encrypted</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <img
                    src={easyReturnsBadge}
                    alt="Returns"
                    className="w-8 h-8 shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold">Easy Returns</div>
                    <div className="text-gray-500">7 days hassle-free</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <img
                    src={fastDeliveryBadge}
                    alt="Delivery"
                    className="w-8 h-8 shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold">Fast Delivery</div>
                    <div className="text-gray-500">On-time guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── TERMS MODAL ─── */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  <strong>1. Order Acceptance:</strong> We reserve the right to accept or reject any
                  order at our discretion.
                </p>
                <p>
                  <strong>2. Pricing:</strong> All prices include applicable taxes unless stated
                  otherwise.
                </p>
                <p>
                  <strong>3. Delivery:</strong> Delivery dates are estimates and not guaranteed. We
                  will use our best efforts to deliver within the specified timeframe.
                </p>
                <p>
                  <strong>4. Returns & Refunds:</strong> Items can be returned within 7 days of
                  delivery in original condition for a full refund.
                </p>
                <p>
                  <strong>5. Payment:</strong> We accept all major payment methods. Your payment
                  information is secure and encrypted.
                </p>
                <p>
                  <strong>6. Liability:</strong> We are not liable for any indirect or consequential
                  damages.
                </p>
                <p>
                  <strong>7. Privacy:</strong> Your personal information will be kept confidential
                  and used only for order fulfillment.
                </p>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
