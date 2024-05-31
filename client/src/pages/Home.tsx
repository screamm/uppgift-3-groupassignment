import "../styles/home.css";
import img1 from "../img/lvl1.png";
import img2 from "../img/lvl2.png";
import img3 from "../img/lvl3.png";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";

export const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/articles/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const descriptions = [
    [
      "2 months for 1 kr then 50% off for 3 months. After that, regular price 149 kr/month. No commitment.",
      "Access to all articles on Alpaca News website and in the app",
      "E-newspaper all week - our digital version of the paper newspaper",
      "Share your subscription with 2 family members",
      "Crosswords and Sudoku",
      "Paper newspaper - choose between weekend or all week",
    ],
    [
      "Access to all articles on Alpaca News website and in the app",
      "E-newspaper all week - our digital version of the paper newspaper",
      "Share your subscription with 4 family members",
      "Crosswords and Sudoku",
      "Monthly exclusive video content on alpaca care and lifestyle",
      "Quarterly alpaca-themed gifts (e.g., small items like keychains or socks made of alpaca wool)",
      "Invitation to bi-monthly virtual alpaca farm tours",
    ],
    [
      "Includes all benefits of Alpacka Basic and Alpacka Insights, plus:",
      "Adopt an alpaca - receive updates and photos of your adopted alpaca",
      "Exclusive alpaca wool scarf sent to your home upon subscribing",
      "Monthly alpaca-themed gift (e.g., keychain, mug, or stationery)",
      "Invitation to virtual alpaca farm tours and live Q&A sessions with alpaca experts",
      "Annual alpaca farm visit - a day at an alpaca farm (travel not included)",
      "Personalized alpaca merchandise (e.g., a customized alpaca plush toy with your name)",
    ],
  ];

  return (
    <>
      <h1>ALPACA NEWS</h1>
      <div className="container">
        {products.map(
          (
            product: {
              id: Key | null | undefined;
              name:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined;
              price: number;
            },
            index: number
          ) => (
            <div className="subscriptionBox" key={product.id}>
              <img
                src={index === 0 ? img1 : index === 1 ? img2 : img3}
                alt="Product Image"
              />
              <h2>{product.name}</h2>
              <h3>{product.price} kr/week</h3>
              <ul>
                {descriptions[index].map((description, i) => (
                  <li key={i}>{description}</li>
                ))}
              </ul>
              <button className="button">GET STARTED</button>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Home;
