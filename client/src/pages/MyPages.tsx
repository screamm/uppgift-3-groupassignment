import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/mypages.css';

export const MyPages = () => {
  const [subscriptionLevel, setSubscriptionLevel] = useState('');
  const [newSubscriptionLevel, setNewSubscriptionLevel] = useState('');

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
    <div className="mypages-container">
      <h1 className="mypages-title">My Pages</h1>
      <p className="mypages-subscription">Current Subscription Level: <strong>{subscriptionLevel}</strong></p>

      <div className="mypages-buttons">
        <p className="mypages-change-text">Change Subscription Level:</p>
        <button
          onClick={() => handleUpgradeDowngrade('News Site')}
          className="mypages-button"
        >
          News Site
        </button>
        <button
          onClick={() => handleUpgradeDowngrade('Digital')}
          className="mypages-button"
        >
          Digital
        </button>
        <button
          onClick={() => handleUpgradeDowngrade('Digital & Paper')}
          className="mypages-button"
        >
          Digital & Paper
        </button>
      </div>
    </div>
  );
};

export default MyPages;