import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/mypages.css';
import { useAuth } from '../context/AuthContext';

export const MyPages = () => {
  const [subscriptionLevel, setSubscriptionLevel] = useState('');
  const { stripeId } = useAuth();

  useEffect(() => {
    console.log("Stripe ID from AuthContext:", stripeId);
    if (!stripeId) {
      console.error('Stripe ID is missing');
      return;
    }

    axios.get('http://localhost:3000/subscription/session', { params: { sessionId: stripeId } })
      .then(response => {
        console.log('Response from server:', response.data);
        setSubscriptionLevel(response.data.subscriptionLevel); // Assuming the response has a 'subscriptionLevel' field
      })
      .catch(error => {
        console.error('There was an error fetching the subscription level!', error);
      });
  }, [stripeId]);

  const handleUpgradeDowngrade = (level: string) => {
    if (!stripeId) {
      console.error('Stripe ID is missing');
      return;
    }

    axios.post('http://localhost:3000/subscription', { stripeId, subscriptionLevel: level })
      .then(response => {
        console.log('Updated subscription level to:', level);
        setSubscriptionLevel(level);
        alert(response.data.message);
      })
      .catch(error => {
        console.error('There was an error updating the subscription level!', error);
      });
  };

  return (
    <div className="mypages-container">
      <h1 className="mypages-title">My Pages</h1>
      <p className="mypages-subscription">Current Subscription Level: <strong>{subscriptionLevel}</strong></p>

      <div className="mypages-buttons">
        <p className="mypages-change-text">Change Subscription Level:</p>
        <button
          onClick={() => handleUpgradeDowngrade('basic')}
          className="mypages-button"
        >
          Basic
        </button>
        <button
          onClick={() => handleUpgradeDowngrade('insights')}
          className="mypages-button"
        >
          Insight
        </button>
        <button
          onClick={() => handleUpgradeDowngrade('elite')}
          className="mypages-button"
        >
          Elite
        </button>
      </div>
    </div>
  );
};

export default MyPages;





// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/mypages.css';
// import { useAuth } from '../context/AuthContext'; 

// export const MyPages = () => {
//   const [subscriptionLevel, setSubscriptionLevel] = useState('');
//   const { userId } = useAuth();

//   useEffect(() => {
//     if (!userId) {
//       console.error('User ID is missing');
//       return;
//     }

//     axios.get('http://localhost:3000/subscription', { params: { userId } }) 
//       .then(response => {
//         console.log('Response from server:', response.data); 
//         setSubscriptionLevel(response.data.subscriptionLevel);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the subscription level!', error);
//       });
//   }, [userId]);

//   const handleUpgradeDowngrade = (level: string) => {
//     if (!userId) {
//       console.error('User ID is missing');
//       return;
//     }

//     axios.post('http://localhost:3000/subscription', { userId, subscriptionLevel: level }) 
//       .then(response => {
//         console.log('Updated subscription level to:', level); 
//         setSubscriptionLevel(level);
//         alert(response.data.message);
//       })
//       .catch(error => {
//         console.error('There was an error updating the subscription level!', error);
//       });
//   };

//   return (
//     <div className="mypages-container">
//       <h1 className="mypages-title">My Pages</h1>
//       <p className="mypages-subscription">Current Subscription Level: <strong>{subscriptionLevel}</strong></p>

//       <div className="mypages-buttons">
//         <p className="mypages-change-text">Change Subscription Level:</p>
//         <button
//           onClick={() => handleUpgradeDowngrade('basic')}
//           className="mypages-button"
//         >
//           Basic
//         </button>
//         <button
//           onClick={() => handleUpgradeDowngrade('insights')}
//           className="mypages-button"
//         >
//           Insight
//         </button>
//         <button
//           onClick={() => handleUpgradeDowngrade('elite')}
//           className="mypages-button"
//         >
//           Elite
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyPages;














// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import '../styles/mypages.css';

// // export const MyPages = () => {
// //   const [subscriptionLevel, setSubscriptionLevel] = useState('');

// //   useEffect(() => {
// //     // Hämta nuvarande prenumerationsnivå
// //     axios.get('http://localhost:3000/subscription', { params: { userId: '1' } }) 
// //       .then(response => {
// //         console.log('Response from server:', response.data); 
// //         setSubscriptionLevel(response.data.subscriptionLevel);
// //       })
// //       .catch(error => {
// //         console.error('There was an error fetching the subscription level!', error);
// //       });
// //   }, []);

// //   const handleUpgradeDowngrade = (level: string) => {
// //     axios.post('http://localhost:3000/subscription', { userId: '1', subscriptionLevel: level }) 
// //       .then(response => {
// //         console.log('Updated subscription level to:', level); 
// //         setSubscriptionLevel(level);
// //         alert(response.data.message);
// //       })
// //       .catch(error => {
// //         console.error('There was an error updating the subscription level!', error);
// //       });
// //   };

// //   return (
// //     <div className="mypages-container">
// //       <h1 className="mypages-title">My Pages</h1>
// //       <p className="mypages-subscription">Current Subscription Level: <strong>{subscriptionLevel}</strong></p>

// //       <div className="mypages-buttons">
// //         <p className="mypages-change-text">Change Subscription Level:</p>
// //         <button
// //           onClick={() => handleUpgradeDowngrade('basic')}
// //           className="mypages-button"
// //         >
// //           Basic
// //         </button>
// //         <button
// //           onClick={() => handleUpgradeDowngrade('insights')}
// //           className="mypages-button"
// //         >
// //           Insight
// //         </button>
// //         <button
// //           onClick={() => handleUpgradeDowngrade('elite')}
// //           className="mypages-button"
// //         >
// //           Elite
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MyPages;
