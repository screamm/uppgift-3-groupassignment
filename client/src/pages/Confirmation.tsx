import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User"; // Importera User-gränssnittet

export const Confirmation = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    console.log("useEffect verified payment");
    const verifyPayment = async () => {
      const sessionId = localStorage.getItem("stripeSessionId"); // Hämta sessionId från localStorage
      const userString = localStorage.getItem("user");
      console.log("verifyPayment called");
      console.log("sessionId:", sessionId);

      if (!sessionId) {
        console.log("Session ID saknas.");
        setStatus("Session ID saknas.");
        return;
      }

      let userId: string | null = null;
      let subscriptionId: string | null = null;
      if (userString) {
        try {
          const user: User = JSON.parse(userString); // Använd User typen här
          userId = user._id;
          subscriptionId = user.subscriptionId || null;
        } catch (error) {
          console.error("Error parsing user:", error);
          setStatus("Ett fel inträffade vid hämtning av användaruppgifter.");
          return;
        }
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

          // Logga in användaren och spara sessionId och subscriptionId
          if (userId && sessionId && response.data.subscriptionId) {
            login(
              {
                ...response.data.user,
                subscriptionId: response.data.subscriptionId,
              },
              sessionId
            );
          }
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
