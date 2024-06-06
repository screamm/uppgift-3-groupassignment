import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Checkout = () => {
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  useEffect(() => {
    if (!sessionId) {
      console.error("No session ID found");
      return;
    }

    // Omdirigera användaren till Stripe Checkout-sidan
    window.location.replace(`https://checkout.stripe.com/pay/${sessionId}`);
  }, [sessionId]);

  return (
    <div className="checkout-container">
      <h1>Redirecting to payment...</h1>
    </div>
  );
};

export default Checkout;
