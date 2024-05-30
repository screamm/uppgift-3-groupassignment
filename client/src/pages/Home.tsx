import "../styles/home.css";
import img1 from "../img/lvl1.png";
import img2 from "../img/lvl2.png";
import img3 from "../img/lvl3.png";

export const Home = () => {
  return (
    <>
      <h1>ALPACA NEWS</h1>
      <div className="container">
        <div className="subscriptionBox">
          <img src={img1} alt="Product Image" />
          <h2>Alpacka Basic</h2>
          <h3>1 kr</h3>
          <p>
            2 months for 1 kr then 50% off for 3 months. After that, regular
            price 149 kr/month. No commitment.
          </p>
          <ul>
            <li>Access to all articles on Alpaca Digest and in the news app</li>
            <li>
              E-newspaper all week - our digital version of the paper newspaper
            </li>
            <li>Share your subscription with 2 family members</li>
            <li>Crosswords and Sudoku</li>
            <li>Paper newspaper - choose between weekend or all week</li>
          </ul>
          <button className="button">GET STARTED</button>
        </div>
        <div className="subscriptionBox">
          <img src={img2} alt="Product Image" />
          <h2>Alpacka Insights</h2>
          <h3>49 kr/month</h3>
          <p>Access to all articles on Alpaca Digest and in the news app</p>
          <ul>
            <li>
              E-newspaper all week - our digital version of the paper newspaper
            </li>
            <li>Share your subscription with 4 family members</li>
            <li>Crosswords and Sudoku</li>
            <li>
              Monthly exclusive video content on alpaca care and lifestyle
            </li>
            <li>
              Quarterly alpaca-themed gifts (e.g., small items like keychains or
              socks made of alpaca wool)
            </li>
            <li>Invitation to bi-monthly virtual alpaca farm tours</li>
          </ul>
          <button className="button">GET STARTED</button>
        </div>
        <div className="subscriptionBox">
          <img src={img3} alt="Product Image" />
          <h2>Alpacka Elite</h2>
          <h3>499 kr/month</h3>
          <p>
            Includes all benefits of Alpacka Basic and Alpacka Insights, plus:
          </p>
          <ul>
            <li>
              Adopt an alpaca - receive updates and photos of your adopted
              alpaca
            </li>
            <li>
              Exclusive alpaca wool scarf sent to your home upon subscribing
            </li>
            <li>
              Monthly alpaca-themed gift (e.g., keychain, mug, or stationery)
            </li>
            <li>
              Invitation to virtual alpaca farm tours and live Q&A sessions with
              alpaca experts
            </li>
            <li>
              Annual alpaca farm visit - a day at an alpaca farm (travel not
              included)
            </li>
            <li>
              Personalized alpaca merchandise (e.g., a customized alpaca plush
              toy with your name)
            </li>
          </ul>
          <button className="button">GET STARTED</button>
        </div>
      </div>
    </>
  );
};

export default Home;
