import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/common/PageLoader";
import authApi from "../../services/authApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/toast-context";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const finalizeGoogleLogin = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      const authError = searchParams.get("error");

      if (authError) {
        error("Google sign-in was cancelled or failed. Please try again.");
        navigate("/login", { replace: true });
        return;
      }

      if (!token) {
        error("We could not complete the Google sign-in. Please try again.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        window.localStorage.setItem("ezstore_token", token);
        const response = await authApi.get("/auth/me");
        const authUser = response.data?.user;

        if (authUser) {
          login(authUser, token);
          navigate("/", { replace: true });
          return;
        }

        throw new Error("No authenticated user returned");
      } catch (err) {
        error(err.response?.data?.message || "Unable to finish Google sign-in.");
        navigate("/login", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    finalizeGoogleLogin();
  }, [error, login, navigate]);

  if (!isProcessing) {
    return null;
  }

  return <PageLoader />;
};

export default GoogleAuthCallback;
