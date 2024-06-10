import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Checkout = () => {
  const location = useLocation();
  const sessionId = location.state?.sessionId;
  const url = location.state?.url;

  useEffect(() => {
    if (!sessionId || !url) {
      console.error("No session ID or URL found");
      return;
    }

    console.log("Redirecting to Stripe Checkout with URL:", url);
    window.location.replace(url);
  }, [sessionId, url]);

  return (
    <div className="checkout-container">
      <h1>Redirecting to payment...</h1>
    </div>
  );
};

export default Checkout;

// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// export const Checkout = () => {
//   const location = useLocation();
//   const sessionId = location.state?.sessionId;
//   const url = location.state?.url;

//   useEffect(() => {
//     if (!sessionId || !url) {
//       console.error("No session ID or URL found");
//       return;
//     }

//     // Omdirigera användaren till Stripe Checkout-sidan
//     window.location.replace(url);
//   }, [sessionId, url]);

//   return (
//     <div className="checkout-container">
//       <h1>Redirecting to payment...</h1>
//     </div>
//   );
// };

// export default Checkout;
