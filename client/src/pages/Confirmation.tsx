import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export const Confirmation = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<string>("");
  const [stripeId, setStripeId] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      console.log("verifyPayment called");
      console.log("sessionId:", sessionId);

      try {
        const response = await axios.post(
          "http://localhost:3000/stripe/verify-session",
          { sessionId },
          { withCredentials: true }
        );
        console.log("Response from verify-session:", response.data);

        if (response.data.verified) {
          setStatus("Betalningen gick igenom! Tack för ditt köp!");
          setStripeId(response.data.stripeId);
        } else {
          setStatus("Köpet gick inte igenom. Försök igen.");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        setStatus("Ett fel inträffade vid verifieringen av betalningen.");
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      console.log("Session ID saknas.");
      setStatus("Session ID saknas.");
    }
  }, [sessionId]);

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Betalningsstatus</h1>
      <p>{status}</p>
      {stripeId && <p>Ditt Stripe ID: {stripeId}</p>}
      <div>
        {status.includes("Tack för ditt köp!") ? (
          <button onClick={() => handleRedirect("/mypages")}>
            Gå till mina sidor
          </button>
        ) : (
          <button onClick={() => handleRedirect("/")}>
            Gå till startsidan
          </button>
        )}
      </div>
    </div>
  );
};

export default Confirmation;
