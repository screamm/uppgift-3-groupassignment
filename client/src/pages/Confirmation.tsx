import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Confirmation = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = localStorage.getItem("stripeSessionId"); // Hämta sessionId från localStorage
      console.log("verifyPayment called");
      console.log("sessionId:", sessionId);

      if (!sessionId) {
        console.log("Session ID saknas.");
        setStatus("Session ID saknas.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/stripe/verify-session",
          { sessionId },
          { withCredentials: true }
        );
        console.log("Response from verify-session:", response.data);

        if (response.data.verified) {
          setStatus("Betalningen gick igenom! Tack för ditt köp!");
          setEmail(response.data.email);
        } else {
          setStatus("Köpet gick inte igenom. Försök igen.");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        setStatus("Ett fel inträffade vid verifieringen av betalningen.");
      }
    };

    verifyPayment();
  }, []);

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Betalningsstatus</h1>
      <p>{status}</p>
      {email && <p>Din e-post: {email}</p>}
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
