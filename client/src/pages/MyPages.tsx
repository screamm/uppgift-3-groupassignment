import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/mypages.css";
import { useAuth } from "../context/AuthContext";

export const MyPages = () => {
  const { sessionId } = useAuth();
  const [subscriptionLevel, setSubscriptionLevel] = useState("");

  useEffect(() => {
    const storedSessionId =
      sessionId || localStorage.getItem("stripeSessionId");
    console.log("Session ID from localStorage:", storedSessionId);
    if (!storedSessionId) {
      console.error("Session ID is missing");
      return;
    }

    axios
      .get("http://localhost:3000/stripe/verify-session", {
        params: { sessionId: storedSessionId },
      })
      .then((response) => {
        console.log("Response from server:", response.data);
        setSubscriptionLevel(response.data.subscriptionLevel);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the subscription level!",
          error
        );
      });
  }, [sessionId]);

  const handleUpgradeDowngrade = (level: string) => {
    const storedSessionId =
      sessionId || localStorage.getItem("stripeSessionId");
    if (!storedSessionId) {
      console.error("Session ID is missing");
      return;
    }

    axios
      .post("http://localhost:3000/subscription", {
        sessionId: storedSessionId,
        subscriptionLevel: level,
      })
      .then((response) => {
        console.log("Updated subscription level to:", level);
        setSubscriptionLevel(level);
        alert(response.data.message);
      })
      .catch((error) => {
        console.error(
          "There was an error updating the subscription level!",
          error
        );
      });
  };

  return (
    <div className="mypages-container">
      <h1 className="mypages-title">My Pages</h1>
      <p className="mypages-subscription">
        Current Subscription Level: <strong>{subscriptionLevel}</strong>
      </p>

      <div className="mypages-buttons">
        <p className="mypages-change-text">Change Subscription Level:</p>
        <button
          onClick={() => handleUpgradeDowngrade("basic")}
          className="mypages-button">
          Basic
        </button>
        <button
          onClick={() => handleUpgradeDowngrade("insights")}
          className="mypages-button">
          Insight
        </button>
        <button
          onClick={() => handleUpgradeDowngrade("elite")}
          className="mypages-button">
          Elite
        </button>
      </div>
    </div>
  );
};

export default MyPages;
