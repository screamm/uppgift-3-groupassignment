import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const MyPages = () => {
  const [subscriptionLevel, setSubscriptionLevel] = useState('');
//   const [newSubscriptionLevel, setNewSubscriptionLevel] = useState('');

  useEffect(() => {
    // Hämta nuvarande prenumerationsnivå
    axios.get('/api/user/subscription', { params: { userId: '1' } }) // Anpassa userId efter autentisering
      .then(response => {
        setSubscriptionLevel(response.data.subscriptionLevel);
      })
      .catch(error => {
        console.error('There was an error fetching the subscription level!', error);
      });
  }, []);

  const handleUpgradeDowngrade = (level: string) => {
    axios.post('/api/user/subscription', { userId: '1', subscriptionLevel: level }) // Anpassa userId efter autentisering
      .then(response => {
        setSubscriptionLevel(level);
        alert(response.data.message);
      })
      .catch(error => {
        console.error('There was an error updating the subscription level!', error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">My Pages</h1>
      <p className="mb-4">Current Subscription Level: <strong>{subscriptionLevel}</strong></p>

      <div className="flex flex-col items-center">
        <p className="mb-4">Change Subscription Level:</p>
        <button
          onClick={() => handleUpgradeDowngrade('News Site')}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
        >
          News Site
        </button>
        <button
          onClick={() => handleUpgradeDowngrade('Digital')}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
        >
          Digital
        </button>
        <button
          onClick={() => handleUpgradeDowngrade('Digital & Paper')}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Digital & Paper
        </button>
      </div>
    </div>
  );
};

export default MyPages;






// export const MyPages = () => {
//     return (
//         <div>
//             <h3>MY PAGES som visar artikelnivån</h3>
//             <h2>här ska du uppgradera/nergradera din sub</h2>
//             <h2>du ska även kunna se hur länge din sub är igång osv</h2>
//         </div>
//     );
// };
