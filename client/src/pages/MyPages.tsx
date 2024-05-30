import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/mypages.css';

export const MyPages = () => {
  const [subscriptionLevel, setSubscriptionLevel] = useState('');

  useEffect(() => {
    // Hämta nuvarande prenumerationsnivå
    axios.get('http://localhost:3000/subscription', { params: { userId: '1' } }) 
      .then(response => {
        console.log('Response from server:', response.data); 
        setSubscriptionLevel(response.data.subscriptionLevel);
      })
      .catch(error => {
        console.error('There was an error fetching the subscription level!', error);
      });
  }, []);

  const handleUpgradeDowngrade = (level: string) => {
    axios.post('http://localhost:3000/subscription', { userId: '1', subscriptionLevel: level }) 
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
