// TESTAR
import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import "../styles/mypages.css";  
import { useAuth } from "../context/AuthContext";
import "./Admin";
import { IArticle } from "../models/Article";

export const MyPages = () => {
  const { stripeSessionId } = useAuth();
  const [subscriptionLevel, setSubscriptionLevel] = useState("");
  const [sortedArticles, setSortedArticles] = useState<IArticle[]>([]);
  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);


  useEffect(() => {
    const storedSessionId =
      stripeSessionId || localStorage.getItem("stripeSessionId");
    console.log("Session ID from localStorage:", storedSessionId);
    if (!storedSessionId) {
      console.error("Session ID is missing");
      return;
    }
 
    axios
      .get("http://localhost:3000/subscription/session", {
        params: { sessionId: storedSessionId },
      })
      .then((response) => {
        console.log("Response from server:", response.data);
        setSubscriptionLevel(response.data.subscriptionLevel);
        setNextBillingDate(new Date(response.data.nextBillingDate));
        getArticles(response.data.subscriptionLevel);
        setEndDate(response.data.endDate ? new Date(response.data.endDate) : null);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the subscription level!",
          error
        );
      });


  }, [stripeSessionId]);
  const getArticles = (level: string) => {
  fetch("http://localhost:3000/articles/articles")
  .then((response) => response.json())
  .then((data) => {
      console.log('articles: ', data);

      let articles:IArticle[] = (data.default);

      const articlesForLevel: SetStateAction<IArticle[]> = [];
      console.log(level)
      if (level === "Alpaca Elite") {
        articles.map((article) => {
          articlesForLevel.push(article);    
        })   
      }else if(level === "Alpaca Insight") { 
        articles.map((article) => {
          if (article.level === level || article.level === "Alpaca Basic") {
            articlesForLevel.push(article);    
          }
        })          
      } else if (level === "Alpaca Basic") {
        articles.map((article) => {
          if (article.level === level) {
            articlesForLevel.push(article);
          }
        })
      } else {
        return;
      }   
    
      setSortedArticles(articlesForLevel);
      console.log('articles for this users level: ', articlesForLevel);
      console.log(level);
      
  })
  .catch((error) => {
      console.error("Error fetching content pages:", error);
  });
}

  const handleUpgradeDowngrade = (level: string) => {
    const storedSessionId =
      stripeSessionId || localStorage.getItem("stripeSessionId");
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

  const handleCancelSubscription = () => {
    const storedSessionId =
      stripeSessionId || localStorage.getItem("stripeSessionId");
    if (!storedSessionId) {
      console.error("Session ID is missing");
      return;
    }

    if (window.confirm("Vill du verkligen avsluta prenumerationen?")) {
      axios
        .post("http://localhost:3000/subscription/cancel", {
          sessionId: storedSessionId,
        })
        .then((response) => {
          console.log("Subscription cancelled:", response.data);
          alert(response.data.message);
        })
        .catch((error) => {
          console.error(
            "There was an error cancelling the subscription!",
            error
          );
        });
    }
  };

  return (
    <div className="mypages-container">
      <h1 className="mypages-title">My Pages</h1>
      <p className="mypages-subscription">
        Current Subscription Level: <strong>{subscriptionLevel}</strong>
      </p>
      <p className="mypages-subscription">
        Next Billing Date: <strong>{nextBillingDate ? nextBillingDate.toLocaleDateString() : "Invalid Date"}</strong>
      </p>
      <p className="mypages-subscription">
        End Date: <strong>{endDate ? endDate.toLocaleDateString() : "Invalid Date"}</strong>
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
      <div className="mypages-buttons">
        <button
          onClick={handleCancelSubscription}
          className="mypages-button cancel-button">
          Avsluta Abonemang
        </button>
      </div>
      <h1>My Articles</h1>
      <div>
        {sortedArticles.map((article, index) => (
        <div key={index} className="contentPage">
          <h3>{article.title}</h3>
          <p>Level: {article.level}</p> {/* Visa prenumerationen baserat på krävd nivå */}
          <p>{article.description}</p>
        </div>
        ))}
      </div>
    </div>
  );
};
 
export default MyPages;